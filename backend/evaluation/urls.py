from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'evaluation'

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'evaluations', views.EvaluationViewSet, basename='evaluation')
router.register(r'ocr-requests', views.OCRRequestViewSet, basename='ocrrequest')

urlpatterns = [
    # Include ViewSet URLs
    path('', include(router.urls)),
    
    # OCR endpoints
    path('ocr/', views.OCRView.as_view(), name='ocr'),
    
    # Additional evaluation endpoints
    path('evaluate/', views.evaluate_student, name='evaluate_student'),
    path('student-progress/<int:student_id>/', views.student_progress, name='student_progress'),
    path('class-summary/<int:class_id>/', views.class_evaluation_summary, name='class_evaluation_summary'),
]