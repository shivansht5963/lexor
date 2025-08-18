from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'report'

# Create a router for ViewSets (when implemented)
router = DefaultRouter()

urlpatterns = [
    # Include ViewSet URLs
    path('', include(router.urls)),
    
    # Report endpoints
    path('export/', views.export_report, name='export_report'),
    path('history/', views.report_history, name='report_history'),
]