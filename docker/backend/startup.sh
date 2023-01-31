#!/bin/sh

if [ "$DATABASE" = "postgres" ]; then
  echo "Waiting for postgres..."

  while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
    sleep 0.1
  done

  echo "PostgreSQL started"
fi

# uncomment for production
python3 manage.py wait_for_db &&
python manage.py migrate --no-input &&
python manage.py collectstatic --no-input --clear &&
gunicorn webgis.wsgi:application --bind 0.0.0.0:8000
python manage.py flush --no-input
python manage.py collectstatic --no-input

exec "$@"
