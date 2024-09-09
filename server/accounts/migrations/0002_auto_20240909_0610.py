from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_users_and_groups(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    User = apps.get_model("accounts", "User")

    silverton_group = Group.objects.create(name="Silverton Group")
    silverton_user = User.objects.create(
        email="silverton@example.com",
        password=make_password("intelligence")
    )
    silverton_user.groups.add(silverton_group)

    pepperidge_group = Group.objects.create(name="Pepperidge Group")
    pepperidge_user = User.objects.create(
        email="pepperidge@example.com",
        password=make_password("intelligence")
    )
    pepperidge_user.groups.add(pepperidge_group)

    User.objects.create(
        email="arva@example.com",
        password=make_password("intelligence"),
        is_superuser=True,
        is_staff=True
    )


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_users_and_groups),
    ]
