#!/bin/bash
# entrypoint.sh file of Dockerfile

# Section 1- Bash options
set -o errexit
set -o pipefail
set -o nounset

#if [ -z "${POSTGRES_USER}" ]; then
#    base_postgres_image_default_user='postgres'
#    export POSTGRES_USER="${base_postgres_image_default_user}"
#fi
#export DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

#command: >
#      sh -c "python manage.py wait_for_db &&
#             python manage.py migrate --no-input &&
#             python manage.py check --deploy &&
#             python manage.py makemigrations &&
#             python manage.py create_admin &&
#             python manage.py collectstatic --no-input --clear &&
#             gunicorn webgis.wsgi:application --bind 0.0.0.0:8000"



# Section 2: Health of dependent services
postgres_ready() {
    python << END

import sys
from psycopg2 import connect
from psycopg2.errors import OperationalError

try:
    connect(
        dbname="${POSTGRES_DB}",
        user="${POSTGRES_USER}",
        password="${POSTGRES_PASS}",
        host="${POSTGRES_HOST}",
        port="${POSTGRES_PORT}",
    )
except OperationalError:
    sys.exit(-1)
END
}

redis_ready() {
    python << END
import sys
from redis import Redis
from redis import RedisError

try:
    redis = Redis.from_url("${CELERY_BROKER}", db=0)
    redis.ping()
except RedisError:
    sys.exit(-1)
END
}

until postgres_ready; do
  >&2 echo "Waiting for PostgreSQL to become available..."
  sleep 5
done
>&2 echo "PostgreSQL is available"

until redis_ready; do
  >&2 echo "Waiting for Redis to become available..."
  sleep 5
done
>&2 echo "Redis is available"


# Section 3- Idempotent Django commands

#python manage.py shortcut

python manage.py wait_for_db
#python manage.py check --deploy
#python manage.py flush
#python manage.py migrate --no-input
#python manage.py makemigrations
#python manage.py create_admin
#python manage.py collectstatic --noinput --clear
gunicorn webgis.wsgi:application --bind 0.0.0.0:8000 --workers 4 --threads 4

exec "$@"