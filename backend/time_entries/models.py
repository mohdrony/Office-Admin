from django.db import models
from projects.models import Project
from people.models import Person
from events.models import Event


class TimeEntry(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="time_entries")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="time_entries")
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True)

    date = models.DateField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.person} – {self.project} – {self.hours}h"
