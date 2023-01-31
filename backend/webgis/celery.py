from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webgis.settings")

app = Celery("webgis")
# app = Celery("docker_celery", broker=os.environ.get("CELERY_BROKER_URL"))


# app.conf.enable_utc = False
# app.conf.update(timezone="Africa/Nairobi")

app.config_from_object(settings, namespace="CELERY")

"""celery beat settings"""
# app.conf.beat_schedule={}

# app.autodiscover_tasks()
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
