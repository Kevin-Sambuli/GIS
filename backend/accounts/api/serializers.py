from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers

from ..models import Profile

Account = get_user_model()


class AccountSerializer(UserCreateSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = Account
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "type",
            "username",
            "password",
        ]
        read_only_field = ["id", "is_active", "date_joined", "is_staff"]
        # extra_kwargs = {'password':{'write_only':True}}


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]
