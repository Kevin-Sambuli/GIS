from django.contrib.auth import get_user_model
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Profile

Account = get_user_model()


# the signals dispatches a database action that updates the user profile with the relation
@receiver(post_save, sender=Account)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(owner=instance)


# def delete_user(sender, instance=None, **kwargs):
#     try:
#         instance.owner
#     except Account.DoesNotExist:
#         pass
#     else:
#         instance.owner.delete()
#
#
# post_delete.connect(delete_user, sender=Profile)
