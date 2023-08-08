from django.urls import path
from . import views

app_name = 'user'
urlpatterns = [
    path('profile', views.profile, name='profile_view'),
    path('billing', views.billing, name='billing_view'),
    path('notification', views.notification, name='notification_view'),
    path('connections', views.connections, name='connections_view'),
    path('saveProfile', views.saveProfile, name='saveProfile'),
    path('security', views.security, name='security_view'),
    path('deactivate_account', views.deactivate_account, name='deactivate_account'),
    path('update_password', views.update_password, name='update_password'),
    path('admin/get_users', views.get_users, name='admin_get_users'),
    path('check_connection', views.check_connection, name='check_connection'),
    path('edit_shop', views.edit_shop, name='edit_shop'),
    path('update_shop', views.update_shop, name='update_shop'),
]