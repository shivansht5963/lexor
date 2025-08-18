from django.db import models
from custom_auth.models import User
from classes.models import Student

class Evaluation(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	evaluator = models.ForeignKey(User, on_delete=models.CASCADE)
	score = models.FloatField()
	feedback = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

class OCRRequest(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	input_file = models.FileField(upload_to='ocr/')
	result_text = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
from django.db import models

# Create your models here.
