from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class EmailModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        email = kwargs.get("email") or username
        if email:
            try:
                user = UserModel.objects.get(email__iexact=email)
                if user.check_password(password):
                    return user
            except UserModel.DoesNotExist:
                pass
        return None
