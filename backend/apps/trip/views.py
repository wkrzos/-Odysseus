from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count

from .models import TripStage
from .serializers import TripStageSerializer, TripStageReportRequestSerializer


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
      { "country": 1, "tripStages": 5 },
      { "country": 2, "tripStages": 12 },
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

        # 2. Build the query
        queryset = TripStage.objects.all()

        # Filter by country if provided
        if country_ids:
            queryset = queryset.filter(country_id__in=country_ids)

        # Filter by date range (assuming arrival_date or departure_date 
        # must be within these bounds)
        # Here, we interpret it as: stages that have arrival_date >= start_date 
        # AND departure_date <= end_date
        queryset = queryset.filter(
            arrival_date__gte=start_date,
            departure_date__lte=end_date
        )

        # 3. Aggregate by country
        # We group by the "country" field, then count how many TripStages are in each group.
        result = (
            queryset
            .values('country')            # Group by country field
            .annotate(tripStages=Count('id'))  # Count TripStage rows
            .order_by('country')          # Just to have consistent ordering
        )

        # 4. Transform the result to match the desired format
        # result might look like: [{"country": 1, "tripStages": 5}, ...]
        # If "country" is None or you'd like to skip them, handle that logic accordingly.
        response_data = [
            {
                "country": row['country'],
                "tripStages": row['tripStages']
            }
            for row in result
        ]

        return Response(response_data, status=status.HTTP_200_OK)