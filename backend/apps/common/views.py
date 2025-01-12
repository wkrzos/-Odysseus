from rest_framework.viewsets import ModelViewSet
from .models import Country,Address
from .serializers import CountrySerializer,AddressSerializer

class CountryViewSet(ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class AddressViewSet(ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer