from django.urls import path
from . import views

app_name = 'test'
urlpatterns = [
    path('image_upload', views.hotel_image_view, name='image_upload_view'),
    path('view', views.my_view, name='my_view'),
    path('upload', views.upload_image, name='upload_image'),
]