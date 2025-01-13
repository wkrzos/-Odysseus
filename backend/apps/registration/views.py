from rest_framework.viewsets import ModelViewSet
from .models import ClientData
from .serializers import ClientDataSerializer

class ClientDataViewSet(ModelViewSet):
    queryset = ClientData.objects.all()
    serializer_class = ClientDataSerializer
