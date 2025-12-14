from django.db import models
from projects.models import Project
from people.models import Person


class Event(models.Model):
    class EventType(models.TextChoices):
        MEETING = "MEETING", "Meeting"
        DEADLINE = "DEADLINE", "Deadline"
        SITE_VISIT = "SITE_VISIT", "Site visit"
        TASK = "TASK", "Task"
        OTHER = "OTHER", "Other"

    title = models.CharField(max_length=255)
    event_type = models.CharField(max_length=20, choices=EventType.choices, default=EventType.MEETING)

    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, related_name="events")
    attendees = models.ManyToManyField(Person, blank=True, related_name="events")

    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(null=True, blank=True)

    location = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
