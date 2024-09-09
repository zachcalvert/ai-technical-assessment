import csv
import logging

from django.contrib.gis.geos import Point
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from api import serializers
from fields.models import Field

logger = logging.getLogger(__name__)


class GroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        # Check if the user is in the group associated with the Land instance
        return request.user.groups.filter(id=obj.group.id).exists()


class CurrentUserView(APIView):
    def get(self, request):
        serializer = serializers.UserSerializer(
            request.user, context={"request": request}
        )
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the events organized
        for the currently authenticated user's group.
        """
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()

        return User.objects.filter(id=user.id)


class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all()
    serializer_class = serializers.FieldSerializer
    permission_classes = [GroupPermission]
    lookup_field = 'id_hash'

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Field.objects.all()

        user_groups = self.request.user.groups.values_list('id', flat=True)
        return Field.objects.filter(group__id__in=user_groups)
    
    def get_object(self):
        id_hash = self.kwargs.get('id_hash')
        try:
            return Field.objects.get(id_hash=id_hash)
        except Field.DoesNotExist:
            raise NotFound(detail="Field not found")

    def perform_create(self, serializer):
        user = self.request.user
        group = user.groups.first()

        # Convert latitude and longitude to a Point object
        latitude = self.request.data.get('latitude')
        longitude = self.request.data.get('longitude')

        if latitude and longitude:
            location = Point(float(longitude), float(latitude))
        else:
            location = None

        serializer.save(group=group, location=location)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

    def perform_update(self, serializer):
        instance = serializer.save()

        if not instance.group:
            instance.group = self.request.user.groups.first()
            instance.save()


class UploadCSVView(APIView):
    def post(self, request, *args, **kwargs):
        if 'csv_file' not in request.FILES:
            return Response({"error": "No CSV file provided."}, status=status.HTTP_400_BAD_REQUEST)

        csv_file = request.FILES['csv_file']
        csv_data = csv_file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(csv_data)
        fields_data = []

        group = request.user.groups.first()
        if not group:
            return Response({"error": "Current user is not attached to a group."}, status=status.HTTP_400_BAD_REQUEST)

        for row in reader:
            latitude = float(row['latitude'])
            longitude = float(row['longitude'])
            location = Point(longitude, latitude)

            fields_data.append({
                'name': row['name'],
                'group': group.id,
                'acreage': row['acreage'],
                'location': location,
            })

        serializer = serializers.FieldSerializer(data=fields_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "CSV data uploaded and processed."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)