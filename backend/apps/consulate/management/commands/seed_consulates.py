import random
from django.core.management.base import BaseCommand
from apps.consulate.models import Consulate, ConsulateEmployee, Message, Recipient,MessageStatus
from apps.common.models import Address, Country
from django.utils.translation import gettext_lazy as _
from datetime import datetime,timedelta
from django.utils import timezone

class Command(BaseCommand):
    """
    Usage:
      python manage.py seed_trips
    """
    help = "Seeds the database with sample consulates, employees, messages, and recipients."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Seeding data..."))

        # Create countries
        country_data = [
            {"code": "PL", "name": "Poland"},
            {"code": "DE", "name": "Germany"},
            {"code": "FR", "name": "France"},
            {"code": "US", "name": "United States"},
            {"code": "JP", "name": "Japan"},
        ]
        countries = [Country.objects.get_or_create(code=data["code"], name=data["name"])[0] for data in country_data]

        # Create consulates
        consulates_data = [
            {"name": "Konsulat 1", "street": "ul. Kościuszki", "building_number": "12", "locality": "Warszawa"},
            {"name": "Konsulat 2", "street": "ul. Świętokrzyska", "building_number": "34", "locality": "Kraków"},
        ]
        consulates = []
        for consulate_data in consulates_data:
            address, _ = Address.objects.get_or_create(
                street=consulate_data["street"],
                building_number=consulate_data["building_number"],
                locality=consulate_data["locality"],
            )
            consulate, _ = Consulate.objects.get_or_create(name=consulate_data["name"], address=address)
            consulate.managed_country.set(random.sample(countries, k=2))  # Assign 2 random countries
            consulates.append(consulate)

        # Create employees
        employee_names = ["Jan Kowalski", "Anna Nowak", "Maria Wiśniewska"]
        employees = []
        for name in employee_names:
            first_name, last_name = name.split()
            employee, _ = ConsulateEmployee.objects.get_or_create(
                name=first_name,
                surname=last_name,
                employee_of=random.choice(consulates),
            )
            employees.append(employee)

        # Create messages
        for i in range(5):
            message = Message.objects.create(
                content=f"This is a sample message.",
                author=random.choice(employees),
                date= (timezone.now() + timedelta(days=random.randint(-10,10)))
            )
            message.recipientCountries.set(random.sample(countries, k=2))  # Assign 2 random recipient countries

            # Create recipients for the message
            for _ in range(random.randint(1, 3)):  # Each message has 1 to 3 recipients
                Recipient.objects.create(
                    status=MessageStatus.SENT,
                    phone_number=f"+48{random.randint(100000000, 999999999)}",
                )

        self.stdout.write(self.style.SUCCESS("Seeding completed successfully!"))
