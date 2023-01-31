from django.urls import include, path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from .views import (
    BlacklistTokenUpdateView,
    GroupViewSet,
    ListUsers,
    ProfileViewSet,
    UserViewSet,
)

router = routers.DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("groups", GroupViewSet)

# Wire up our API using automatic URL routing.
urlpatterns = [
    path("", include(router.urls)),
    path("list/", ListUsers.as_view(), name="lists"),
    # path("profile/", ProfileViewSet.as_view(), name="profile"),
    path("logout/blacklist/", BlacklistTokenUpdateView.as_view(), name="blacklist"),
]

# urlpatterns= format_suffix_patterns()
