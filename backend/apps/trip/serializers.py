from rest_framework import serializers
from .models import TripStage, StayOrganizerType, StayOrganizer,Trip, TripWarning
from apps.registration.serializers import ClientDataSerializer
from apps.common.serializers import AddressSerializer
from apps.common.models import Country,Address

class TripStageSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())
    class Meta:
        model = TripStage
        fields = '__all__'

    def create(self, validated_data):
        countryId = validated_data.pop("country")

        address_data = validated_data.pop("address")

        address = Address.objects.create(**address_data)

        tripStage = TripStage.objects.create( country=countryId,address=address, **validated_data)

        return tripStage

class TripStageReportRequestSerializer(serializers.Serializer):
    startDate = serializers.DateField()
    endDate = serializers.DateField()
    countries = serializers.ListField(
        child=serializers.IntegerField(), 
        allow_empty=True
    )

class TripWarningSerializer(serializers.Serializer):
    class Meta:
        model = TripWarning
        fields = [
            'id',
            'content',
            'country'
        ]

class TripSerializer(serializers.ModelSerializer):
    client_data = ClientDataSerializer()
    class Meta:
        model = Trip
        fields = [
            'id',
            'client_data'
        ]

class StayOrganizerSerializer(serializers.Serializer):
    type_choices = serializers.SerializerMethodField()

    class Meta:
        model = StayOrganizer,
        fields =[
            'id',
            'name',
            'type',
        ]
