from django.db import models

# Create your models here.
class Hotel(models.Model):
    name = models.CharField(max_length=50)
    hotel_Main_Img = models.ImageField(upload_to='images/')

class MyModel(models.Model):
    image = models.ImageField(upload_to='images/')