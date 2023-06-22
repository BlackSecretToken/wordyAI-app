from django.urls import path
from . import views

app_name = 'membership'
urlpatterns = [
    path('checkout', views.checkout, name='checkout'),
    path('success', views.success, name='success'),
    path('cancel', views.cancel, name='cancel'),
    path('join', views.join, name='join'),
    path('billing', views.billing, name="billing_view"),
    path('create_customer', views.create_customer, name="create_customer"),
    path('create_card', views.create_card, name="create_card"),
    path('get_card_list', views.get_card_list, name="get_card_list"),
    path('set_card_primary', views.set_card_primary, name="set_card_primary"),
    path('delete_card', views.delete_card, name="delete_card"),
    path('do_free_trial', views.do_free_trial, name="do_free_trial"),
    path('get_plan_status', views.get_plan_status, name="get_plan_status"),
    path('choose_plan', views.choose_plan, name="choose_plan"),
    path('get_current_subscription', views.get_current_subscription, name="get_current_subscription"),
    path('get_invoice_data', views.get_invoice_data, name="get_invoice_data"),
    path('get_customer_data', views.get_customer_data, name="get_customer_data"),
    path('get_customer_data_by_id', views.get_customer_data_by_id, name="get_customer_data_by_id"),
    path('admin/billing/customer', views.admin_billing_customer, name="admin_billing_customer_view"),
    path('admin/billing/subsciptions', views.admin_billing_subscriptions, name="admin_billing_subscriptions_view"),
    path('get_subscription_data', views.get_subscription_data, name="get_subscription_data"),
    
]