from django.db import models
from custom_auth.models import User
from evaluation.models import Evaluation

class Report(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	evaluations = models.ManyToManyField(Evaluation)
	generated_at = models.DateTimeField(auto_now_add=True)
	pdf_file = models.FileField(upload_to='pdf_exports/')
from django.db import models

# Create your models here.
