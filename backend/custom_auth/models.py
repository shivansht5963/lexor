from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
	username = models.CharField(max_length=150, unique=True)
	gmail = models.EmailField(unique=True)
	password = models.CharField(max_length=128)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['gmail', 'password']
from django.db import models

# Create your models here.
