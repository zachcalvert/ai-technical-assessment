from rest_framework import serializers

from accounts.models import User
from fields.models import Field


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["id", "url", "email"]


class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id_hash', 'name', 'acreage', 'location', 'group', 'created', 'last_updated', 'url']
        read_only_fields = ['id_hash', 'created', 'last_update', 'url']
        extra_kwargs = {
            'url': {'view_name': 'field-detail', 'lookup_field': 'id_hash'}
        }
    
