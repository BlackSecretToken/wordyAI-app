from django.urls import path
from . import views

app_name = 'superAdmin'
urlpatterns = [
    path('', views.dashboard, name='dashboard_view'),
]