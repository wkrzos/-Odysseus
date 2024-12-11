from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class MessageStatus(models.TextChoices):
    SENT = 'sent', _('Sent')
    NOT_SENT = 'notSent', _('Not Sent')

class StayOrganizerType(models.TextChoices):
    PERSON = 'person', _('Person')
    TRAVEL_AGENCY = 'travelAgency', _('Travel Agency')
    EMPLOYER = 'employer', _('Employer')

class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Address(BaseModel):
    street = models.CharField(max_length=255)
    building_number = models.CharField(max_length=50)
    apartment_number = models.CharField(max_length=50, blank=True, null=True)
    locality = models.CharField(max_length=255)

class Country(BaseModel):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)

class Consulate(BaseModel):
    name = models.CharField(max_length=255)
    address = models.OneToOneField(Address, on_delete=models.CASCADE)
    managed_country = models.ManyToManyField(Country, related_name='consulates')

class ConsulateEmployee(BaseModel):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    employee_of = models.ForeignKey(Consulate, on_delete=models.CASCADE, related_name='employees')

class ClientData(BaseModel):
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    pesel = models.CharField(max_length=11, unique=True)
    address = models.OneToOneField(Address, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    email_address = models.EmailField()
    resides_in = models.ManyToManyField(Country)

    def clean(self):
        if not (2 < len(self.name) < 50):
            raise ValidationError(_('Name must be between 3 and 50 characters.'))
        if not (2 < len(self.surname) < 50):
            raise ValidationError(_('Surname must be between 3 and 50 characters.'))

class StayOrganizer(BaseModel):
    name = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=20, choices=StayOrganizerType.choices)

    def clean(self):
        if self.type == StayOrganizerType.TRAVEL_AGENCY and not self.name:
            raise ValidationError(_('Travel Agency must have a name.'))

class Trip(BaseModel):
    client_data = models.ForeignKey(ClientData, on_delete=models.CASCADE, related_name='trips')

class TripStage(BaseModel):
    arrival_date = models.DateField()
    departure_date = models.DateField()
    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='trip_stages')
    stay_organizer = models.ForeignKey(StayOrganizer, on_delete=models.CASCADE, blank=True, null=True)

    def clean(self):
        if self.arrival_date > self.departure_date:
            raise ValidationError(_('Arrival date must be earlier than or equal to departure date.'))

class Message(BaseModel):
    content = models.TextField()
    date = models.DateField(auto_now_add=True)
    recipients = models.ManyToManyField('Recipient', related_name='messages')
    author = models.ForeignKey(ConsulateEmployee, on_delete=models.CASCADE, related_name='messages')

class Recipient(BaseModel):
    status = models.CharField(max_length=10, choices=MessageStatus.choices, default=MessageStatus.NOT_SENT)
    phone_number = models.CharField(max_length=20)

class TripWarning(BaseModel):
    content = models.TextField()
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='warnings')

class TripStagesStatistic(BaseModel):
    month = models.IntegerField()
    year = models.IntegerField()
    trip_count = models.IntegerField()
