from datetime import datetime
from django.test import TestCase
from .service import TripStatisticService
from .models import TripStagesStatistic

# Update statistics tests
class TestTripStatisticService(TestCase):

    def setUp(self):
        # Tworzymy czysty stan dla testów
        TripStagesStatistic.objects.all().delete()

    def test_get_list_month_year_single_month(self):
        stage = {
            "arrival_date": "2025-01-10",
            "departure_date": "2025-01-20"
        }
        result = TripStatisticService.get_list_month_year(stage)
        self.assertEqual(result, {(2025, 1)})

    def test_get_list_month_year_multiple_months(self):
        stage = {
            "arrival_date": "2025-01-25",
            "departure_date": "2025-03-05"
        }
        result = TripStatisticService.get_list_month_year(stage)
        self.assertEqual(result, {(2025, 1), (2025, 2), (2025, 3)})

    def test_get_list_month_year_same_day(self):
        stage = {
            "arrival_date": "2025-01-10",
            "departure_date": "2025-01-10"
        }
        result = TripStatisticService.get_list_month_year(stage)
        self.assertEqual(result, {(2025, 1)})


    def test_update_trip_statistics_creates_new_entries(self):
        trip_stages = [
            {"arrival_date": "2025-01-10", 
             "departure_date": "2025-01-20"},
            {"arrival_date": "2025-02-01", 
             "departure_date": "2025-02-15"},
        ]
        TripStatisticService.update_trip_statistics(trip_stages)

        stats = TripStagesStatistic.objects.all()
        self.assertEqual(stats.count(), 2)

        january_stat = TripStagesStatistic.objects.get(month=1, year=2025)
        self.assertEqual(january_stat.trip_count, 1)

        february_stat = TripStagesStatistic.objects.get(month=2, year=2025)
        self.assertEqual(february_stat.trip_count, 1)

    def test_update_trip_statistics_increments_existing_entries(self):
        TripStagesStatistic.objects.create(month=1, year=2025, trip_count=2)

        trip_stages = [
            {"arrival_date": "2025-01-10", "departure_date": "2025-01-20"},
        ]
        TripStatisticService.update_trip_statistics(trip_stages)

        january_stat = TripStagesStatistic.objects.get(month=1, year=2025)
        self.assertEqual(january_stat.trip_count, 3)

    def test_update_trip_statistics_multiple_months(self):
        trip_stages = [
            {"arrival_date": "2025-01-25", "departure_date": "2025-03-05"},
            {"arrival_date": "2025-02-25", "departure_date": "2025-07-05"}
        ]
        TripStatisticService.update_trip_statistics(trip_stages)

        stats = TripStagesStatistic.objects.all()
        self.assertEqual(stats.count(), 7)

        for i in range(1,8):
            month_stat = TripStagesStatistic.objects.get(month=i,year=2025)
            self.assertEqual(month_stat.trip_count,1)


from rest_framework.test import APITestCase
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from .models import Message, Country, ConsulateEmployee,Consulate
from .serializers import MessageWithCountrySerializer
from ..common.models import Address


class TestMessageViewSet(APITestCase):
    def setUp(self):
        self.country1 = Country.objects.create(name="Poland", code="PL")
        self.country2 = Country.objects.create(name="Germany", code="DE")
        
        self.consulate = Consulate.objects.create(
            name="Consulate 1",
            address=Address.objects.create(
                street = "models",
                building_number= "asd",
                apartment_number =" asd",
                locality = "model",
            )
        )
        self.consulate.managed_country.set([self.country1,self.country2])
        self.employee = ConsulateEmployee.objects.create(
            name="John", surname="Doe", employee_of=self.consulate
        )
        
        # Tworzymy wiadomości
        self.message1 = Message.objects.create(
            content="Message for Poland",
            date=timezone.now() - timedelta(days=5),
            author=self.employee,
        )
        self.message1.recipientCountries.add(self.country1)
        
        self.message2 = Message.objects.create(
            content="Message for Germany",
            date=timezone.now() - timedelta(days=10),
            author=self.employee,
        )
        self.message2.recipientCountries.add(self.country2)
        
        self.message3 = Message.objects.create(
            content="Message for both countries",
            date=timezone.now() - timedelta(days=15),
            author=self.employee,
        )
        self.message3.recipientCountries.add(self.country1, self.country2)

    def test_filter_messages_by_country(self):
        response = self.client.get(f"/consulate/messages/with_countries/?countries={self.country1.id}")
    
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_messages = [self.message1, self.message3]
        serializer = MessageWithCountrySerializer(expected_messages, many=True)
        self.assertEqual(response.data, serializer.data)

    def test_filter_messages_by_date_range(self):
        start_date = (timezone.now() - timedelta(days=12)).strftime("%Y-%m-%d")
        end_date = (timezone.now() - timedelta(days=4)).strftime("%Y-%m-%d")
        response = self.client.get(f"/consulate/messages/with_countries/?start_date={start_date}&end_date={end_date}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_messages = [self.message1,self.message2]
        serializer = MessageWithCountrySerializer(expected_messages, many=True)
        self.assertEqual(response.data, serializer.data)

    def test_filter_messages_by_country_and_date_range(self):
        start_date = (timezone.now() - timedelta(days=12)).strftime("%Y-%m-%d")
        response = self.client.get(f"/consulate/messages/with_countries/?countries={self.country2.id}&start_date={start_date}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_messages = [self.message2]
        serializer = MessageWithCountrySerializer(expected_messages, many=True)
        self.assertEqual(response.data, serializer.data)

    def test_no_filters(self):
        response = self.client.get("/consulate/messages/with_countries/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_messages = [self.message1, self.message2, self.message3]
        serializer = MessageWithCountrySerializer(expected_messages, many=True)
        self.assertEqual(response.data, serializer.data)
