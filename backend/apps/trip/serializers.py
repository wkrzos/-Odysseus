from rest_framework import serializers
from .models import TripStage, StayOrganizerType, StayOrganizer,Trip, TripWarning
from apps.registration.serializers import ClientDataSerializer

class TripStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripStage
        fields = [
            'id',
            'arrival_date',
            'departure_date',
            'address',
            'country',
            'trip',
            'stay_organizer',
            'created_at',
            'updated_at'
        ]

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
            'type_choices'
        ]

    def get_type_choices(self,obj):
        return StayOrganizerType.choices
