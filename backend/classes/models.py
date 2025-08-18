from django.db import models
from custom_auth.models import User

class ClassGroup(models.Model):
    """Model representing a class group created by a teacher"""
    name = models.CharField(max_length=100, help_text="Name of the class group")
    description = models.TextField(blank=True, help_text="Description of the class")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_classes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, help_text="Whether the class is currently active")
    subject = models.CharField(max_length=100, blank=True, help_text="Subject of the class")
    
    class Meta:
        db_table = 'classes_classgroup'
        verbose_name = 'Class Group'
        verbose_name_plural = 'Class Groups'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.created_by.username}"

    @property
    def student_count(self):
        return self.students.count()

class Student(models.Model):
    """Model representing a student in a class group"""
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='students')
    name = models.CharField(max_length=100, help_text="Full name of the student")
    email = models.EmailField(help_text="Student's email address")
    student_id = models.CharField(max_length=50, blank=True, help_text="Student ID or roll number")
    added_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, help_text="Whether the student is active in the class")
    
    class Meta:
        db_table = 'classes_student'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        unique_together = ['class_group', 'email']  # Prevent duplicate students in same class
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.class_group.name})"
