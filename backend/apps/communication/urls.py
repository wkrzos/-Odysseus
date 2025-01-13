from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet, RecipientViewSet

router = DefaultRouter()
router.register('messages', MessageViewSet, basename='message')
router.register('recipients', RecipientViewSet, basename='recipient')

urlpatterns = [
    path('', include(router.urls)),
]
