from rest_framework import viewsets
from .models import Holiday
from .serializers import HolidaySerializer

class HolidayViewSet(viewsets.ModelViewSet):
    queryset = Holiday.objects.all().order_by('date')
    serializer_class = HolidaySerializer
