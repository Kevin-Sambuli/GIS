from django.apps import AppConfig
from django.contrib.auth import get_user_model


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    #     def sayhi(self):
    #         print("hi")

    def ready(self):
        from . import signals
