from django.db import models
from django.utils.translation import gettext_lazy as _

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

    def __str__(self):
        return self.name
