import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import Client
from rest_framework.test import APIClient


User = get_user_model()


@pytest.fixture
def group():
    yield Group.objects.create("Test Group")


@pytest.fixture
def api_user(group):
    user = User.objects.create_user(email="api_user@example.com", password="password")
    user.groups.add(group)
    yield user


@pytest.fixture
def admin_user():
    user = User.objects.create_superuser(
        email="admin_user@example.com", password="password"
    )
    yield user


@pytest.fixture
def api_client(api_user):
    client = APIClient()
    client.force_authenticate(user=api_user)
    yield client


@pytest.fixture
def admin_api_client(admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)
    yield client


@pytest.fixture
def admin_client(admin_user):
    client = Client()
    client.force_login(admin_user)
    yield client
