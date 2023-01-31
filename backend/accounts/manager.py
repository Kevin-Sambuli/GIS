from django.contrib.auth.models import BaseUserManager

#
# def create_superuser(self, email, username, first_name, password, **other_fields):
#     other_fields.setdefault('is_staff', True)
#     other_fields.setdefault('is_superuser', True)
#     other_fields.setdefault('is_active', True)
#     if other_fields.get('is_staff') is not True:
#         raise ValueError(_('Please assign is_staff=True for superuser'))
#     if other_fields.get('is_superuser') is not True:
#         raise ValueError(_('Please assign is_superuser=True for superuser'))
#     return self.create_user(email, username, first_name, password, **other_fields)


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(
        self, email, username, first_name, last_name, password, **other_fields
    ):
        if not email:
            raise ValueError("Please provide a valid email")
        if not username:
            raise ValueError("Please provide a username")
        if not first_name:
            raise ValueError("Provide your first Name")
        if not last_name:
            raise ValueError("Provide your last Name")

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            **other_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, email, first_name, last_name, username, password, **other_fields
    ):
        user = self.create_user(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            **other_fields
        )

        # if other_fields.get('is_staff') is not True:
        #     raise ValueError(
        #         'Superuser must be assigned to is_staff=True.')
        # if other_fields.get('is_superuser') is not True:
        #     raise ValueError(
        #         'Superuser must be assigned to is_superuser=True.')

        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
