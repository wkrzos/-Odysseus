from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet,AddressViewSet

router = DefaultRouter()
router.register(r'countries', CountryViewSet, basename='countries')
router.register(r'address',AddressViewSet,basename='address')
urlpatterns = [
    path('', include(router.urls)),
]
