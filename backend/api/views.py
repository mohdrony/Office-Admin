from rest_framework import viewsets
from projects.models import Project
from people.models import Person
from events.models import Event
from time_entries.models import TimeEntry
from .serializers import (
    ProjectSerializer,
    PersonSerializer,
    EventSerializer,
    TimeEntrySerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all().order_by("-created_at")
    serializer_class = PersonSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-starts_at")
    serializer_class = EventSerializer


class TimeEntryViewSet(viewsets.ModelViewSet):
    queryset = TimeEntry.objects.all().order_by("-created_at")
    serializer_class = TimeEntrySerializer
