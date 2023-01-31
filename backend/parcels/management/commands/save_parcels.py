import os

import environ
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(settings.ROOT_DIR, ".django"))
# environ.Env.read_env(os.path.join(settings.BASE_DIR, ".env"))

User = get_user_model()


class Command(BaseCommand):
    help = "Creating super admin"

    def handle(self, *args, **options):
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Creating superuser admin account"))

        if not User.objects.all().exists():
            User.objects.create_superuser(
                email=env("DJANGO_SU_EMAIL"),
                first_name=env("DJANGO_FIRST_NAME"),
                last_name=env("DJANGO_LAST_NAME"),
                username=env("DJANGO_SU_NAME"),
                password=env("DJANGO_SU_PASSWORD"),
            )
            self.stdout.write(self.style.SUCCESS("Superuser Created successfully..."))
        else:
            self.stdout.write("Admin already exists")
