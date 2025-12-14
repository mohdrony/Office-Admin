from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "event_type", "project", "starts_at", "ends_at", "location")
    list_filter = ("event_type",)
    search_fields = ("title", "location", "notes")
