from rest_framework import serializers
from .models import Report, ReportTemplate
from custom_auth.serializers import UserSerializer
from classes.serializers import ClassGroupSerializer, StudentSerializer
from evaluation.serializers import EvaluationSerializer
from cheating_detection.serializers import CheatingDetectionSerializer

class ReportSerializer(serializers.ModelSerializer):
    """Serializer for Report model"""
    user = UserSerializer(read_only=True)
    class_group = ClassGroupSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    evaluations = EvaluationSerializer(many=True, read_only=True)
    cheating_detections = CheatingDetectionSerializer(many=True, read_only=True)
    is_completed = serializers.ReadOnlyField()
    file_size_mb = serializers.ReadOnlyField()
    
    class Meta:
        model = Report
        fields = ['id', 'user', 'title', 'report_type', 'class_group', 'student',
                  'evaluations', 'cheating_detections', 'report_data', 
                  'pdf_file', 'excel_file', 'date_from', 'date_to',
                  'include_charts', 'include_detailed_feedback', 'status',
                  'error_message', 'is_completed', 'file_size_mb',
                  'generated_at', 'updated_at', 'completed_at']
        read_only_fields = ['id', 'generated_at', 'updated_at', 'completed_at']

class ReportCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Report"""
    evaluation_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        required=False,
        help_text="List of evaluation IDs to include in the report"
    )
    cheating_detection_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="List of cheating detection IDs to include in the report"
    )
    
    class Meta:
        model = Report
        fields = ['title', 'report_type', 'class_group', 'student',
                  'evaluation_ids', 'cheating_detection_ids',
                  'date_from', 'date_to', 'include_charts', 
                  'include_detailed_feedback']
    
    def create(self, validated_data):
        evaluation_ids = validated_data.pop('evaluation_ids', [])
        cheating_detection_ids = validated_data.pop('cheating_detection_ids', [])
        
        report = Report.objects.create(**validated_data)
        
        if evaluation_ids:
            report.evaluations.set(evaluation_ids)
        if cheating_detection_ids:
            report.cheating_detections.set(cheating_detection_ids)
        
        return report

class ReportUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating Report status and files"""
    
    class Meta:
        model = Report
        fields = ['report_data', 'pdf_file', 'excel_file', 'status',
                  'error_message', 'completed_at']

class ReportListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing reports"""
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    class_name = serializers.CharField(source='class_group.name', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)
    
    class Meta:
        model = Report
        fields = ['id', 'title', 'report_type', 'user_name', 'class_name',
                  'student_name', 'status', 'file_size_mb', 'generated_at']

class ReportTemplateSerializer(serializers.ModelSerializer):
    """Serializer for ReportTemplate model"""
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ReportTemplate
        fields = ['id', 'name', 'description', 'report_type', 'template_data',
                  'is_default', 'is_active', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ReportTemplateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating ReportTemplate"""
    
    class Meta:
        model = ReportTemplate
        fields = ['name', 'description', 'report_type', 'template_data',
                  'is_default', 'is_active']

class ReportGenerationRequestSerializer(serializers.Serializer):
    """Serializer for report generation requests"""
    report_id = serializers.IntegerField()
    format = serializers.ChoiceField(choices=['pdf', 'excel', 'both'], default='pdf')
    template_id = serializers.IntegerField(required=False)
    
    def validate_report_id(self, value):
        try:
            report = Report.objects.get(id=value)
            return value
        except Report.DoesNotExist:
            raise serializers.ValidationError("Report does not exist")

class ReportStatsSerializer(serializers.Serializer):
    """Serializer for report statistics"""
    total_reports = serializers.IntegerField()
    completed_reports = serializers.IntegerField()
    pending_reports = serializers.IntegerField()
    failed_reports = serializers.IntegerField()
    reports_by_type = serializers.DictField()
    recent_reports = ReportListSerializer(many=True)