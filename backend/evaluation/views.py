from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Count, Avg, Q
from datetime import datetime, timedelta
import time
import os

# Google Cloud Vision imports (with fallback for development)
try:
    from google.cloud import vision
    VISION_AVAILABLE = True
except ImportError:
    VISION_AVAILABLE = False
    print("Google Cloud Vision not available. Using mock OCR for development.")

from .models import Evaluation, OCRRequest
from .serializers import (
    EvaluationSerializer, EvaluationCreateSerializer, EvaluationUpdateSerializer,
    OCRRequestSerializer, OCRRequestCreateSerializer, OCRRequestUpdateSerializer,
    EvaluationStatsSerializer
)

class EvaluationViewSet(ModelViewSet):
    """ViewSet for managing evaluations"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only return evaluations for classes created by the current user
        return Evaluation.objects.filter(class_group__created_by=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EvaluationCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return EvaluationUpdateSerializer
        return EvaluationSerializer
    
    def perform_create(self, serializer):
        serializer.save(evaluator=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get evaluation statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total_evaluations': queryset.count(),
            'average_score': queryset.aggregate(avg_score=Avg('score'))['avg_score'] or 0,
            'grade_distribution': {},
            'evaluation_type_distribution': {},
            'recent_evaluations': EvaluationSerializer(
                queryset.order_by('-created_at')[:5], many=True
            ).data
        }
        
        # Grade distribution
        for grade_choice in Evaluation.GRADE_CHOICES:
            grade = grade_choice[0]
            stats['grade_distribution'][grade] = queryset.filter(grade=grade).count()
        
        # Evaluation type distribution
        for eval_type in Evaluation.EVALUATION_TYPE_CHOICES:
            eval_type_key = eval_type[0]
            stats['evaluation_type_distribution'][eval_type_key] = queryset.filter(
                evaluation_type=eval_type_key
            ).count()
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def by_class(self, request):
        """Get evaluations filtered by class"""
        class_id = request.query_params.get('class_id')
        if not class_id:
            return Response({
                'error': 'class_id parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(class_group_id=class_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """Get evaluations filtered by student"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({
                'error': 'student_id parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(student_id=student_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def auto_grade(self, request, pk=None):
        """Auto-calculate grade based on score"""
        evaluation = self.get_object()
        if evaluation.max_score > 0:
            evaluation.grade = evaluation.calculate_grade()
            evaluation.save()
            return Response({
                'message': 'Grade calculated automatically',
                'grade': evaluation.grade,
                'percentage': evaluation.percentage_score
            })
        return Response({
            'error': 'Cannot calculate grade: max_score is 0'
        }, status=status.HTTP_400_BAD_REQUEST)

