from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.urlpatterns import format_suffix_patterns

schema_view = get_schema_view(
    openapi.Info(
        title="Web GIS Land Portal API",
        default_version="v1",
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="webgis@lis.ac.ke"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


urlpatterns = [
    path("", TemplateView.as_view(template_name="parcels/webMap.html"), name="web"),
    path("api/", TemplateView.as_view(template_name="parcels/webMap.html"), name="web"),
    path("admin/", admin.site.urls),
    # Authentication URLS
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    # path("auth/", include('djoser.social.urls')),
    # path("auth/", include("drf_social_oauth2.urls", namespace="drf")),

    # Applications URLS
    path("accounts/", include("accounts.urls")),
    path("parcels/", include("parcels.urls")),

    # Applications API urls
    path("accounts/api/", include("accounts.api.urls")),
    # path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    re_path(
        "api/docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        "redoc", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
]


# adding static directory files and paths
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)

admin.site.site_header = "Web bases GIS Information System."
admin.site.site_title = "Web GIS Admin Portal."
admin.site.index_title = "Welcome to Web Geographic Information System."
