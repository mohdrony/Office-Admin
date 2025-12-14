from django.db import models


class Person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    title = models.CharField(max_length=120, blank=True) #e.g. Landscape Architect
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name or self.email or f"Person #{self.pk}"