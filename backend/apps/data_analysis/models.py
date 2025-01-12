from django.db import models
from apps.common.models import BaseModel

class TripStagesStatistic(BaseModel):
    month = models.IntegerField()
    year = models.IntegerField()
    trip_count = models.IntegerField()
