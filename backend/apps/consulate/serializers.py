from rest_framework import serializers
from .models import Message, Recipient

class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = ['id', 'status', 'phone_number']

class MessageSerializer(serializers.ModelSerializer):
    recipients = RecipientSerializer()
    class Meta:
        model = Message
        fields = '__all__'

class MessageWithCountrySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    countries = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'content', 'date', 'author', 'countries']

    def get_countries(self,obj):
        consulate = obj.author.employee_of
        return [country.name for country in consulate.managed_country.all()]
