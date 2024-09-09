from django.db import models
from shortuuid.django_fields import ShortUUIDField


class BaseModel(models.Model):
    id_hash = ShortUUIDField(
        length=8,
        max_length=8,
        alphabet="abcdefg12345678",
    )
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
