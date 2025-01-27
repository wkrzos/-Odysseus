from django.db import models
from apps.common.models import BaseModel, Address, Country
from django.utils.translation import gettext_lazy as _

class Consulate(BaseModel):
    name = models.CharField(max_length=255)
    address = models.OneToOneField(Address, on_delete=models.CASCADE)
    managed_country = models.ManyToManyField(
        Country,
        related_name='consulates'
    ) 

class ConsulateEmployee(BaseModel):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    employee_of = models.ForeignKey(
        Consulate,
        on_delete=models.CASCADE,
        related_name='employees'
    )

    def __str__(self):
        return f"{self.name} {self.surname}"

class MessageStatus(models.TextChoices):
    SENT = 'sent', _('Sent')
    NOT_SENT = 'notSent', _('Not Sent')



class Recipient(BaseModel):
    status = models.CharField(
        max_length=10,
        choices=MessageStatus.choices,
        default=MessageStatus.NOT_SENT
    )
    phone_number = models.CharField(max_length=20)

class Message(BaseModel):
    content = models.TextField()
    date = models.DateField()
    recipients = models.ManyToManyField(Recipient, related_name='messages')
    recipientCountries = models.ManyToManyField(Country, related_name='messages')
    author = models.ForeignKey(
        ConsulateEmployee,
        on_delete=models.CASCADE,
        related_name='messages'
    )

class TripStagesStatistic(BaseModel):
    month = models.IntegerField()
    year = models.IntegerField()
    trip_count = models.IntegerField()

class Parameters(BaseModel):
    deleteTripAfterDays = models.IntegerField()