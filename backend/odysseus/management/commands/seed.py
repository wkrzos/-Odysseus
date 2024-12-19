from django.core.management.base import BaseCommand
from odysseus.models import Address, Country, Trip, StayOrganizer, TripStage, ClientData

class Command(BaseCommand):
    help = 'Create sample data including Address, Country, ClientData, Trip, StayOrganizer, and TripStage'

    def handle(self, *args, **kwargs):
        # Create related instances
        address = Address.objects.create(
            street="Main Street",
            building_number="123",
            apartment_number="10A",
            locality="Sample City"
        )

        country = Country.objects.create(
            code="PL",
            name="Poland"
        )

        client = ClientData.objects.create(
            name="John",
            surname="Doe",
            pesel="12345678901",
            address=address,
            phone_number="+48123456789",
            email_address="john.doe@example.com"
        )
        client.resides_in.add(country)

        trip = Trip.objects.create(client_data=client)

        stay_organizer = StayOrganizer.objects.create(
            name="XYZ Travel Agency",
            type="travelAgency"
        )

        # Create the TripStage record
        trip_stage = TripStage.objects.create(
            arrival_date="2024-12-20",
            departure_date="2024-12-25",
            address=address,
            country=country,
            trip=trip,
            stay_organizer=stay_organizer
        )

        self.stdout.write(f"TripStage created: {trip_stage}")
