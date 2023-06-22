from django.contrib import admin

# Register your models here.
from .models import Users, ApiData

admin.site.register(Users)
admin.site.register(ApiData)
