from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientDataViewSet

router = DefaultRouter()
router.register('clientdata', ClientDataViewSet, basename='clientdata')

urlpatterns = [
    path('',include(router.urls)),
]