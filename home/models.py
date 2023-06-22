from django.db import models
from wordyAI.constant import Role

# Create your models here.
class Users(models.Model):
    id = models.BigAutoField(primary_key=True, auto_created= True)
    email = models.CharField(max_length= 50)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    email_verification = models.BooleanField()
    avatar = models.ImageField(upload_to='images/')
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    gender = models.IntegerField()
    gdpr = models.BooleanField()
    opt_url = models.CharField(max_length=250)
    opt_code = models.CharField(max_length=10)
    activate = models.BooleanField()
    role = models.IntegerField(default=Role.User.value)
    is_first = models.BooleanField(default = True)
    mobile = models.CharField(max_length=50, default='')
    phone = models.CharField(max_length=50, default='')
    address = models.CharField(max_length=50, default='')
    organization = models.CharField(max_length=255, default='')
    zipcode = models.CharField(max_length=50, default = '')
    state = models.CharField(max_length=50, default = '')
    country = models.CharField(max_length=50, default ='')
    language = models.CharField(max_length=50, default = '')
    timezone = models.CharField(max_length=50, default = '')
    currency = models.CharField(max_length=50, default = '')
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class ApiData(models.Model):
    id=models.BigAutoField(primary_key=True, auto_created=True)
    datatype = models.IntegerField()
    eshopType = models.IntegerField()
    applicationName = models.CharField(max_length = 255, default= '')
    api_url = models.CharField(max_length = 255)
    consumerKey = models.CharField(max_length = 255)
    consumerToken = models.CharField(max_length = 255)
    activate = models.BooleanField(default = True)
    users = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)
    
