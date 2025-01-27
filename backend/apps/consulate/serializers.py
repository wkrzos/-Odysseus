from rest_framework import serializers
from .models import Message, Recipient
from ..common.serializers import CountrySerializer

class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = ['id', 'status']

class MessageSerializer(serializers.ModelSerializer):
    recipients = RecipientSerializer()
    class Meta:
        model = Message
        fields = '__all__'

class MessageWithCountrySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    recipientCountries = CountrySerializer(many=True)
    class Meta:
        model = Message
        fields = ['id', 'content', 'date', 'author', 'recipientCountries']
