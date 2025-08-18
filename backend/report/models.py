from django.db import models
from custom_auth.models import User
from evaluation.models import Evaluation
from classes.models import ClassGroup, Student
from cheating_detection.models import CheatingDetection

class Report(models.Model):
    """Model for generating and storing various types of reports"""
    
    REPORT_TYPE_CHOICES = [
        ('student_progress', 'Student Progress Report'),
        ('class_summary', 'Class Summary Report'),
        ('evaluation_analysis', 'Evaluation Analysis Report'),
        ('cheating_report', 'Cheating Detection Report'),
        ('comprehensive', 'Comprehensive Report'),
    ]
    
    REPORT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('generating', 'Generating'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    # Basic info
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='generated_reports')
    title = models.CharField(max_length=200, help_text="Title of the report")
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES, default='student_progress')
    
    # Related objects
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    evaluations = models.ManyToManyField(Evaluation, blank=True, help_text="Evaluations included in this report")
    cheating_detections = models.ManyToManyField(CheatingDetection, blank=True, help_text="Cheating detections included in this report")
    
    # Report content and files
    report_data = models.JSONField(default=dict, help_text="Structured report data")
    pdf_file = models.FileField(upload_to='reports/pdf/', null=True, blank=True)
    excel_file = models.FileField(upload_to='reports/excel/', null=True, blank=True)
    
    # Report parameters
    date_from = models.DateTimeField(null=True, blank=True, help_text="Start date for report data")
    date_to = models.DateTimeField(null=True, blank=True, help_text="End date for report data")
    include_charts = models.BooleanField(default=True, help_text="Include charts and graphs")
    include_detailed_feedback = models.BooleanField(default=True, help_text="Include detailed feedback")
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=REPORT_STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'report_report'
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
        ordering = ['-generated_at']

    def __str__(self):
        return f"{self.title} ({self.report_type}) - {self.user.username}"

    @property
    def is_completed(self):
        return self.status == 'completed'

    @property
    def file_size_mb(self):
        if self.pdf_file:
            return round(self.pdf_file.size / (1024 * 1024), 2)
        return 0

class ReportTemplate(models.Model):
    """Model for storing reusable report templates"""
    
    name = models.CharField(max_length=100, help_text="Template name")
    description = models.TextField(blank=True, help_text="Template description")
    report_type = models.CharField(max_length=20, choices=Report.REPORT_TYPE_CHOICES)
    template_data = models.JSONField(help_text="Template configuration and structure")
    
    # Template settings
    is_default = models.BooleanField(default=False, help_text="Is this a default template")
    is_active = models.BooleanField(default=True, help_text="Is this template active")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_templates')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_reporttemplate'
        verbose_name = 'Report Template'
        verbose_name_plural = 'Report Templates'
        unique_together = ['report_type', 'is_default']  # Only one default template per type

    def __str__(self):
        return f"{self.name} ({self.report_type})"
