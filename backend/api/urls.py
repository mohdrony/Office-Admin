from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, PersonViewSet, EventViewSet, TimeEntryViewSet
from holidays.views import HolidayViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet)
router.register(r"people", PersonViewSet)
router.register(r"events", EventViewSet)
router.register(r"time-entries", TimeEntryViewSet)
router.register(r"holidays", HolidayViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
