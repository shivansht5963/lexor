from django.db import models
from custom_auth.models import User

class ClassGroup(models.Model):
	name = models.CharField(max_length=100)
	description = models.TextField(blank=True)
	created_by = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)

class Student(models.Model):
	class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='students')
	name = models.CharField(max_length=100)
	email = models.EmailField()
	added_at = models.DateTimeField(auto_now_add=True)
from django.db import models

# Create your models here.
