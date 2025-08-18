from rest_framework import serializers
from .models import ClassGroup, Student
from custom_auth.serializers import UserSerializer

class ClassGroupSerializer(serializers.ModelSerializer):
    """Serializer for ClassGroup model"""
    created_by = UserSerializer(read_only=True)
    student_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ClassGroup
        fields = ['id', 'name', 'description', 'subject', 'is_active', 
                  'created_by', 'created_at', 'updated_at', 'student_count']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ClassGroupCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating ClassGroup"""
    
    class Meta:
        model = ClassGroup
        fields = ['name', 'description', 'subject', 'is_active']

class StudentSerializer(serializers.ModelSerializer):
    """Serializer for Student model"""
    class_group_name = serializers.CharField(source='class_group.name', read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'student_id', 'class_group', 
                  'class_group_name', 'is_active', 'added_at']
        read_only_fields = ['id', 'added_at']

class StudentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Student"""
    
    class Meta:
        model = Student
        fields = ['name', 'email', 'student_id', 'class_group']
    
    def validate_email(self, value):
        """Validate that email is not already used in the same class"""
        class_group = self.initial_data.get('class_group')
        if class_group and Student.objects.filter(
            class_group=class_group, email=value
        ).exists():
            raise serializers.ValidationError(
                "A student with this email already exists in this class."
            )
        return value

class StudentBulkCreateSerializer(serializers.Serializer):
    """Serializer for bulk creating students"""
    students = StudentCreateSerializer(many=True)
    class_group = serializers.IntegerField()
    
    def validate(self, attrs):
        class_group_id = attrs.get('class_group')
        try:
            class_group = ClassGroup.objects.get(id=class_group_id)
            attrs['class_group_obj'] = class_group
        except ClassGroup.DoesNotExist:
            raise serializers.ValidationError("Class group does not exist")
        return attrs
    
    def create(self, validated_data):
        students_data = validated_data['students']
        class_group = validated_data['class_group_obj']
        
        students = []
        for student_data in students_data:
            student_data['class_group'] = class_group
            students.append(Student(**student_data))
        
        return Student.objects.bulk_create(students, ignore_conflicts=True)