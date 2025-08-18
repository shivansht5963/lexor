from django.db import models
from custom_auth.models import User
from classes.models import ClassGroup, Student

class CheatingDetection(models.Model):
    """Model to store cheating detection results and analysis"""
    
    DETECTION_STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    CHEATING_LEVEL_CHOICES = [
        ('none', 'No Cheating Detected'),
        ('low', 'Low Risk'),
        ('medium', 'Medium Risk'),
        ('high', 'High Risk'),
        ('critical', 'Critical Risk'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cheating_detections')
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='cheating_detections', null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='cheating_detections', null=True, blank=True)
    
    # Input data
    input_data = models.TextField(help_text="Input data for cheating detection")
    input_image = models.ImageField(upload_to='cheating_detection/', null=True, blank=True)
    input_video = models.FileField(upload_to='cheating_detection/videos/', null=True, blank=True)
    
    # Detection results
    result = models.JSONField(help_text="Detailed detection results")
    cheating_level = models.CharField(max_length=20, choices=CHEATING_LEVEL_CHOICES, default='none')
    confidence_score = models.FloatField(default=0.0, help_text="Confidence score (0-1)")
    status = models.CharField(max_length=20, choices=DETECTION_STATUS_CHOICES, default='processing')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'cheating_detection_cheatingdetection'
        verbose_name = 'Cheating Detection'
        verbose_name_plural = 'Cheating Detections'
        ordering = ['-created_at']

    def __str__(self):
        return f"Detection {self.id} - {self.cheating_level} ({self.user.username})"

    @property
    def is_cheating_detected(self):
        return self.cheating_level in ['medium', 'high', 'critical']
