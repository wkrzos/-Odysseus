from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet

router = DefaultRouter()
router.register(r'countries', CountryViewSet, basename='countries')

urlpatterns = [
    path('', include(router.urls)),
]
