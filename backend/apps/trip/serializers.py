from rest_framework import serializers
from .models import TripStage

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
