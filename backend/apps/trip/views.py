from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count

from .models import TripStage,Trip,TripWarning
from .serializers import TripStageSerializer, TripStageReportRequestSerializer,TripSerializer,TripWarningSerializer

class TripWarningByCountryView(APIView):
    def get(self,request,country_id):
        warnings = TripWarning.objects.filter(country_id=country_id)
        data = [{"id": warning.id, "content": warning.content} for warning in warnings]
        return Response(data, status=status.HTTP_200_OK)

class TripViewSet(ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        # 1. Walidacja klienta
        client_data_id = data.get('client_data')
        if not client_data_id:
            return Response({"error": "Client data is required"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Tworzenie Trip
        trip_serializer = TripSerializer(data={"client_data": client_data_id})
        trip_serializer.is_valid(raise_exception=True)
        trip = trip_serializer.save()

        # 3. Tworzenie etapów wycieczki (TripStages)
        trip_stages = data.get('trip_stages', [])
        for stage_data in trip_stages:
            stage_data['trip'] = trip.id  # Powiąż etap z utworzoną wycieczką
            stage_serializer = TripStageSerializer(data=stage_data)
            stage_serializer.is_valid(raise_exception=True)
            stage_serializer.save()

        return Response(trip_serializer.data, status=status.HTTP_201_CREATED)


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

# Commented and logic enchanced by ChatGPT o1
class TripStageReportView(APIView):
    """
    POST /trip/trip-stages/report/
    Request body:
    {
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "countries": [1, 2, 3, ...]
    }
    Response:
    [
      { "country": 1, "countryName": "Poland", "tripStages": 5 },
      { "country": 2, "countryName": "Germany", "tripStages": 12 },
      ...
    ]
    """
    def post(self, request):
        # 1. Validate the input
        serializer = TripStageReportRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        start_date = data['startDate']
        end_date = data['endDate']
        country_ids = data['countries']

        # 2. Build the queryset
        queryset = TripStage.objects.all()

        if country_ids:
            queryset = queryset.filter(country_id__in=country_ids)

        queryset = queryset.filter(
            arrival_date__gte=start_date,
            departure_date__lte=end_date
        )

        # 3. Group by "country" and get the country's name
        #    This returns rows like:
        #    { 'country': 1, 'country__name': 'Poland', 'tripStages': 5 }
        result = (
            queryset
            .values('country', 'country__name')
            .annotate(tripStages=Count('id'))
            .order_by('country')
        )

        # 4. Transform to a friendlier structure
        response_data = []
        for row in result:
            response_data.append({
                "countryId": row['country'],
                "countryName": row['country__name'],
                "tripStages": row['tripStages']
            })

        return Response(response_data, status=status.HTTP_200_OK)