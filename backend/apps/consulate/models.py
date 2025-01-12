from django.db import models
from apps.common.models import BaseModel, Address, Country

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
