from django.db import models
from api.models import Farm

class Location(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    lat = models.FloatField()
    lon = models.FloatField()

    def __str__(self):
        return f'{self.farm.name} {self.lat} {self.lon}'