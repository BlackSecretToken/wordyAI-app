from django.urls import path
from . import views

app_name = 'superAdmin'
urlpatterns = [
    path('', views.dashboard, name='dashboard_view'),

    path('helpcenter/insert_category', views.helpcenter_insert_category, name='helpcenter_insert_category_view'),
    path('helpcenter/insert_content', views.helpcenter_insert_content, name='helpcenter_insert_content_view'),
    path('helpcenter/get_category_data', views.helpcenter_get_category_data, name="helpcenter_get_category_data"),
    path('helpcenter/delete_category', views.helpcenter_delete_category, name="helpcenter_delete_category"),
    path('helpcenter/edit_category', views.helpcenter_edit_category, name="helpcenter_edit_category"),
    path('helpcenter/update_category', views.helpcenter_update_category, name="helpcenter_update_category"),
    path('helpcenter/delete_category_bulk', views.helpcenter_delete_category_bulk, name="helpcenter_delete_category_bulk"),
    path('helpcenter/get_content_data', views.helpcenter_get_content_data, name="helpcenter_get_content_data"),
    path('helpcenter/delete_content', views.helpcenter_delete_content, name="helpcenter_delete_content"),
    path('helpcenter/edit_content', views.helpcenter_edit_content, name="helpcenter_edit_content"),
    path('helpcenter/update_content', views.helpcenter_update_content, name="helpcenter_update_content"),
    path('helpcenter/delete_content_bulk', views.helpcenter_delete_content_bulk, name="helpcenter_delete_content_bulk"),
    path('helpcenter/change_audience', views.helpcenter_change_audience, name="helpcenter_change_audience"),

    path('billing/customer', views.billing_customer, name="billing_customer_view"),
    path('billing/subsciptions', views.billing_subscriptions, name="billing_subscriptions_view"),
    path('billing/get_customer_data', views.billing_get_customer_data, name="billing_get_customer_data"),
    path('billing/get_customer_data_by_id', views.billing_get_customer_data_by_id, name="billing_get_customer_data_by_id"),
    path('billing/get_customer_data_by_user_id', views.billing_get_customer_data_by_user_id, name="billing_get_customer_data_by_user_id"),
    path('billing/get_subscription_status_id', views.get_subscription_status_id, name="get_subscription_status_id"),
    path('billing/get_invoice_data_id', views.get_invoice_data_id, name="get_invoice_data_id"),

    path('user/user', views.get_user, name="user_user_view"),
    path('user/get_user_data', views.get_user_data, name="get_user_data_view"),
    path('user/get_user_data_by_id', views.get_user_data_by_id, name="get_user_data_by_id_view"),
    path('user/delete_user_data_by_id', views.delete_user_data_by_id, name="delete_user_data_by_id_view"),
    path('user/delete_user_bulk', views.delete_user_bulk, name="delete_user_bulk_view"),
    path('user/activate_user_data_by_id', views.activate_user_data_by_id, name="activate_user_data_by_id_view"),
    path('user/change_user_role', views.change_user_role, name="change_user_role_view"),
    path('user/create_user', views.create_user, name="create_user_view"),
]