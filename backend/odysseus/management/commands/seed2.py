from django.core.management.base import BaseCommand
from odysseus.models import Address, Country, Trip, StayOrganizer, TripStage, ClientData
from datetime import date, timedelta
import random

class Command(BaseCommand):
    help = 'Create sample data including Address, Country, ClientData, Trip, StayOrganizer, and TripStage'

    def handle(self, *args, **kwargs):
        # Sample data for addresses
        addresses = [
            Address.objects.create(
                street=f"Street {i}",
                building_number=f"{random.randint(1, 200)}",
                apartment_number=f"{random.randint(1, 50)}A" if i % 2 == 0 else None,
                locality=f"City {i}"
            ) for i in range(1, 6)
        ]

        # Sample data for countries
        countries = [
            Country.objects.create(
                code=f"C{i}",
                name=f"Country {i}"
            ) for i in range(1, 6)
        ]

        # Sample data for clients
        clients = []
        for i in range(1, 6):
            address = random.choice(addresses)
            client = ClientData.objects.create(
                name=f"ClientName{i}",
                surname=f"ClientSurname{i}",
                pesel=f"{12345678901 + i}",
                address=address,
                phone_number=f"+480000000{i}",
                email_address=f"client{i}@example.com"
            )
            client.resides_in.add(random.choice(countries))
            clients.append(client)

        # Sample data for trips
        trips = [
            Trip.objects.create(client_data=random.choice(clients))
            for _ in range(10)
        ]

        # Sample data for stay organizers
        stay_organizers = [
            StayOrganizer.objects.create(
                name=f"Organizer {i}",
                type=random.choice(["person", "travelAgency", "employer"])
            ) for i in range(1, 4)
        ]

        # Sample data for trip stages
        for i in range(1, 11):
            arrival_date = date.today() + timedelta(days=random.randint(1, 30))
            departure_date = arrival_date + timedelta(days=random.randint(1, 10))
            TripStage.objects.create(
                arrival_date=arrival_date,
                departure_date=departure_date,
                address=random.choice(addresses),
                country=random.choice(countries),
                trip=random.choice(trips),
                stay_organizer=random.choice(stay_organizers)
            )

        self.stdout.write(self.style.SUCCESS("Sample data created successfully!"))