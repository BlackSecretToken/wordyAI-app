from django.db import models
from home.models import *
# Create your models here.
class Customer(models.Model):
    id= models.BigAutoField(primary_key=True, auto_created= True)
    user = models.OneToOneField(Users, on_delete=models.CASCADE)
    stripeid = models.CharField(max_length=255)
    stripe_subscription_id = models.CharField(max_length=255)
    cancel_at_period_end = models.BooleanField(default=False)
    membership = models.BooleanField(default=False)

class StripeCustomer(models.Model):
    id = models.BigAutoField(primary_key = True, auto_created = True)
    user = models.OneToOneField(Users, on_delete=models.CASCADE)
    customerid =  models.CharField(max_length = 255)
    activate = models.BooleanField(default = True)
    company = models.CharField(max_length = 255)
    email = models.CharField(max_length = 255)
    taxid = models.CharField(max_length = 100)
    vatnum = models.CharField(max_length = 100)
    mobile = models.CharField(max_length = 20)
    country = models.CharField(max_length = 30)
    bill_address = models.CharField(max_length = 50)
    state = models.CharField(max_length = 50)
    zipcode = models.CharField(max_length = 50)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class StripeProduct(models.Model):
    id = models.BigAutoField(primary_key = True, auto_created = True)
    name = models.CharField(max_length = 100)
    mode = models.CharField(max_length = 10, default = "")
    productid = models.CharField(max_length = 100)
    price = models.IntegerField(default = 0)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class StripeSubscription(models.Model):
    id = models.BigAutoField(primary_key = True, auto_created = True)
    subscription_id = models.CharField(max_length = 100)
    stripecustomer = models.ForeignKey(StripeCustomer, on_delete = models.CASCADE)
    stripeproduct = models.ForeignKey(StripeProduct, on_delete = models.CASCADE)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

class BillingHistory(models.Model):
    id = models.BigAutoField(primary_key = True, auto_created = True)
    stripecustomer = models.ForeignKey(StripeCustomer, on_delete = models.CASCADE, default='')
    method = models.BooleanField() # 0 -> free trials  1-> subscription
    stripesubscription_id = models.CharField(max_length = 100, null = True)
    status = models.CharField(max_length = 10, null=True) # subscription create, update, cancel
    stripeproduct_id = models.BigIntegerField(null = True)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)





    