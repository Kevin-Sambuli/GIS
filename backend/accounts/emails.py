import os

import requests
from django.contrib.auth.tokens import default_token_generator
from djoser import utils
from djoser.conf import settings
from templated_mail.mail import BaseEmailMessage


class ActivationEmail(BaseEmailMessage):
    template_name = "email/activation.html"

    def get_context_data(self):
        # ActivationEmail can be deleted
        context = super().get_context_data()

        user = context.get("user")
        context["user"] = user
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        context["url"] = settings.ACTIVATION_URL.format(**context)
        # context["domain"] = settings.DOMAIN  # Your site domain
        # context["protocol"] = settings.PROTOCOL # Your site protocol e.g. ("http", "https")
        return context


class ConfirmationEmail(BaseEmailMessage):
    template_name = "email/confirmation.html"

    def get_context_data(self):
        # PasswordResetEmail can be deleted
        context = super().get_context_data()

        user = context.get("user")
        context["user"] = user

        return context


class PasswordResetEmail(BaseEmailMessage):
    template_name = "email/password_reset.html"

    def get_context_data(self):
        # PasswordResetEmail can be deleted
        context = super().get_context_data()

        user = context.get("user")
        context["user"] = user
        # context["protocol"] = settings.PROTOCOL,
        # context["domain"] = settings.DOMAIN # Your site domain
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        context["url"] = settings.PASSWORD_RESET_CONFIRM_URL.format(**context)

        return context


class PasswordChangedConfirmationEmail(BaseEmailMessage):
    template_name = "email/password_changed_confirmation.html"

    def get_context_data(self):
        context = super().get_context_data()

        user = context.get("user")
        context["user"] = user

        return context


class UsernameChangedConfirmationEmail(BaseEmailMessage):
    template_name = "email/username_changed_confirmation.html"

    def get_context_data(self):
        context = super().get_context_data()

        user = context.get("user")
        context["user"] = user

        return context


class UsernameResetEmail(BaseEmailMessage):
    template_name = "email/username_reset.html"

    def get_context_data(self):
        context = super().get_context_data()

        user = context.get("user")
        context["user"] = user
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        context["url"] = settings.USERNAME_RESET_CONFIRM_URL.format(**context)
        context["protocol"] = settings.PROTOCOL
        context["domain"] = settings.DOMAIN
        return context
