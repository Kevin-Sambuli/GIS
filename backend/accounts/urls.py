from django.urls import include, path
from rest_framework.routers import DefaultRouter

# from .views import ProfileListCreateView, ProfileDetailView
from .views import send_mail_to_all

urlpatterns = [
    # gets all user profiles and create a new profile
    # path("all-profiles", ProfileListCreateView.as_view(), name="all-profiles"),
    # retrieves profile details of the currently logged in user
    # path("profile/<int:pk>", ProfileDetailView.as_view(), name="profile"),
    path("celery/", send_mail_to_all, name="celery"),
]
