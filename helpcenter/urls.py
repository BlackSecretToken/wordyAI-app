from django.urls import path
from . import views

app_name = 'helpcenter'
urlpatterns = [
    path('', views.index, name='index_view'),
    path('insert_category', views.insert_category, name='insert_category_view'),
    path('insert_content', views.insert_content, name='insert_content_view'),
    path('get_category_data', views.get_category_data, name="get_category_data"),
    path('delete_category', views.delete_category, name="delete_category"),
    path('edit_category', views.edit_category, name="edit_category"),
    path('update_category', views.update_category, name="update_category"),
    path('delete_category_bulk', views.delete_category_bulk, name="delete_category_bulk"),
    path('get_content_data', views.get_content_data, name="get_content_data"),
    path('delete_content', views.delete_content, name="delete_content"),
    path('edit_content', views.edit_content, name="edit_content"),
    path('update_content', views.update_content, name="update_content"),
    path('delete_content_bulk', views.delete_content_bulk, name="delete_content_bulk"),
    path('change_audience', views.change_audience, name="change_audience"),
]