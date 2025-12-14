from django.contrib import admin
from .models import TimeEntry


@admin.register(TimeEntry)
class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ("person", "project", "date", "hours")
    list_filter = ("project", "person", "date")
    search_fields = ("description",)
