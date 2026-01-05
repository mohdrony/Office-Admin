from rest_framework.routers import DefaultRouter
from .views import HolidayViewSet

router = DefaultRouter()
router.register(r'holidays', HolidayViewSet)

urlpatterns = router.urls
