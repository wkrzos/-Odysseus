from rest_framework import serializers
from .models import Message, Recipient
from apps.common.serializers import CountrySerializer

class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = ['id', 'status', 'phone_number']

class MessageSerializer(serializers.ModelSerializer):
    recipientCountries = CountrySerializer(read_only = True,many=True)
    author = serializers.CharField()
    class Meta:
        model = Message
        fields = '__all__'

        def get_author(self,obj):
            return f"{obj.name} {obj.surname}"

