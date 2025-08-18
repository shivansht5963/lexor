from django.db import models
from custom_auth.models import User

class CheatingDetection(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	input_data = models.TextField()  # or FileField/ImageField if needed
	result = models.JSONField()
	created_at = models.DateTimeField(auto_now_add=True)
from django.db import models

# Create your models here.
