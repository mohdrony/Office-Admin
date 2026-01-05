from django.db import models

class Holiday(models.Model):
    class Type(models.TextChoices):
        FULL_DAY = "FULL_DAY", "Full Day"
        HALF_DAY = "HALF_DAY", "Half Day"

    date = models.DateField(unique=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.FULL_DAY)

    def __str__(self):
        return f"{self.date} - {self.name}"
