import os

import environ
import psycopg2
from django.conf import settings

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(settings.BASE_DIR, ".env"))


def get_cursor():
    if settings.DEBUG:
        conn = psycopg2.connect(
            user="postgres",
            host="localhost",
            port="5432",
            dbname="webGIS",
            password="kevoh",
        )
    else:
        conn = psycopg2.connect(
            dbname=env("POSTGRES_DB"),
            host=env("POSTGRES_HOST"),
            port=env("POSTGRES_PORT"),
            password=env("POSTGRES_PASS"),
            user=env("POSTGRES_USER"),
        )
    cursor = conn.cursor()
    return cursor
