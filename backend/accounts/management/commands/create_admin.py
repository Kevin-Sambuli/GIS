import os

import environ
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.utils.crypto import get_random_string

env = environ.Env(DEBUG=(bool, False))
# environ.Env.read_env(os.path.join(settings.ROOT_DIR, ".django"))
environ.Env.read_env(os.path.join(settings.BASE_DIR, ".env"))

User = get_user_model()


class Command(BaseCommand):
    help = " Automatically create super user"

    # def add_arguments(self, parser):
    #     parser.add_argument('count', type=int, help='Indicates the number of users to be created')
    #     parser.add_argument('-p', '--prefix', type=str, help='Define a username prefix')
    #     parser.add_argument('-s', '--superuser', action='store_true', help='Create a superuser account')

    def handle(self, *args, **options):
        User.objects.all().delete()
        self.stdout.write(
            self.style.SUCCESS("Trying to Create superuser admin account 2")
        )

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
            raise CommandError("error occurred")
            self.stderr.write("Admin User already exists")


# class Command(BaseCommand):
#     help = " Automatically create super user"

#     def handle(self, *args, **options):
#         User.objects.create_superuser(
#             email=os.environ.get("DJANGO_SU_EMAIL", "admin@admin.com"),
#             first_name=os.environ.get("DJANGO_FIRST_NAME", "admin"),
#             last_name=os.environ.get("DJANGO_LAST_NAME", "admin"),
#             username=os.environ.get("DJANGO_SU_NAME", "admin"),
#             password=os.environ.get("DJANGO_SU_PASSWORD", "admin"),
#         )


"""
class Command(BaseCommand):
    help = 'Generate random users'

    def add_arguments(self, parser):
        parser.add_argument('count', type=int, help='Indicates the number of users to be created')
        parser.add_argument('-p', '--prefix', type=str, help='Define a username prefix')
        parser.add_argument('-s', '--superuser', action='store_true', help='Create a superuser account')

    def handle(self, *args, **kwargs):
        count = kwargs['count']
        prefix = kwargs['prefix']
        superuser = kwargs['superuser']

        for i in range(count):
            if prefix:
                username = f'{prefix}_{get_random_string()}'
            else:
                username = get_random_string()

            if superuser:
                User.objects.create_superuser(username=username, email='hello@hi.com', password='123')
            else:
                User.objects.create_user(username=username, email='hello@hi.com', password='123')
                
                
                
# remove user
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Remove users'

    def add_arguments(self, parser):
        parser.add_argument('user_id', nargs='+', type=int, help='User ID')

    def handle(self, *args, **kwargs):
        users_ids = kwargs['user_id']

        for user_id in users_ids:
            try:
                user = User.objects.get(pk=user_id)
                user.delete()
                self.stdout.write(self.style.SUCCESS(f'User {user.username} with id {user_id} removed successfully!'))
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'User with id {user_id} does not exist.'))
                


"""
