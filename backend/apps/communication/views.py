from rest_framework.viewsets import ModelViewSet
from .models import Message, Recipient
from .serializers import MessageSerializer, RecipientSerializer


class RecipientViewSet(ModelViewSet):
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer


class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
