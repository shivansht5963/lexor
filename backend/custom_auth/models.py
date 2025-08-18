from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom User model with username, gmail, and additional profile fields"""
    username = models.CharField(max_length=150, unique=True)
    gmail = models.EmailField(unique=True, verbose_name="Gmail Address")
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_teacher = models.BooleanField(default=False, help_text="Designates whether the user is a teacher")
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['gmail']

    class Meta:
        db_table = 'custom_auth_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.gmail})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
