from rest_framework import serializers
from .models import TripStage

class TripStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripStage
        fields = [
            'id', 'arrival_date', 'departure_date', 
            'address', 'country', 'trip', 'stay_organizer', 
            'created_at', 'updated_at'
        ]
