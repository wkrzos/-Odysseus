from rest_framework import serializers
from .models import ClientData
from apps.common.serializers import AddressSerializer, CountrySerializer

class ClientDataSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    resides_in = CountrySerializer(many=True)

    class Meta:
        model = ClientData
        fields = '__all__'
        # [
        #     'id',
        #     'name',
        #     'surname',
        #     'pesel',
        #     'address',
        #     'phone_number',
        #     'email_address',
        #     'resides_in' ,
        # ]
