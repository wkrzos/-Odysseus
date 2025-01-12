from django.db import models
from apps.common.models import BaseModel

class Parameters(BaseModel):
    deleteTripAfterDays = models.IntegerField()
