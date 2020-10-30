from django.contrib.auth.models import AbstractUser
from django.db import models
from .helpers import find_first, order
# Create your models here.
class User(AbstractUser):
    pass

class Note(models.Model):
    title = models.CharField(max_length=300)
    description = models.CharField(max_length=1200, blank=True, null=True)
    public = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    content = models.CharField(max_length=10000, default="", blank=True, null=True)

    def __str__(self):
        return self.title

    def serialize(self):
        return {
            "id": self.pk,
            "title":self.title,
            "description":self.description,
            "user_id": self.user.id,
            "content": self.content
        }