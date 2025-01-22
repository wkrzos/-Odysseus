from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Message, Recipient
from django.db.models import Q
from .serializers import MessageSerializer, RecipientSerializer,MessageWithCountrySerializer


class RecipientViewSet(ModelViewSet):
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer


class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @action(detail=False,methods=["get"],url_path="with_countries")
    def list_with_countries(self,request):
        country_ids = request.query_params.getlist("countries",[])
        start_date = request.query_params.get("start_date",None)
        end_date = request.query_params.get("end_date",None)

        messages = self.get_queryset()

        if start_date:
            messages = messages.filter(date__gte=start_date)
        if end_date:
            messages = messages.filter(date__lte=end_date)
        if country_ids:
            messages = messages.filter(
                Q(author__employee_of__managed_country__id__in=country_ids)
            ).distinct()
            
        serializer = MessageWithCountrySerializer(messages, many=True)
        return Response(serializer.data)
