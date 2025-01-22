import random
import datetime

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.registration.models import Trip, TripStage, StayOrganizer, StayOrganizerType, ClientData
from apps.common.models import Address, Country


class Command(BaseCommand):
    """
    Usage:
      python manage.py seed_trips

    This command seeds the database with sample Trip and TripStage data, along
    with minimal supporting data (e.g., Countries, Addresses).
    """

    help = "Seeds the database with sample Trip and TripStage data."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Seeding data..."))

        # 1. Create or get Countries
        poland, _ = Country.objects.get_or_create(code="PL", name="Poland")
        germany, _ = Country.objects.get_or_create(code="DE", name="Germany")
        france, _ = Country.objects.get_or_create(code="FR", name="France")

        # 2. Create Addresses
        address1, _ = Address.objects.get_or_create(
            street="Main Street",
            building_number="123",
            locality="Krakow"
        )
        address2, _ = Address.objects.get_or_create(
            street="Alexanderplatz",
            building_number="10",
            locality="Berlin"
        )
        address3, _ = Address.objects.get_or_create(
            street="Champs-Élysées",
            building_number="5",
            locality="Paris"
        )

        # 3. Create some Clients if none exist
        client1, _ = ClientData.objects.get_or_create(
            pesel="12345678901",
            defaults={
                'name': 'John',
                'surname': 'Doe',
                'address': address1,
                'phone_number': '+48 123 456 789',
                'email_address': 'john.doe@example.com',
                'resides_in': poland
            }
        )

        client2, _ = ClientData.objects.get_or_create(
            pesel="98765432109",
            defaults={
                'name': 'Anna',
                'surname': 'Smith',
                'address': address2,
                'phone_number': '+49 159 888 777',
                'email_address': 'anna.smith@example.com',
                'resides_in': germany
            }
        )

        # 4. Create a few StayOrganizers
        organizer1, _ = StayOrganizer.objects.get_or_create(
            type=StayOrganizerType.TRAVEL_AGENCY,
            defaults={'name': 'Awesome Travel Agency'}
        )
        organizer2, _ = StayOrganizer.objects.get_or_create(
            type=StayOrganizerType.PERSON,
            defaults={'name': 'Bob the Host'}
        )

        # 5. Create Trips
        trip1, created_t1 = Trip.objects.get_or_create(
            client_data=client1
        )
        trip2, created_t2 = Trip.objects.get_or_create(
            client_data=client2
        )

        # 6. Create TripStages
        today = timezone.now().date()
        
        def random_date_after(base_date, max_days=10):
            return base_date + datetime.timedelta(days=random.randint(1, max_days))

        stage1, _ = TripStage.objects.get_or_create(
            trip=trip1,
            address=address1,
            country=poland,
            defaults={
                'arrival_date': today - datetime.timedelta(days=2),
                'departure_date': today,
                'stay_organizer': organizer1
            }
        )

        stage2, _ = TripStage.objects.get_or_create(
            trip=trip1,
            address=address3,
            country=france,
            defaults={
                'arrival_date': today,
                'departure_date': random_date_after(today, 5),
                'stay_organizer': organizer2
            }
        )

        stage3, _ = TripStage.objects.get_or_create(
            trip=trip2,
            address=address2,
            country=germany,
            defaults={
                'arrival_date': today - datetime.timedelta(days=1),
                'departure_date': random_date_after(today, 3),
                'stay_organizer': organizer1
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Trips & TripStages!"))