class OCRRequestViewSet(ModelViewSet):
    """ViewSet for managing OCR requests"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return OCRRequest.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OCRRequestCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OCRRequestUpdateSerializer
        return OCRRequestSerializer
    
    def perform_create(self, serializer):
        ocr_request = serializer.save(
            user=self.request.user,
            file_name=serializer.validated_data['input_file'].name
        )
        # Process OCR asynchronously
        self._process_ocr_async(ocr_request)
    
    def _process_ocr_async(self, ocr_request):
        """Process OCR request using Google Cloud Vision or mock"""
        try:
            ocr_request.status = 'processing'
            ocr_request.save()
            
            start_time = time.time()
            
            if VISION_AVAILABLE and os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
                # Use actual Google Cloud Vision
                result = self._process_with_google_vision(ocr_request)
            else:
                # Use mock OCR for development
                result = self._process_with_mock_ocr(ocr_request)
            
            processing_time = time.time() - start_time
            
            ocr_request.result_text = result['text']
            ocr_request.confidence_scores = result.get('confidence_scores', {})
            ocr_request.detected_languages = result.get('detected_languages', [])
            ocr_request.processing_time = processing_time
            ocr_request.status = 'completed'
            ocr_request.processed_at = timezone.now()
            ocr_request.save()
            
        except Exception as e:
            ocr_request.status = 'failed'
            ocr_request.error_message = str(e)
            ocr_request.processed_at = timezone.now()
            ocr_request.save()
    
    def _process_with_google_vision(self, ocr_request):
        """Process OCR using Google Cloud Vision"""
        client = vision.ImageAnnotatorClient()
        
        # Read the image file
        with open(ocr_request.input_file.path, 'rb') as image_file:
            content = image_file.read()
        
        image = vision.Image(content=content)
        
        # Perform text detection
        response = client.text_detection(image=image)
        texts = response.text_annotations
        
        if response.error.message:
            raise Exception(f"Google Vision API error: {response.error.message}")
        
        # Extract text and confidence scores
        detected_text = texts[0].description if texts else ''
        
        # Get language detection
        response_lang = client.document_text_detection(image=image)
        detected_languages = []
        if response_lang.full_text_annotation and response_lang.full_text_annotation.pages:
            for page in response_lang.full_text_annotation.pages:
                for block in page.blocks:
                    for paragraph in block.paragraphs:
                        if paragraph.property and paragraph.property.detected_languages:
                            for lang in paragraph.property.detected_languages:
                                if lang.language_code not in detected_languages:
                                    detected_languages.append(lang.language_code)
        
        return {
            'text': detected_text,
            'confidence_scores': {
                'overall': texts[0].confidence if texts else 0
            },
            'detected_languages': detected_languages
        }
    
    def _process_with_mock_ocr(self, ocr_request):
        """Mock OCR processing for development"""
        # Simulate processing time
        time.sleep(1)
        
        # Generate mock text based on file name or random content
        mock_texts = [
            "Sample document text extracted via OCR.\nThis is a mock result for development purposes.",
            "Mathematics Assignment\nProblem 1: Solve for x in the equation 2x + 5 = 15\nAnswer: x = 5",
            "English Essay\nThe importance of education in modern society cannot be overstated.\nEducation serves as the foundation for personal and professional development.",
            "Science Report\nExperiment Results:\n- Temperature: 25°C\n- Pressure: 1 atm\n- Observations: Clear solution formed"
        ]
        
        import random
        selected_text = random.choice(mock_texts)
        
        return {
            'text': selected_text,
            'confidence_scores': {
                'overall': random.uniform(0.8, 0.95)
            },
            'detected_languages': ['en']
        }
    
    @action(detail=True, methods=['post'])
    def reprocess(self, request, pk=None):
        """Reprocess an OCR request"""
        ocr_request = self.get_object()
        self._process_ocr_async(ocr_request)
        return Response({
            'message': 'OCR reprocessing started',
            'status': 'processing'
        })

class OCRView(APIView):
    """Simple OCR endpoint for quick text extraction"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({
                'error': 'No image provided.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Persist input as OCRRequest first
            ocr_request = OCRRequest.objects.create(
                user=request.user,
                input_file=image_file,
                file_name=getattr(image_file, 'name', 'upload')
            )

            if VISION_AVAILABLE and os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
                # Use actual Google Cloud Vision
                client = vision.ImageAnnotatorClient()
                content = image_file.read()
                image = vision.Image(content=content)
                response = client.text_detection(image=image)
                texts = response.text_annotations
                
                if response.error.message:
                    raise Exception(f"Google Vision API error: {response.error.message}")
                
                detected_text = texts[0].description if texts else ''
                confidence = texts[0].confidence if texts else 0
                ocr_request.result_text = detected_text
                ocr_request.confidence_scores = { 'overall': confidence }
                ocr_request.detected_languages = []
                ocr_request.status = 'completed'
                ocr_request.processed_at = timezone.now()
                ocr_request.save()
            else:
                # Use mock OCR
                detected_text = "Mock OCR result: This is sample extracted text from the uploaded image."
                confidence = 0.85
                ocr_request.result_text = detected_text
                ocr_request.confidence_scores = { 'overall': confidence }
                ocr_request.status = 'completed'
                ocr_request.processed_at = timezone.now()
                ocr_request.save()
            
            return Response({
                'text': detected_text,
                'confidence': confidence,
                'ocr_request_id': ocr_request.id,
                'message': 'OCR processing completed'
            })
            
        except Exception as e:
            return Response({
                'error': f'OCR processing failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def evaluate_student(request):
    """Create a new evaluation for a student"""
    serializer = EvaluationCreateSerializer(data=request.data)
    if serializer.is_valid():
        evaluation = serializer.save(evaluator=request.user)
        return Response(
            EvaluationSerializer(evaluation).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def student_progress(request, student_id):
    """Get progress report for a specific student"""
    from classes.models import Student
    
    try:
        student = Student.objects.get(
            id=student_id,
            class_group__created_by=request.user
        )
    except Student.DoesNotExist:
        return Response({
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    evaluations = Evaluation.objects.filter(student=student).order_by('-evaluation_date')
    
    # Calculate progress statistics
    stats = {
        'student_name': student.name,
        'class_name': student.class_group.name,
        'total_evaluations': evaluations.count(),
        'average_score': evaluations.aggregate(avg=Avg('score'))['avg'] or 0,
        'average_percentage': evaluations.aggregate(
            avg=Avg('score') * 100 / Avg('max_score')
        )['avg'] or 0,
        'latest_grade': evaluations.first().grade if evaluations.exists() else None,
        'evaluations': EvaluationSerializer(evaluations[:10], many=True).data,
        'grade_trend': [
            {
                'date': eval.evaluation_date.strftime('%Y-%m-%d'),
                'grade': eval.grade,
                'percentage': eval.percentage_score
            }
            for eval in evaluations[:10]
        ]
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def class_evaluation_summary(request, class_id):
    """Get evaluation summary for a specific class"""
    from classes.models import ClassGroup
    
    try:
        class_group = ClassGroup.objects.get(
            id=class_id,
            created_by=request.user
        )
    except ClassGroup.DoesNotExist:
        return Response({
            'error': 'Class not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    evaluations = Evaluation.objects.filter(class_group=class_group)
    
    summary = {
        'class_name': class_group.name,
        'total_evaluations': evaluations.count(),
        'total_students_evaluated': evaluations.values('student').distinct().count(),
        'average_class_score': evaluations.aggregate(avg=Avg('score'))['avg'] or 0,
        'recent_evaluations': EvaluationSerializer(
            evaluations.order_by('-created_at')[:10], many=True
        ).data,
        'grade_distribution': {},
        'evaluation_type_summary': {}
    }
    
    # Grade distribution
    for grade_choice in Evaluation.GRADE_CHOICES:
        grade = grade_choice[0]
        summary['grade_distribution'][grade] = evaluations.filter(grade=grade).count()
    
    # Evaluation type summary
    for eval_type in Evaluation.EVALUATION_TYPE_CHOICES:
        eval_type_key = eval_type[0]
        type_evaluations = evaluations.filter(evaluation_type=eval_type_key)
        summary['evaluation_type_summary'][eval_type_key] = {
            'count': type_evaluations.count(),
            'average_score': type_evaluations.aggregate(avg=Avg('score'))['avg'] or 0
        }
    
    return Response(summary)
