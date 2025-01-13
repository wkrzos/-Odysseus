from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Message, Recipient
from .serializers import MessageSerializer, RecipientSerializer,MessageWithCountrySerializer


class RecipientViewSet(ModelViewSet):
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer


class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @action(detail=False,methods=["get"],url_path="with_countries")
    def list_with_countries(self,request):
        messages = self.get_queryset()
        serializer = MessageWithCountrySerializer(messages, many=True)
        return Response(serializer.data)
