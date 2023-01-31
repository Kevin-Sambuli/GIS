from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from djoser.views import UserViewSet as UserAccountViewset
from rest_framework import authentication, generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import Profile
from .permissions import IsOwnerProfileOrReadOnly
from .serializers import AccountSerializer, GroupSerializer, ProfileSerializer

Account = get_user_model()


class ListUsers(APIView):
    """
    View to list all users in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """

    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        """Return a list of all users."""
        usernames = [user.username for user in Account.objects.all()]
        users = [user for user in Account.objects.all()]
        return Response(usernames)


# class UserViewSet(UserAccountViewset):
class UserViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""

    queryset = Account.objects.all().order_by("-date_joined")
    serializer_class = AccountSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
    # permission_classes = [permissions.AllowAny]

    # Define Custom Queryset
    def get_queryset(self):
        return Account.objects.all().order_by("-date_joined")

    @action(detail=True)
    def group_names(self, request, pk=None):
        """Returns a list of all the group names that the given user belongs to."""
        user = self.get_object()
        groups = user.groups.all()
        return Response([group.name for group in groups])

    @action(detail=False)
    def recent_users(self, request):
        recent_users = Account.objects.all().order_by("-last_login")

        page = self.paginate_queryset(recent_users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(recent_users, many=True)
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    """API endpoint that allows groups to be viewed or edited."""

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    permission_classes = [permissions.AllowAny]


class ProfileViewSet(APIView):
    parser_classes = [MultiPartParser, FormParser]
    # permission_classes = [permissions.IsAuthenticated]

    # def check_permissions(self, request):
    #     """
    #     Check if the request should be permitted.
    #     Raises an appropriate exception if the request is not permitted.
    #     """
    #     for permission in self.get_permissions():
    #         if not permission.has_permission(request, self):
    #             self.permission_denied(
    #                 request,
    #                 message=getattr(permission, 'message', None),
    #                 code=getattr(permission, 'code', None)
    #             )
    #
    # def check_object_permissions(self, request, obj):
    #     """
    #     Check if the request should be permitted for a given object.
    #     Raises an appropriate exception if the request is not permitted.
    #     """
    #     for permission in self.get_permissions():
    #         if not permission.has_object_permission(request, self, obj):
    #             self.permission_denied(
    #                 request,
    #                 message=getattr(permission, 'message', None),
    #                 code=getattr(permission, 'code', None)
    #             )

    def get(self, request, *args, **kwargs):
        # Profile.objects.filter(purchaser=self.request.user)
        # user = get_object_or_404(Account, pk=kwargs['owner_id'])
        user = Account.objects.filter(username=request.user.username)
        print(user)
        # user = get_object_or_404(Profile, owner_id=request.user)
        profile_serializer = ProfileSerializer(user)
        return Response(profile_serializer.data)

    def put(self, request, format=None):
        # transformer = self.get_object(pk)
        transformer = Profile.objects.get(owner_id=21)
        serializer = ProfileSerializer(transformer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        transformer = self.get_object(2)
        serializer = ProfileSerializer(transformer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        profile = self.get_object(2)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BlacklistTokenUpdateView(APIView):
    """
    Blacklist the refresh token: extract token from the header during logout request user and refresh token is provided

    > logout,
    > resets password, u
    > ser deactivates the account,
    > user is locked out after several unsuccessful logins.

    @api_view(('POST',))
    def logout_view(request):
        Refresh = request.data["refresh"]
        token = RefreshToken(Refresh)
        token.blacklist()
        return Response("Successful Logout", status=status.HTTP_200_OK)
    """

    permission_classes = [permissions.AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh = request.data["refresh"]
            token = RefreshToken(refresh)
            token.blacklist()
            return Response("Successful Logout", status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # find all tokens by user and blacklists them, forcing them to log out.
        try:
            tokens = OutstandingToken.objects.filter(user=request.user)
            for token in tokens:
                token = RefreshToken(token.token)
                token.blacklist()
        except:
            token = RefreshToken(request.data.refresh)
            token.blacklist()
        return Response(
            status=status.HTTP_205_RESET_CONTENT
        )  # 204 means no content, 205 means no content and refresh


class CreateUser(generics.GenericAPIView):
    pass
