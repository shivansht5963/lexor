from django.db import models
from custom_auth.models import User
from classes.models import Student, ClassGroup

class Evaluation(models.Model):
    """Model representing student evaluations and scoring"""
    
    EVALUATION_TYPE_CHOICES = [
        ('assignment', 'Assignment'),
        ('exam', 'Exam'),
        ('quiz', 'Quiz'),
        ('project', 'Project'),
        ('participation', 'Participation'),
    ]
    
    GRADE_CHOICES = [
        ('A+', 'A+'), ('A', 'A'), ('A-', 'A-'),
        ('B+', 'B+'), ('B', 'B'), ('B-', 'B-'),
        ('C+', 'C+'), ('C', 'C'), ('C-', 'C-'),
        ('D+', 'D+'), ('D', 'D'), ('F', 'F'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conducted_evaluations')
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='evaluations')
    
    # Evaluation details
    title = models.CharField(max_length=200, help_text="Title of the evaluation")
    evaluation_type = models.CharField(max_length=20, choices=EVALUATION_TYPE_CHOICES, default='assignment')
    score = models.FloatField(help_text="Numeric score")
    max_score = models.FloatField(default=100.0, help_text="Maximum possible score")
    grade = models.CharField(max_length=2, choices=GRADE_CHOICES, blank=True)
    feedback = models.TextField(blank=True, help_text="Detailed feedback for the student")
    
    # OCR related fields
    scanned_document = models.ImageField(upload_to='evaluations/documents/', null=True, blank=True)
    ocr_text = models.TextField(blank=True, help_text="Text extracted from scanned document")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    evaluation_date = models.DateTimeField(help_text="Date when the evaluation was conducted")
    
    class Meta:
        db_table = 'evaluation_evaluation'
        verbose_name = 'Evaluation'
        verbose_name_plural = 'Evaluations'
        ordering = ['-evaluation_date']

    def __str__(self):
        return f"{self.title} - {self.student.name} ({self.score}/{self.max_score})"

    @property
    def percentage_score(self):
        if self.max_score > 0:
            return (self.score / self.max_score) * 100
        return 0

    def calculate_grade(self):
        """Auto-calculate grade based on percentage"""
        percentage = self.percentage_score
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

class OCRRequest(models.Model):
    """Model to handle OCR requests and results using Google Cloud Vision"""
    
    OCR_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ocr_requests')
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='ocr_requests', null=True, blank=True)
    
    # Input
    input_file = models.ImageField(upload_to='ocr/input/')
    file_name = models.CharField(max_length=255, help_text="Original file name")
    
    # OCR Results
    result_text = models.TextField(blank=True, help_text="Extracted text from OCR")
    confidence_scores = models.JSONField(default=dict, help_text="Confidence scores for detected text")
    detected_languages = models.JSONField(default=list, help_text="Languages detected in the document")
    
    # Processing details
    status = models.CharField(max_length=20, choices=OCR_STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    processing_time = models.FloatField(null=True, blank=True, help_text="Processing time in seconds")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'evaluation_ocrrequest'
        verbose_name = 'OCR Request'
        verbose_name_plural = 'OCR Requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"OCR Request {self.id} - {self.file_name} ({self.status})"

    @property
    def is_processed(self):
        return self.status in ['completed', 'failed']
