from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date
from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import (
    Country,
    ClientData,
    StayOrganizer,
    Trip,
    TripStage,
    TripWarning,
    Country,
    Address
)

class TripStageReportViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.country1 = Country.objects.create(id=1, name="Poland")
        cls.country2 = Country.objects.create(id=2, name="Germany")

        cls.client_data = ClientData.objects.create(
            first_name="John",
            last_name="Doe",
            resides_in=cls.country1
        )

        cls.trip = Trip.objects.create(client_data=cls.client_data)

        TripStage.objects.create(
            trip=cls.trip,
            country=cls.country1,
            arrival_date=date(2023, 1, 5),
            departure_date=date(2023, 1, 10)
        )
        TripStage.objects.create(
            trip=cls.trip,
            country=cls.country1,
            arrival_date=date(2023, 1, 15),
            departure_date=date(2023, 1, 20)
        )
        TripStage.objects.create(
            trip=cls.trip,
            country=cls.country2,
            arrival_date=date(2023, 1, 10),
            departure_date=date(2023, 1, 15)
        )

        # Outside date range
        TripStage.objects.create(
            trip=cls.trip,
            country=cls.country1,
            arrival_date=date(2022, 12, 20),
            departure_date=date(2023, 1, 2)  # Departure within range, arrival before
        )
        TripStage.objects.create(
            trip=cls.trip,
            country=cls.country1,
            arrival_date=date(2023, 1, 25),
            departure_date=date(2023, 2, 5)  # Departure after range
        )

    # --- VALID REQUESTS ---
    def test_valid_request_with_countries(self):
        url = reverse('trip-stages/report/')
        data = {
            "startDate": "2023-01-01",
            "endDate": "2023-01-31",
            "countries": [1]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Expect 2 stages in Poland, 0 in Germany (filtered by countries=[1])
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['countryId'], 1)
        self.assertEqual(response.data[0]['tripStages'], 2)

    def test_valid_request_without_countries(self):
        url = reverse('trip-stage-report')
        data = {
            "startDate": "2023-01-01",
            "endDate": "2023-01-31",
            "countries": []
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Expect 2 countries: Poland (2 stages), Germany (1 stage)
        self.assertEqual(len(response.data), 2)
        country1_data = next(item for item in response.data if item['countryId'] == 1)
        country2_data = next(item for item in response.data if item['countryId'] == 2)
        self.assertEqual(country1_data['tripStages'], 2)
        self.assertEqual(country2_data['tripStages'], 1)

    # --- INVALID REQUESTS ---
    def test_invalid_date_range(self):
        url = reverse('trip-stage-report')
        data = {
            "startDate": "2023-02-01",  # Start date > end date
            "endDate": "2023-01-01",
            "countries": [1]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # --- RESPONSE STRUCTURE ---
    def test_response_structure(self):
        url = reverse('trip-stage-report')
        data = {
            "startDate": "2023-01-01",
            "endDate": "2023-01-31",
            "countries": [1]
        }
        response = self.client.post(url, data, format='json')
        
        for item in response.data:
            self.assertIn('countryId', item)
            self.assertIn('countryName', item)
            self.assertIn('tripStages', item)

    # --- EDGE CASES ---
    def test_no_stages_in_date_range(self):
        url = reverse('trip-stage-report')
        data = {
            "startDate": "2024-01-01",  # No stages in this range
            "endDate": "2024-01-31",
            "countries": [1]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

class ModelTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create common test data
        cls.country = Country.objects.create(name="Test Country")
        cls.address = Address.objects.create(
            street="Test Street",
            city="Test City",
            postal_code="00-000",
            country=cls.country
        )

    # ClientData Tests
    def test_create_valid_client_data(self):
        client = ClientData.objects.create(
            name="John",
            surname="Doe",
            pesel="12345678901",
            address=self.address,
            phone_number="+48123456789",
            email_address="test@example.com",
            resides_in=self.country
        )
        self.assertEqual(client.full_clean(), None)

    def test_client_name_validation(self):
        client = ClientData(
            name="Jo",  # Too short
            surname="Doe",
            pesel="12345678901",
            address=self.address,
            phone_number="+48123456789",
            email_address="test@example.com",
            resides_in=self.country
        )
        with self.assertRaises(ValidationError):
            client.full_clean()

    def test_client_surname_validation(self):
        client = ClientData(
            name="John",
            surname="D",  # Too short
            pesel="12345678901",
            address=self.address,
            phone_number="+48123456789",
            email_address="test@example.com",
            resides_in=self.country
        )
        with self.assertRaises(ValidationError):
            client.full_clean()

    # StayOrganizer Tests
    def test_travel_agency_requires_name(self):
        organizer = StayOrganizer(
            type='travelAgency',
            name=None  # Missing name
        )
        with self.assertRaises(ValidationError):
            organizer.full_clean()

    def test_valid_stay_organizer(self):
        organizer = StayOrganizer(
            type='person',
            name=None  # Allowed for non-agency
        )
        self.assertEqual(organizer.full_clean(), None)

    # Trip Tests
    def test_trip_relationship(self):
        client = ClientData.objects.create(
            name="John",
            surname="Doe",
            pesel="12345678901",
            address=self.address,
            phone_number="+48123456789",
            email_address="test@example.com",
            resides_in=self.country
        )
        trip = Trip.objects.create(client_data=client)
        self.assertEqual(trip.client_data, client)

    # TripStage Tests
    def test_trip_stage_date_validation(self):
        stage = TripStage(
            arrival_date="2023-01-02",
            departure_date="2023-01-01",  # Invalid dates
            address=self.address,
            country=self.country,
            trip=Trip.objects.create(
                client_data=ClientData.objects.create(
                    name="John",
                    surname="Doe",
                    pesel="12345678901",
                    address=self.address,
                    phone_number="+48123456789",
                    email_address="test@example.com",
                    resides_in=self.country
                )
            )
        )
        with self.assertRaises(ValidationError):
            stage.full_clean()

    def test_valid_trip_stage(self):
        trip = Trip.objects.create(
            client_data=ClientData.objects.create(
                name="John",
                surname="Doe",
                pesel="12345678901",
                address=self.address,
                phone_number="+48123456789",
                email_address="test@example.com",
                resides_in=self.country
            )
        )
        stage = TripStage(
            arrival_date="2023-01-01",
            departure_date="2023-01-05",
            address=self.address,
            country=self.country,
            trip=trip
        )
        self.assertEqual(stage.full_clean(), None)

    # TripWarning Tests
    def test_trip_warning_relationship(self):
        warning = TripWarning.objects.create(
            content="Test warning",
            country=self.country
        )
        self.assertEqual(warning.country.warnings.count(), 1)

    def test_trip_stage_relationships(self):
        # Test all foreign key relationships
        client = ClientData.objects.create(
            name="John",
            surname="Doe",
            pesel="12345678901",
            address=self.address,
            phone_number="+48123456789",
            email_address="test@example.com",
            resides_in=self.country
        )
        trip = Trip.objects.create(client_data=client)
        organizer = StayOrganizer.objects.create(type='person')
        
        stage = TripStage.objects.create(
            arrival_date="2023-01-01",
            departure_date="2023-01-05",
            address=self.address,
            country=self.country,
            trip=trip,
            stay_organizer=organizer
        )
        
        self.assertEqual(stage.trip, trip)
        self.assertEqual(stage.country, self.country)
        self.assertEqual(stage.stay_organizer, organizer)

    def test_cascade_deletion(self):
        client = ClientData.objects.create(
            name="John",
            surname="Doe",
            pesel="12345678901",
            address=self.address,
            phone_number="+48123456789",
            email_address="test@example.com",
            resides_in=self.country
        )
        trip = Trip.objects.create(client_data=client)
        
        # Delete client should delete trip
        client.delete()
        with self.assertRaises(Trip.DoesNotExist):
            Trip.objects.get(pk=trip.id)