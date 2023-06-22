from django.urls import path

from wordyAI.consumers import NumberGenerator

ws_urlpatterns = [
    path('ws/', NumberGenerator.as_asgi(), name='number-generator')
]