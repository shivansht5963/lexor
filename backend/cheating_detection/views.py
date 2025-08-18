from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Count, Q
from datetime import datetime, timedelta
import json
import random
from .models import CheatingDetection
from .serializers import (
    CheatingDetectionSerializer, CheatingDetectionCreateSerializer,
    CheatingDetectionUpdateSerializer, CheatingDetectionListSerializer
)

class CheatingDetectionViewSet(ModelViewSet):
    """ViewSet for managing cheating detection"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only return detections for the current user
        return CheatingDetection.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CheatingDetectionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CheatingDetectionUpdateSerializer
        elif self.action == 'list':
            return CheatingDetectionListSerializer
        return CheatingDetectionSerializer
    
    def perform_create(self, serializer):
        detection = serializer.save(user=self.request.user)
        # Trigger async processing (in a real app, this would be a Celery task)
        self._process_detection_async(detection)
    
    def _process_detection_async(self, detection):
        """
        Mock cheating detection processing.
        In production, this would be replaced with actual ML/AI processing.
        """
        try:
            # Simulate processing time
            import time
            time.sleep(1)  # Remove in production
            
            # Mock detection results
            mock_results = self._generate_mock_detection_results(detection)
            
            # Update the detection with results
            detection.result = mock_results['result']
            detection.cheating_level = mock_results['cheating_level']
            detection.confidence_score = mock_results['confidence_score']
            detection.status = 'completed'
            detection.processed_at = timezone.now()
            detection.save()
            
        except Exception as e:
            detection.status = 'failed'
            detection.result = {'error': str(e)}
            detection.processed_at = timezone.now()
            detection.save()
    
    def _generate_mock_detection_results(self, detection):
        """Generate mock detection results for demonstration"""
        # Simulate different detection scenarios
        scenarios = [
            {
                'cheating_level': 'none',
                'confidence_score': 0.95,
                'result': {
                    'detected_behaviors': [],
                    'analysis': 'No suspicious behavior detected',
                    'recommendations': 'Continue normal monitoring'
                }
            },
            {
                'cheating_level': 'low',
                'confidence_score': 0.65,
                'result': {
                    'detected_behaviors': ['looking_away'],
                    'analysis': 'Student occasionally looked away from screen',
                    'recommendations': 'Minor attention reminder may be helpful'
                }
            },
            {
                'cheating_level': 'medium',
                'confidence_score': 0.78,
                'result': {
                    'detected_behaviors': ['multiple_faces', 'looking_away'],
                    'analysis': 'Multiple faces detected and frequent looking away',
                    'recommendations': 'Consider reviewing this session'
                }
            },
            {
                'cheating_level': 'high',
                'confidence_score': 0.89,
                'result': {
                    'detected_behaviors': ['multiple_faces', 'suspicious_objects', 'audio_anomalies'],
                    'analysis': 'Multiple concerning behaviors detected',
                    'recommendations': 'Immediate review recommended'
                }
            }
        ]
        
        return random.choice(scenarios)
    
    @action(detail=True, methods=['post'])
    def reprocess(self, request, pk=None):
        """Reprocess a detection"""
        detection = self.get_object()
        detection.status = 'processing'
        detection.save()
        
        self._process_detection_async(detection)
        
        return Response({
            'message': 'Detection reprocessing started',
            'status': 'processing'
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get cheating detection statistics"""
        user_detections = self.get_queryset()
        
        stats = {
            'total_detections': user_detections.count(),
            'completed_detections': user_detections.filter(status='completed').count(),
            'pending_detections': user_detections.filter(status='processing').count(),
            'failed_detections': user_detections.filter(status='failed').count(),
            'cheating_level_distribution': {
                level[0]: user_detections.filter(cheating_level=level[0]).count()
                for level in CheatingDetection.CHEATING_LEVEL_CHOICES
            },
            'recent_detections': CheatingDetectionListSerializer(
                user_detections.order_by('-created_at')[:5], many=True
            ).data
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get detection history with filtering options"""
        queryset = self.get_queryset()
        
        # Filter by date range
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        # Filter by cheating level
        cheating_level = request.query_params.get('cheating_level')
        if cheating_level:
            queryset = queryset.filter(cheating_level=cheating_level)
        
        # Filter by class group
        class_group = request.query_params.get('class_group')
        if class_group:
            queryset = queryset.filter(class_group=class_group)
        
        # Filter by student
        student = request.query_params.get('student')
        if student:
            queryset = queryset.filter(student=student)
        
        serializer = CheatingDetectionListSerializer(
            queryset.order_by('-created_at'), many=True
        )
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def detect_cheating(request):
    """Submit data for cheating detection"""
    serializer = CheatingDetectionCreateSerializer(data=request.data)
    if serializer.is_valid():
        detection = serializer.save(user=request.user)
        
        # Start processing (would be async in production)
        detection.status = 'processing'
        detection.save()
        
        return Response({
            'message': 'Cheating detection started',
            'detection_id': detection.id,
            'status': 'processing'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def detection_result(request, detection_id):
    """Get detection result by ID"""
    try:
        detection = CheatingDetection.objects.get(
            id=detection_id, 
            user=request.user
        )
        serializer = CheatingDetectionSerializer(detection)
        return Response(serializer.data)
    except CheatingDetection.DoesNotExist:
        return Response({
            'error': 'Detection not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def class_cheating_summary(request, class_id):
    """Get cheating detection summary for a specific class"""
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
    
    detections = CheatingDetection.objects.filter(class_group=class_group)
    
    summary = {
        'class_name': class_group.name,
        'total_detections': detections.count(),
        'high_risk_detections': detections.filter(
            cheating_level__in=['high', 'critical']
        ).count(),
        'students_flagged': detections.filter(
            cheating_level__in=['medium', 'high', 'critical']
        ).values('student').distinct().count(),
        'recent_incidents': CheatingDetectionListSerializer(
            detections.filter(
                cheating_level__in=['medium', 'high', 'critical']
            ).order_by('-created_at')[:10], many=True
        ).data,
        'level_distribution': {
            level[0]: detections.filter(cheating_level=level[0]).count()
            for level in CheatingDetection.CHEATING_LEVEL_CHOICES
        }
    }
    
    return Response(summary)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_detection(request):
    """Submit multiple items for cheating detection"""
    items = request.data.get('items', [])
    if not items:
        return Response({
            'error': 'Items list is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    created_detections = []
    errors = []
    
    for i, item_data in enumerate(items):
        serializer = CheatingDetectionCreateSerializer(data=item_data)
        if serializer.is_valid():
            detection = serializer.save(user=request.user)
            detection.status = 'processing'
            detection.save()
            created_detections.append(detection.id)
        else:
            errors.append({
                'index': i,
                'errors': serializer.errors
            })
    
    return Response({
        'message': f'{len(created_detections)} detections started',
        'detection_ids': created_detections,
        'errors': errors
    }, status=status.HTTP_201_CREATED if created_detections else status.HTTP_400_BAD_REQUEST)
