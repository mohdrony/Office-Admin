from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, PersonViewSet, EventViewSet, TimeEntryViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet)
router.register(r"people", PersonViewSet)
router.register(r"events", EventViewSet)
router.register(r"time-entries", TimeEntryViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
