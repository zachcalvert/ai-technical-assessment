import pytest


@pytest.mark.django_db
def test_user_to_string(api_user):
    assert str(api_user) == 'api_user@example.com'
