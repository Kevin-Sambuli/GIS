from django.contrib.auth.management import create_permissions
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404

# # Create user groups
# user_roles = ["Read only", "Maintainer"]
# for name in user_roles:
# 	Group.objects.create(name=name)
#
# # Permissions have to be created before applying them
# for app_config in apps.get_app_configs():
# 	app_config.models_module = True
# 	create_permissions(app_config, verbosity=0)
# 	app_config.models_module = None
#
# # Assign model-level permissions to maintainers
# all_perms = Permission.objects.all()
# maintainer_perms = [i for i in all_perms if i.content_type.app_label == "batteryDB"]
# Group.objects.get(name="Maintainer").permissions.add(*maintainer_perms)


def create_groups(apps, schema_migration):
    """
    This function is run in migrations/0002_initial_data.py as an initial
    data migration at project initialization. it sets up some basic model-level
    permissions for different groups when the project is initialised.

    Maintainer: Full permissions over the batteryDB app to add, change, delete, view
    data in the database, but not users.
    Read only: Not given any initial permissions. View permission is handled on a
    per instance basis by Django Guardian (more on that later!).

    getting the model object
    """
    AccountModel = apps.get_model("accounts", "Account")
    LandownerModel = apps.get_model("accounts", "Landowner")
    AgentModel = apps.get_model("accounts", "Agent")
    SurveyorModel = apps.get_model("accounts", "Surveyor")
    ManagerModel = apps.get_model("accounts", "Manager")

    """creating groups in the database"""
    land_group, created = Group.objects.get_or_create(name="landowners")
    surveyor_group, created = Group.objects.get_or_create(name="surveyors")
    agent_group, created = Group.objects.get_or_create(name="agents")
    manager_group, created = Group.objects.get_or_create(name="managers")

    # land owner perms
    create_landowner = Permission.objects.get(codename="can_create_account")
    view_landowner = Permission.objects.get(codename="can_view_account")
    process_surveys = Permission.objects.get(codename="can_process_surveys")

    agent_landowner = Permission.objects.get(codename="can_manage_landowner")

    # managers permissions
    manage_agent = Permission.objects.get(codename="can_manage_landowners")
    manage_landowners = Permission.objects.get(codename="can_manage_agents")

    land_perms = [view_landowner, create_landowner]
    surveyor_perms = [view_landowner, process_surveys]
    agent_perms = [
        view_landowner,
        create_landowner,
        agent_landowner,
    ]
    manager_perms = [
        view_landowner,
        create_landowner,
        process_surveys,
        agent_landowner,
        manage_agent,
        manage_landowners,
    ]

    land_group.permissions.set(land_perms)
    surveyor_group.permissions.set(surveyor_perms)
    agent_group.permissions.set(agent_perms)
    manager_group.permissions.set(manager_perms)


# collo2.get_all_permissions()
# collo2.get_group_permissions()
# {'accounts.can_create_account', 'accounts.can_view_account'}
# collo2.has_perm('accounts.can_create_account')
# collo = Landowner.objects.get(username='collo')
