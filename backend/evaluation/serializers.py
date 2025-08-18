from rest_framework import serializers
from .models import Evaluation, OCRRequest
from custom_auth.serializers import UserSerializer
from classes.serializers import ClassGroupSerializer, StudentSerializer

class EvaluationSerializer(serializers.ModelSerializer):
    """Serializer for Evaluation model"""
    evaluator = UserSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    class_group = ClassGroupSerializer(read_only=True)
    percentage_score = serializers.ReadOnlyField()
    
    class Meta:
        model = Evaluation
        fields = ['id', 'student', 'evaluator', 'class_group', 'title', 
                  'evaluation_type', 'score', 'max_score', 'grade', 'feedback',
                  'scanned_document', 'ocr_text', 'percentage_score',
                  'created_at', 'updated_at', 'evaluation_date']
        read_only_fields = ['id', 'created_at', 'updated_at']

class EvaluationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Evaluation"""
    
    class Meta:
        model = Evaluation
        fields = ['student', 'class_group', 'title', 'evaluation_type', 
                  'score', 'max_score', 'grade', 'feedback', 'scanned_document',
                  'evaluation_date']
    
    def validate(self, attrs):
        # Auto-calculate grade if not provided
        if not attrs.get('grade') and attrs.get('score') and attrs.get('max_score'):
            percentage = (attrs['score'] / attrs['max_score']) * 100
            attrs['grade'] = self._calculate_grade(percentage)
        return attrs
    
    def _calculate_grade(self, percentage):
        """Calculate grade based on percentage"""
        if percentage >= 97: return 'A+'
        elif percentage >= 93: return 'A'
        elif percentage >= 90: return 'A-'
        elif percentage >= 87: return 'B+'
        elif percentage >= 83: return 'B'
        elif percentage >= 80: return 'B-'
        elif percentage >= 77: return 'C+'
        elif percentage >= 73: return 'C'
        elif percentage >= 70: return 'C-'
        elif percentage >= 67: return 'D+'
        elif percentage >= 60: return 'D'
        else: return 'F'

class EvaluationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating Evaluation"""
    
    class Meta:
        model = Evaluation
        fields = ['title', 'evaluation_type', 'score', 'max_score', 
                  'grade', 'feedback', 'scanned_document', 'evaluation_date']

class OCRRequestSerializer(serializers.ModelSerializer):
    """Serializer for OCRRequest model"""
    user = UserSerializer(read_only=True)
    class_group = ClassGroupSerializer(read_only=True)
    is_processed = serializers.ReadOnlyField()
    
    class Meta:
        model = OCRRequest
        fields = ['id', 'user', 'class_group', 'input_file', 'file_name',
                  'result_text', 'confidence_scores', 'detected_languages',
                  'status', 'error_message', 'processing_time', 'is_processed',
                  'created_at', 'updated_at', 'processed_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'processed_at']

class OCRRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating OCR requests"""
    
    class Meta:
        model = OCRRequest
        fields = ['input_file', 'class_group']
    
    def validate_input_file(self, value):
        """Validate file type and size"""
        # Check file extension
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.pdf', '.tiff', '.bmp']
        if not any(value.name.lower().endswith(ext) for ext in allowed_extensions):
            raise serializers.ValidationError(
                f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Check file size (max 10MB)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB")
        
        return value

class OCRRequestUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating OCR request results"""
    
    class Meta:
        model = OCRRequest
        fields = ['result_text', 'confidence_scores', 'detected_languages',
                  'status', 'error_message', 'processing_time', 'processed_at']

class EvaluationStatsSerializer(serializers.Serializer):
    """Serializer for evaluation statistics"""
    total_evaluations = serializers.IntegerField()
    average_score = serializers.FloatField()
    grade_distribution = serializers.DictField()
    evaluation_type_distribution = serializers.DictField()
    recent_evaluations = EvaluationSerializer(many=True)