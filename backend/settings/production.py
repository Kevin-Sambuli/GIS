import os
from datetime import timedelta
from pathlib import Path

import environ
from django.contrib import staticfiles

# from dotenv import load_dotenv

# load_dotenv() # reading the env variables file
# DATA = os.environ['DATA']


ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPS_DIR = ROOT_DIR / "backend"


# SECURITY WARNING: don't run with debug turned on in production!
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# environ.Env.read_env(env_file= ".env"))
# environ.Env.read_env(os.path.join(ROOT_DIR, ".django"))


# with open(os.path.join(BASE_DIR, 'secret_key.txt')) as f:
#     SECRET_KEY = f.read().strip()

DEBUG = True
# DEBUG = env("DEBUG")
SECRET_KEY = env("SECRET_KEY")

# Local email configuration
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
EMAIL_HOST_USER = "webgis@gmail.com"
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_PORT = 587

# Local Development
PROTOCOL = "http"
DOMAIN = "localhost:3000"

#  Database configuration
DB = "DEVELOPMENT"

if not DEBUG:
    PROTOCOL = "https"
    DOMAIN = env("DOMAIN")  # "boilerplate.saasitive.com"
    SITE_NAME = env("SITE_NAME")
    SERVER_EMAIL = env("SERVER_EMAIL")
    DB = "PRODUCTION"

    # Email configuration
    EMAIL_BACKEND = env("EMAIL_BACKEND")
    EMAIL_HOST_USER = env("EMAIL_HOST_USER")
    EMAIL_HOST = env("EMAIL_HOST")
    EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
    EMAIL_USE_TLS = env("EMAIL_USE_TLS")
    EMAIL_PORT = env("EMAIL_PORT")
    DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

    # HTTPS SETTINGS
    # SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    # SESSION_COOKIE_SECURE = True
    # CSRF_COOKIE_SECURE = True
    # SECURE_SSL_REDIRECT = True

    # HSTS SETTINGS
    # SECURE_HSTS_SECONDS = 31536000 # 1 year
    # SECURE_HSTS_PRELOAD = True
    # SECURE_HSTS_INCLUDE_SUBDOMAINS = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

# ALLOWED_HOSTS = env("ALLOWED_HOSTS").split(" ")
if os.environ.get("ALLOWED_HOSTS") is not None:
    try:
        ALLOWED_HOSTS += os.environ.get("ALLOWED_HOSTS").split(" ")
    except Exception as e:
        print("Cant set ALLOWED_HOSTS, using default instead")

# Application definition
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",
]

THIRD_PARTY_APPS = [
    "djoser",
    "leaflet",
    "djgeojson",
    "corsheaders",
    # "oauth2_provider",
    # "social_django",
    # "drf_yasg",
    # "drf_social_oauth2",
    "rest_framework",
    "rest_framework_gis",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
]

PROJECT_APPS = [
    "accounts",
    "parcels",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + PROJECT_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "webgis.urls"

# user custom model setting
AUTH_USER_MODEL = "accounts.Account"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                # "social_django.context_processors.backends",
                # "social_django.context_processors.login_redirect",
            ],
        },
    },
]

WSGI_APPLICATION = "webgis.wsgi.application"

DATABASES_ALL = {
    "DEVELOPMENT": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": "webGIS",
        "USER": "postgres",
        "HOST": "localhost",
        "PASSWORD": "kevoh",
        "PORT": 5432,
    },
    "PRODUCTION": {
        "ENGINE": env("POSTGRES_ENGINE"),
        "HOST": env("POSTGRES_HOST"),
        "NAME": env("POSTGRES_DB"),
        "USER": env("POSTGRES_USER"),
        "PASSWORD": env("POSTGRES_PASS"),
        "PORT": int(env("POSTGRES_PORT")),
    },
}

