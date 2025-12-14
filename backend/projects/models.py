from django.db import models
from people.models import Person


class Project(models.Model):
    name = models.CharField(max_length=255)
    project_number = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    members = models.ManyToManyField(Person, blank=True, related_name="projects")

    def __str__(self):
        return self.name
