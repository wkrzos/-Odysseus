from rest_framework import serializers
from .models import ClientData

class ClientDataSerializer(serializers.Serializer):
    class Meta:
        model = ClientData,
        fields = '__all__'