DATABASES = {
    "default": DATABASES_ALL[DB],
    # 'openstreetmap': {
    #     "ENGINE": os.environ.get("POSTGRES_ENGINE", "django.contrib.gis.db.backends.postgis"),
    #     "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
    #     "NAME": os.environ.get("POSTGRES_DB", "webGIS"),
    #     "USER": os.environ.get("POSTGRES_USER", "postgres"),
    #     "PASSWORD": os.environ.get("POSTGRES_PASS", "kevoh"),
    #     "PORT": int(os.environ.get("POSTGRES_PORT", "5432")),
    # }
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")
# STATICFILES_DIRS = [os.path.join(BASE_DIR, "build/static")]

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

DJOSER = {
    "LOGIN_FIELD": "email",
    "SET_PASSWORD_RETYPE": True,
    "SET_USERNAME_RETYPE": True,
    "SEND_ACTIVATION_EMAIL": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "USER_CREATE_PASSWORD_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_RETYPE": True,
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    "ACTIVATION_URL": "activate/{uid}/{token}",
    "USERNAME_RESET_CONFIRM_URL": "email/reset/confirm/{uid}/{token}",
    "PASSWORD_RESET_CONFIRM_URL": "password/reset/confirm/{uid}/{token}",
    "SERIALIZERS": {
        "user_create": "accounts.api.serializers.AccountSerializer",
        "user": "accounts.api.serializers.AccountSerializer",
        "current_user": "accounts.serializers.UserCreateSerializer",  # NEW
        "user_delete": "djoser.serializers.UserDeleteSerializer",
    },
    "EMAIL": {
        "activation": "accounts.emails.ActivationEmail",
        "confirmation": "accounts.emails.ConfirmationEmail",
        "password_reset": "accounts.emails.PasswordResetEmail",
        "password_changed_confirmation": "accounts.emails.PasswordChangedConfirmationEmail",
        "username_changed_confirmation": "accounts.emails.UsernameChangedConfirmationEmail",
        "username_reset": "accounts.emails.UsernameResetEmail",
    },
}

AUTHENTICATION_BACKENDS = (
    # "drf_social_oauth2.backends.DjangoOAuth2",
    "django.contrib.auth.backends.ModelBackend",
)

# DJOSER = {
#     'LOGIN_FIELD': 'email',
#     'SOCIAL_AUTH_TOKEN_STRATEGY': 'djoser.social.token.jwt.TokenStrategy',
#     'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': ['http://127.0.0.1:3000', 'http://127.0.0.1:3000/home','http://127.0.0.1:3000/login'],
#     'SERIALIZERS': {},
# }
# AUTHENTICATION_BACKENDS = (
#     'social_core.backends.google.GoogleOAuth2',
#     'django.contrib.auth.backends.ModelBackend'
# )
# SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = 'your_client_id_key'
# SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'your_secret_key'
# SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
#     'https://www.googleapis.com/auth/userinfo.email',
#     'https://www.googleapis.com/auth/userinfo.profile',
#     'openid'
# ]
# SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ['first_name', 'last_name']


REST_FRAMEWORK = {
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        # "oauth2_provider.contrib.rest_framework.OAuth2Authentication",
        # "drf_social_oauth2.authentication.SocialAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    # 'TEST_REQUEST_DEFAULT_FORMAT': 'json',
}

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": (
        "Bearer",
        "JWT",
    ),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=2),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "SIGNING_KEY": SECRET_KEY,
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# leaflet configuration
LEAFLET_CONFIG = {
    "DEFAULT_CENTER": (-1.22488, 36.827164),
    "DEFAULT_ZOOM": 10,
    "MAX_ZOOM": 18,
    "MIN_ZOOM": 8,
    "SCALE": "both",
    "MINIMAP": False,
    "ATTRIBUTION_PREFIX": "Map by Kevin Sambuli Amuhaya",
    "TILES": [
        (
            "Satellite",
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                "maxZoom": 19,
                "attribution": "&copy; <a "
                'href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
        ),
        (
            "Topography",
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
                "maxZoom": 17,
                "attribution": "Map data: &copy; <a"
                'href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '
                'contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a '
                'href="https://opentopomap.org">OpenTopoMap</a> (<a '
                'href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            },
        ),
        (
            "Stamen Toner",
            "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}",
            {
                "attribution": 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, '
                '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data '
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                "subdomains": "abcd",
                "minZoom": 0,
                "maxZoom": 20,
                "ext": "png",
            },
        ),
        (
            "Terrain",
            "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
            {
                "maxZoom": 20,
                "attribution": 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
            },
        ),
    ],
}

# CELERY SETTTINGS
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = CELERY_BROKER_URL
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_RESULT_SERIALIZER = "json"
CELERY_TASK_SERIALIZER = "json"
CELERY_TIMEZONE = "Africa/Nairobi"
CELERY_TASK_TIME_LIMIT = 5 * 60
CELERY_TASK_SOFT_TIME_LIMIT = 5 * 60

# # CELERY BEAT
# CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
#
# REDIS_HOST = 'localhost'
# REDIS_PORT = 6379
# redis_host = os.environ.get('REDIS_HOST', 'localhost')

# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": "redis://127.0.0.1:6379/1", # Local Link provided by the redis-server command
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         }
#     }
# }


CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGINS = [
    # "https://example.com",
    # "https://sub.example.com",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

SWAGGER_SETTINGS = {
    "SECURITY_DEFINITIONS": {
        "Auth Token eg [JWT] (token) ": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
        }
    },
}
