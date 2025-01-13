from rest_framework import serializers
from .models import Message, Recipient


class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = ['id', 'status', 'phone_number']


class MessageSerializer(serializers.ModelSerializer):
    recipients = RecipientSerializer(many=True)

    class Meta:
        model = Message
        fields = ['id', 'content', 'date', 'recipients', 'author']
