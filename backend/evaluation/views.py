from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.cloud import vision

class OCRView(APIView):
	def post(self, request):
		image_file = request.FILES.get('image')
		if not image_file:
			return Response({'error': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)

		client = vision.ImageAnnotatorClient()
		content = image_file.read()
		image = vision.Image(content=content)
		response = client.text_detection(image=image)
		texts = response.text_annotations

		detected_text = texts[0].description if texts else ''
		return Response({'text': detected_text})
