from rest_framework import serializers
from .models import ClientData
from apps.common.serializers import AddressSerializer, CountrySerializer
from apps.common.models import Country,Address

class ClientDataSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    resides_in = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())

    class Meta:
        model = ClientData
        fields = '__all__'
    
    def create(self, validated_data):
        country_id = validated_data.pop('resides_in')
        address_data = validated_data.pop("address")

        address = Address.objects.create(**address_data)
        
        client_data = ClientData.objects.create( resides_in=country_id,address=address, **validated_data)

        return client_data