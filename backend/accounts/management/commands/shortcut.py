from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        call_command("check")
        call_command("wait_for_db")
        call_command("makemigrations")
        call_command("migrate")
        call_command("create_admin")
        call_command("collectstatic")
        # call_command("loaddata", "db_user_fixture.json")
