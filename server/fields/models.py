from django.db import models
from django.contrib.auth.models import Group
from django.contrib.gis.db import models as geomodels

from core.models import BaseModel


class Field(BaseModel):
    name = models.CharField(max_length=255)
    acreage = models.FloatField()
    location = geomodels.GeometryField(null=True)
    group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE, related_name='lands')

    class Meta:
        ordering = ('-last_updated',)

    def __str__(self):
        return self.name
