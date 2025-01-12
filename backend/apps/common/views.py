from rest_framework.viewsets import ModelViewSet
from .models import Country
from .serializers import CountrySerializer

class CountryViewSet(ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer