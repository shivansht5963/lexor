from rest_framework import serializers
from .models import CheatingDetection
from custom_auth.serializers import UserSerializer
from classes.serializers import ClassGroupSerializer, StudentSerializer

class CheatingDetectionSerializer(serializers.ModelSerializer):
    """Serializer for CheatingDetection model"""
    user = UserSerializer(read_only=True)
    class_group = ClassGroupSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    is_cheating_detected = serializers.ReadOnlyField()
    
    class Meta:
        model = CheatingDetection
        fields = ['id', 'user', 'class_group', 'student', 'input_data', 
                  'input_image', 'input_video', 'result', 'cheating_level', 
                  'confidence_score', 'status', 'is_cheating_detected',
                  'created_at', 'updated_at', 'processed_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'processed_at']

class CheatingDetectionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating CheatingDetection"""
    
    class Meta:
        model = CheatingDetection
        fields = ['class_group', 'student', 'input_data', 'input_image', 'input_video']
    
    def validate(self, attrs):
        # Ensure at least one input method is provided
        if not any([attrs.get('input_data'), attrs.get('input_image'), attrs.get('input_video')]):
            raise serializers.ValidationError(
                "At least one input method (data, image, or video) must be provided."
            )
        return attrs

class CheatingDetectionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating CheatingDetection results"""
    
    class Meta:
        model = CheatingDetection
        fields = ['result', 'cheating_level', 'confidence_score', 'status', 'processed_at']

class CheatingDetectionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing cheating detections"""
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    class_name = serializers.CharField(source='class_group.name', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)
    
    class Meta:
        model = CheatingDetection
        fields = ['id', 'user_name', 'class_name', 'student_name', 
                  'cheating_level', 'confidence_score', 'status', 'created_at']