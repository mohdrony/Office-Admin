from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "project_number", "is_active", "created_at")
    search_fields = ("name", "project_number")
    list_filter = ("is_active",)