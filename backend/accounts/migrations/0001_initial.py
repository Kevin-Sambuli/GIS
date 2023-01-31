# Generated by Django 3.2.3 on 2022-12-14 16:14

import django.contrib.gis.db.models.fields
import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

import accounts.manager


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Account",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "first_name",
                    models.CharField(max_length=30, verbose_name="First Name"),
                ),
                (
                    "last_name",
                    models.CharField(max_length=30, verbose_name="Last Name"),
                ),
                (
                    "email",
                    models.EmailField(
                        max_length=100, unique=True, verbose_name="Email"
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        max_length=30, unique=True, verbose_name="Username"
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("landowner", "LANDOWNER"),
                            ("agent", "AGENT"),
                            ("surveyor", "SURVEYOR"),
                            ("manager", "MANAGER"),
                        ],
                        default="landowner",
                        max_length=30,
                        verbose_name="Type",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(auto_now_add=True, verbose_name="Date Joined"),
                ),
                (
                    "last_login",
                    models.DateTimeField(auto_now=True, verbose_name="last login"),
                ),
                ("is_admin", models.BooleanField(default=False, verbose_name="admin")),
                (
                    "is_active",
                    models.BooleanField(default=False, verbose_name="active"),
                ),
                ("is_staff", models.BooleanField(default=False, verbose_name="staff")),
                (
                    "is_superuser",
                    models.BooleanField(default=False, verbose_name="superuser"),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "Accounts",
                "verbose_name_plural": "Accounts",
                "db_table": "accounts",
            },
            managers=[
                ("objects", accounts.manager.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "dob",
                    models.DateField(
                        blank=True, null=True, verbose_name="Date of Birth"
                    ),
                ),
                (
                    "gender",
                    models.CharField(
                        choices=[("m", "Male"), ("f", "Female")],
                        max_length=5,
                        verbose_name="Gender",
                    ),
                ),
                (
                    "location",
                    django.contrib.gis.db.models.fields.PointField(
                        blank=True, null=True, srid=4326, verbose_name="Location"
                    ),
                ),
                (
                    "id_no",
                    models.CharField(
                        blank=True,
                        max_length=10,
                        null=True,
                        unique=True,
                        verbose_name="ID NO",
                    ),
                ),
                (
                    "phone",
                    models.CharField(
                        blank=True,
                        max_length=10,
                        null=True,
                        unique=True,
                        validators=[
                            django.core.validators.RegexValidator(
                                message="phone number should exactly be in 10 digits",
                                regex="^\\d{10}$",
                            )
                        ],
                        verbose_name="Contact Phone",
                    ),
                ),
                (
                    "image",
                    models.ImageField(
                        blank=True,
                        default="img/img.jpg",
                        null=True,
                        upload_to="img",
                        verbose_name="Profile Image",
                    ),
                ),
                (
                    "owner",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Owner",
                    ),
                ),
            ],
            options={
                "verbose_name": "Profile",
                "verbose_name_plural": "Profile",
                "db_table": "profile",
            },
        ),
        migrations.CreateModel(
            name="Agent",
            fields=[],
            options={
                "permissions": (
                    ("can_manage_landowner", "To manage land owners"),
                    ("can_manage_surveyors", "To manage Surveyors"),
                ),
                "proxy": True,
                "indexes": [],
                "constraints": [],
            },
            bases=("accounts.account",),
        ),
        migrations.CreateModel(
            name="Landowner",
            fields=[],
            options={
                "permissions": (
                    ("can_view_account", "can view land owners"),
                    ("can_create_account", "can create land owners"),
                ),
                "proxy": True,
                "indexes": [],
                "constraints": [],
            },
            bases=("accounts.account",),
        ),
        migrations.CreateModel(
            name="Manager",
            fields=[],
            options={
                "permissions": (
                    ("can_manage_landowners", "To manage land owners"),
                    ("can_manage_surveyors", "To manage surveyors"),
                    ("can_manage_agents", "To manage agents"),
                ),
                "proxy": True,
                "indexes": [],
                "constraints": [],
            },
            bases=("accounts.account",),
        ),
        migrations.CreateModel(
            name="Surveyor",
            fields=[],
            options={
                "permissions": (("can_process_surveys", "To process land surveys"),),
                "proxy": True,
                "indexes": [],
                "constraints": [],
            },
            bases=("accounts.account",),
        ),
    ]
