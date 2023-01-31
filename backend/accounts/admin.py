from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Permission
from django.contrib.gis.admin import OSMGeoAdmin

from .forms import AccountUpdateForm, RegisterForm
from .models import Account, Agent, Landowner, Manager, Profile, Surveyor

# from guardian.shortcuts import get_objects_for_user


admin.site.register(Permission)
admin.site.register(Landowner)
admin.site.register(Agent)
admin.site.register(Surveyor)
admin.site.register(Manager)


class AccountAdmin(UserAdmin):
    ordering = ["email"]
    add_form = RegisterForm
    form = AccountUpdateForm
    model = Account

    # prepopulated_fields = {"slug": ("title",)}  # new

    def active(self, obj):
        return obj.is_active == 1

    active.boolean = True

    @classmethod
    def makeActive(cls, queryset):
        queryset.update(is_active=1)
        messages.success(cls, "Selected Record(s) Marked as Active Successfully !!")

    @classmethod
    def makeInactive(cls, queryset):
        queryset.update(is_active=0)
        messages.success(cls, "Selected Record(s) Marked as Inactive Successfully !!")

    admin.site.add_action(makeActive, "Make Active")
    admin.site.add_action(makeInactive, "Make Inactive")

    # def has_module_permission(self, request):
    #     if super(AccountAdmin, self).has_module_permission(request):
    #         return True
    #
    # def get_queryset(self, request):
    #     # if request.user.is_superuser:
    #     return super(AccountAdmin, self).get_queryset(request)
    #     # if request.user.is_active and request.user.is_staff:
    #     #     data= self.get_model_objects(request)
    #     #     return data
    #
    # def has_permission(self, request, obj, action):
    #     opts = self.opts
    #     code_name = f'{action}_{opts.model_name}'
    #     if obj:
    #         return request.user.has_perm(f'{opts.app_label}.{code_name}', obj)
    #     else:
    #         return True
    #
    # def has_view_permission(self, request, obj=None):
    #     return self.has_permission(request, obj, 'view')
    #
    # def has_delete_permission(self, request, obj=None):
    #     # the method checks if the user has delete permission on object
    #     return self.has_permission(request, obj, "delete")
    #
    # def has_change_permission(self, request, obj=None):
    #     if request.user.is_superuser:
    #         return self.has_permission(request, obj, 'edit')
    #     data = self.get_model_objects(request)
    #     return data
    #
    # def get_model_objects(self, request, action=None, klass=None):
    #     opts = self.opts
    #     actions = [action] if action else ["view", "edit", "delete"]
    #     klass = klass if klass else opts.model
    #     # model_name = klass._meta.model_name
    #     # return get_objects_for_user(
    #     #     user=request.user,
    #     #     perms=[f"{perm}_{model_name}" for perm in actions],
    #     #     klass=klass
    #     # )
    #
    # def activate_users(self, request, queryset):
    #     cnt = queryset.filter(is_active=False).update(is_active=True)
    #     self.message_user(request, "Activated {} users.".format(cnt))
    #
    # activate_users.short_description = "Activate Users"
    #
    # def get_actions(self, request):
    #     actions = super().get_actions(request)
    #     if not request.user.has_perm("auth.change_user"):
    #         del actions["activate_users"]
    #     return actions
    #
    # def get_form(self, request, obj=None, **kwargs):
    #     form = super().get_form(request, obj, **kwargs)
    #     is_superuser = request.user.is_superuser
    #     disabled_fields = set()
    #
    #     # Prevent non-superusers from editing their own permissions
    #     if not is_superuser and obj is not None and obj == request.user:
    #         disabled_fields |= {
    #             "username",
    #             "is_active",
    #             "is_staff",
    #             "is_superuser",
    #             "groups",
    #             "user_permissions",
    #         }
    #
    #     for f in disabled_fields:
    #         if f in form.base_fields:
    #             form.base_fields[f].disabled = True
    #
    #     return form

    list_display = (
        "email",
        "id",
        "username",
        # "date_joined",
        # "last_login",
        "is_active",
        "is_admin",
        "is_staff",
    )
    search_fields = ("email", "username")
    readonly_fields = (
        "date_joined",
        "last_login",
    )
    list_display_links = ("email",)
    filter_horizontal = ()
    list_per_page = 10
    list_filter = (
        "username",
        "email",
        "is_staff",
        "is_admin",
        "is_superuser",
        "is_active",
    )
    fieldsets = (
        (
            "Login Credentials",
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),
        (
            "Personal Information",
            {"fields": ("username", "first_name", "last_name", "type")},
        ),
        (
            "Permissions and Groups",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    # "groups",
                    # "user_permissions",
                )
            },
        ),
        (
            "Important Dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "username",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )


class ProfileAdmin(OSMGeoAdmin):
    model = Profile

    list_display = (
        "owner",
        "phone",
        "dob",
        "gender",
        "id_no",
    )
    search_fields = ("id_no", "phone")
    # readonly_fields = (
    #     # "location",
    #     "id_no",
    # )
    list_display_links = ("owner",)
    filter_horizontal = ()
    list_per_page = 10
    fieldsets = (
        (
            "Profile Information",
            {"fields": ("owner", "gender", "id_no", "dob", "phone", "image")},
        ),
        ("User location", {"fields": ("location",)}),
    )


# Register your models here.
admin.site.register(Account, AccountAdmin)
admin.site.register(Profile, ProfileAdmin)
