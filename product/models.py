from django.db import models
from wordyAI.constant import *
from home.models import *

# Create your models here.
class Category(models.Model):
    id = models.BigAutoField(primary_key = True, auto_created = True)
    category_id = models.BigIntegerField()
    category_name = models.CharField(max_length = 100)
    category_slug = models.CharField(max_length = 100)
    apidata_id = models.BigIntegerField(default = 0)
    activate = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class Attribute(models.Model):
    id = models.BigAutoField(primary_key = True, auto_created = True)
    data = models.TextField()
    apidata_id = models.BigIntegerField(default = 0)
    activate = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class StockStatus(models.Model):
    id = models.BigAutoField(primary_key= True, auto_created= True)
    status = models.CharField(max_length = 100)
    apidata_id = models.BigIntegerField(default = 0)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class Product(models.Model):
    id = models.BigAutoField(primary_key=True, auto_created= True)
    product_id = models.BigIntegerField()
    product_title = models.CharField(max_length = 100)
    product_slug = models.CharField(max_length = 100)
    product_sku = models.BigIntegerField()
    product_image = models.CharField(max_length =250)
    product_description = models.TextField()
    product_stock_quantity = models.IntegerField()
    product_status = models.IntegerField()
    product_price = models.FloatField(default = 0.0)
    product_updated_description = models.TextField()
    activate = models.BooleanField(default = True)
    apidata_id = models.BigIntegerField(default = 0)
    category_id = models.BigIntegerField(default = 0)
    attribute_id = models.BigIntegerField(default = 0)
    stockstatus_id = models.BigIntegerField(default = 0)
    is_uploaded = models.BooleanField(default = False)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class ProductDownloadStatus(models.Model):
    id =  models.BigAutoField(primary_key=True, auto_created=True)
    count = models.IntegerField(default = 0)
    status = models.IntegerField(default = 0)
    apidata = models.ForeignKey(ApiData, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class DownloadProductThreadStatus(models.Model):
    id =  models.BigAutoField(primary_key=True, auto_created=True)
    thread_id = models.PositiveBigIntegerField(null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    stopped_at = models.DateTimeField(auto_now=True, null= True)
    count = models.IntegerField(default = 0)
    is_completed = models.BooleanField(default=False)
    apidata = models.ForeignKey(ApiData, on_delete=models.CASCADE)

class UploadProductThreadStatus(models.Model):
    id =  models.BigAutoField(primary_key=True, auto_created=True)
    thread_id = models.PositiveBigIntegerField(null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    stopped_at = models.DateTimeField(auto_now=True, null= True)
    count = models.IntegerField(default = 0)
    is_completed = models.BooleanField(default=False)
    apidata = models.ForeignKey(ApiData, on_delete=models.CASCADE)
    






    
