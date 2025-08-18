from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from .models import ClassGroup, Student
from .serializers import (
    ClassGroupSerializer, ClassGroupCreateSerializer,
    StudentSerializer, StudentCreateSerializer, StudentBulkCreateSerializer
)

class ClassGroupViewSet(ModelViewSet):
    """ViewSet for managing class groups"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only return classes created by the current user
        return ClassGroup.objects.filter(created_by=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClassGroupCreateSerializer
        return ClassGroupSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """Get all students in a class group"""
        class_group = self.get_object()
        students = Student.objects.filter(class_group=class_group, is_active=True)
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_student(self, request, pk=None):
        """Add a single student to a class group"""
        class_group = self.get_object()
        data = request.data.copy()
        data['class_group'] = class_group.id
        
        serializer = StudentCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_students_bulk(self, request, pk=None):
        """Add multiple students to a class group"""
        class_group = self.get_object()
        data = request.data.copy()
        data['class_group'] = class_group.id
        
        serializer = StudentBulkCreateSerializer(data=data)
        if serializer.is_valid():
            students = serializer.save()
            return Response({
                'message': f'{len(students)} students added successfully',
                'students': StudentSerializer(students, many=True).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get statistics for a class group"""
        class_group = self.get_object()
        stats = {
            'total_students': class_group.students.count(),
            'active_students': class_group.students.filter(is_active=True).count(),
            'total_evaluations': class_group.evaluations.count(),
            'total_cheating_detections': class_group.cheating_detections.count(),
            'recent_evaluations': class_group.evaluations.order_by('-created_at')[:5].count()
        }
        return Response(stats)

class StudentViewSet(ModelViewSet):
    """ViewSet for managing students"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only return students from classes created by the current user
        return Student.objects.filter(class_group__created_by=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StudentCreateSerializer
        return StudentSerializer
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a student"""
        student = self.get_object()
        student.is_active = False
        student.save()
        return Response({
            'message': 'Student deactivated successfully'
        })
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a student"""
        student = self.get_object()
        student.is_active = True
        student.save()
        return Response({
            'message': 'Student activated successfully'
        })
    
    @action(detail=True, methods=['get'])
    def evaluations(self, request, pk=None):
        """Get all evaluations for a student"""
        student = self.get_object()
        evaluations = student.evaluations.all()
        # Import here to avoid circular imports
        from evaluation.serializers import EvaluationSerializer
        serializer = EvaluationSerializer(evaluations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def cheating_history(self, request, pk=None):
        """Get cheating detection history for a student"""
        student = self.get_object()
        detections = student.cheating_detections.all()
        # Import here to avoid circular imports
        from cheating_detection.serializers import CheatingDetectionListSerializer
        serializer = CheatingDetectionListSerializer(detections, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for the current user"""
    user = request.user
    
    # Get user's classes
    user_classes = ClassGroup.objects.filter(created_by=user)
    
    stats = {
        'total_classes': user_classes.count(),
        'active_classes': user_classes.filter(is_active=True).count(),
        'total_students': Student.objects.filter(class_group__created_by=user).count(),
        'active_students': Student.objects.filter(
            class_group__created_by=user, is_active=True
        ).count(),
        'recent_classes': ClassGroupSerializer(
            user_classes.order_by('-created_at')[:3], many=True
        ).data,
        'classes_with_most_students': ClassGroupSerializer(
            user_classes.annotate(
                student_count=Count('students')
            ).order_by('-student_count')[:3], many=True
        ).data
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_students(request):
    """Search for students across all user's classes"""
    query = request.GET.get('q', '')
    if not query:
        return Response({'error': 'Query parameter q is required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    students = Student.objects.filter(
        class_group__created_by=request.user,
        name__icontains=query
    )
    
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def transfer_student(request):
    """Transfer a student from one class to another"""
    student_id = request.data.get('student_id')
    new_class_id = request.data.get('new_class_id')
    
    if not student_id or not new_class_id:
        return Response({
            'error': 'student_id and new_class_id are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        student = Student.objects.get(
            id=student_id, 
            class_group__created_by=request.user
        )
        new_class = ClassGroup.objects.get(
            id=new_class_id,
            created_by=request.user
        )
        
        # Check if student already exists in the new class
        if Student.objects.filter(
            class_group=new_class, 
            email=student.email
        ).exists():
            return Response({
                'error': 'Student with this email already exists in the target class'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        old_class_name = student.class_group.name
        student.class_group = new_class
        student.save()
        
        return Response({
            'message': f'Student transferred from {old_class_name} to {new_class.name}',
            'student': StudentSerializer(student).data
        })
        
    except Student.DoesNotExist:
        return Response({
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except ClassGroup.DoesNotExist:
        return Response({
            'error': 'Target class not found'
        }, status=status.HTTP_404_NOT_FOUND)
