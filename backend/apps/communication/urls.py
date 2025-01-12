from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet, RecipientViewSet

router = DefaultRouter()
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'recipients', RecipientViewSet, basename='recipient')

urlpatterns = [
   *router.urls
]
