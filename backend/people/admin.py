from django.contrib import admin
from .models import Person


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "title", "email", "is_active")
    search_fields = ("first_name", "last_name", "email", "title")
    list_filter = ("is_active",)