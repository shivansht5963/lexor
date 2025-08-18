from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_report(request):
    return Response({'message': 'Report export functionality coming soon'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def report_history(request):
    return Response({'reports': []})
