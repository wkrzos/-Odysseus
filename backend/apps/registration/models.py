from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from apps.common.models import BaseModel, Address, Country

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
