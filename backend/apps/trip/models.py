from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from apps.common.models import BaseModel, Address, Country
from apps.registration.models import ClientData

class StayOrganizerType(models.TextChoices):
    PERSON = 'person', _('Person')
    TRAVEL_AGENCY = 'travelAgency', _('Travel Agency')
    EMPLOYER = 'employer', _('Employer')

class StayOrganizer(BaseModel):
    name = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=20, choices=StayOrganizerType.choices)

    def clean(self):
        if self.type == StayOrganizerType.TRAVEL_AGENCY and not self.name:
            raise ValidationError(_('Travel Agency must have a name.'))

class Trip(BaseModel):
    client_data = models.OneToOneField(
        ClientData,
        on_delete=models.CASCADE,
        related_name='trip'
    )

class TripStage(BaseModel):
    arrival_date = models.DateField()
    departure_date = models.DateField()
    address = models.OneToOneField(Address, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name='trip_stages'
    )
    stay_organizer = models.ForeignKey(
        StayOrganizer,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    def clean(self):
        if self.arrival_date > self.departure_date:
            raise ValidationError(_('Arrival date must be before departure date.'))

class TripWarning(BaseModel):
    content = models.TextField()
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name='warnings'
    )
