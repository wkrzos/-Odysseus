from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TripStage
from .serializers import TripStageSerializer

class TripStageListView(APIView):
    def get(self, request):
        trip_stages = TripStage.objects.all()
        serializer = TripStageSerializer(trip_stages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TripStageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)