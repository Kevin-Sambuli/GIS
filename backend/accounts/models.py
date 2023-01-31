import geocoder
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    Group,
    Permission,
    PermissionsMixin,
)
from django.contrib.gis.db import models as geoModels
from django.core.mail import send_mail
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token

from .manager import UserManager

# class PostObjects(models.Manager):
#     def get_queryset(self):
#         return super().get_queryset().filter(status='published')


class Account(AbstractBaseUser, PermissionsMixin):
    class Types(models.TextChoices):
        LANDOWNER = "landowner", "LANDOWNER"
        AGENT = "agent", "AGENT"
        SURVEYOR = "surveyor", "SURVEYOR"
        MANAGER = "manager", "MANAGER"

    first_name = models.CharField("First Name", max_length=30)
    last_name = models.CharField("Last Name", max_length=30)
    email = models.EmailField(
        verbose_name="Email", blank=False, max_length=100, unique=True
    )
    username = models.CharField("Username", max_length=30, unique=True)

    default_type = Types.LANDOWNER

    type = models.CharField(
        "Type", max_length=30, choices=Types.choices, default=default_type
    )
    date_joined = models.DateTimeField("Date Joined", auto_now_add=True)
    last_login = models.DateTimeField(verbose_name="last login", auto_now=True)

    # permissions
    is_admin = models.BooleanField("admin", default=False)
    is_active = models.BooleanField("active", default=False)
    is_staff = models.BooleanField("staff", default=False)
    is_superuser = models.BooleanField("superuser", default=False)

    # unique parameter that will be used to login in the user
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "username"]

    # hooking the New customized Manager to our Model
    objects = UserManager()

    class Meta:
        db_table = "accounts"
        verbose_name = "Accounts"
        verbose_name_plural = "Accounts"

    def __str__(self):
        return "{}".format(self.get_full_name())

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self._user_group()

    def _user_group(self):
        if self.type == self.Types.LANDOWNER:
            landowners = Group.objects.get(name="landowners")
            landowners.user_set.add(self)

        elif self.type == self.Types.AGENT:
            agents = Group.objects.get(name="agents")
            agents.user_set.add(self)

        elif self.type == self.Types.SURVEYOR:
            surveyors = Group.objects.get(name="surveyors")
            surveyors.user_set.add(self)

        elif self.type == self.Types.MANAGER:
            managers = Group.objects.get(name="managers")
            managers.user_set.add(self)

    def get_username(self):
        """Returns the username of the current user."""
        return self.username.strip().title()

    def get_full_name(self):
        """Returns the first_name plus the last_name, with a space in between."""
        full_name = "%s %s" % (self.first_name.title(), self.last_name.title())
        return full_name.strip()

    def email_user(self, subject, message):
        """Sends an email to this User."""
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [self.email],
            fail_silently=False,
        )


# Model Managers for proxy models
class LandownerManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        # return super().get_queryset(*args, **kwargs).filter(Q(type__contains=Account.Types.LANDOWNER))
        return (
            super().get_queryset(*args, **kwargs).filter(type=Account.Types.LANDOWNER)
        )


class AgentManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        # return super().get_queryset(*args, **kwargs).filter(Q(type__contains=Account.Types.AGENT))
        return super().get_queryset(*args, **kwargs).filter(type=Account.Types.AGENT)


class SurveyorManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        # return super().get_queryset(*args, **kwargs).filter(Q(type__contains=Account.Types.SURVEYOR))
        return super().get_queryset(*args, **kwargs).filter(type=Account.Types.SURVEYOR)


class ManagerManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        # return super().get_queryset(*args, **kwargs).filter(Q(type__contains=Account.Types.MANAGER))
        return super().get_queryset(*args, **kwargs).filter(type=Account.Types.MANAGER)


# Proxy Models. They do not create a seperate table
class Landowner(Account):
    objects = LandownerManager()
    default_type = Account.Types.LANDOWNER

    class Meta:
        proxy = True
        permissions = (
            ("can_view_account", "can view land owners"),
            ("can_create_account", "can create land owners"),
        )

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

    def sell(self):
        print("I can sell")

    # @property
    # def showAdditional(self):
    #     return self.selleradditional


class Surveyor(Account):
    objects = SurveyorManager()
    default_type = Account.Types.SURVEYOR

    class Meta:
        proxy = True
        permissions = (("can_process_surveys", "To process land surveys"),)

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

    def sell(self):
        print("I can sell")

    # @property
    # def showAdditional(self):
    #     return self.selleradditional
    #     return self.selleradditional


class Agent(Account):
    objects = AgentManager()
    default_type = Account.Types.AGENT

    class Meta:
        proxy = True
        permissions = (
            ("can_manage_landowner", "To manage land owners"),
            ("can_manage_surveyors", "To manage Surveyors"),
        )

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

    @classmethod
    def list_agents(cls):
        return cls.objects.filter(type=Account.Types.AGENT).count()

    def showAdditional(self):
        return "additional info"


class Manager(Account):
    objects = ManagerManager()
    default_type = Account.Types.MANAGER

    class Meta:
        proxy = True
        permissions = (
            ("can_manage_landowners", "To manage land owners"),
            ("can_manage_surveyors", "To manage surveyors"),
            ("can_manage_agents", "To manage agents"),
        )

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

    def sell(self):
        print("I can sell")


class Profile(models.Model):
    MALE = "m"
    FEMALE = "f"
    GENDER = [(MALE, "Male"), (FEMALE, "Female")]
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Owner"
    )
    dob = models.DateField("Date of Birth", blank=True, null=True)
    gender = models.CharField("Gender", max_length=5, choices=GENDER)
    location = geoModels.PointField("Location", blank=True, null=True, srid=4326)
    id_no = models.CharField(
        "ID NO",
        max_length=10,
        unique=True,
        blank=True,
        null=True,
    )
    # kra_pin = models.CharField(
    #     "KRA PIN", max_length=20, unique=True, null=True, blank=True
    # )
    phone_regex = RegexValidator(
        regex=r"^\d{10}$", message="phone number should exactly be in 10 digits"
    )
    phone = models.CharField(
        "Contact Phone",
        max_length=10,
        validators=[phone_regex],
        unique=True,
        blank=True,
        null=True,
    )
    image = models.ImageField(
        "Profile Image", upload_to="img", default="img/img.jpg", null=True, blank=True
    )

    class Meta:
        db_table = "profile"
        verbose_name = "Profile"
        verbose_name_plural = "Profile"

    def __str__(self):
        return "{}".format(self.owner.username)

    def get_profile_image_filename(self):
        return str(self.image)[str(self.image).index("img/" + str(self.pk) + "/") :]
