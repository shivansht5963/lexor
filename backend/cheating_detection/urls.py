from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'cheating_detection'

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'detections', views.CheatingDetectionViewSet, basename='cheatingdetection')

urlpatterns = [
    # Include ViewSet URLs
    path('', include(router.urls)),
    
    # Additional endpoints
    path('detect/', views.detect_cheating, name='detect_cheating'),
    path('result/<int:detection_id>/', views.detection_result, name='detection_result'),
    path('class-summary/<int:class_id>/', views.class_cheating_summary, name='class_cheating_summary'),
    path('bulk-detect/', views.bulk_detection, name='bulk_detection'),
]