from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'classes'

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'groups', views.ClassGroupViewSet, basename='classgroup')
router.register(r'students', views.StudentViewSet, basename='student')

urlpatterns = [
    # Include ViewSet URLs
    path('', include(router.urls)),
    
    # Additional utility endpoints
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('search-students/', views.search_students, name='search_students'),
    path('transfer-student/', views.transfer_student, name='transfer_student'),
]