from django.urls import path
from . import views

app_name = 'dashboard'
urlpatterns = [
    path('analytics', views.analytics, name='analytics_view'),
    path('test', views.test, name='test_view'),
 
]