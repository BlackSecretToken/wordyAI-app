from django.db import models
from home.models import Users

# Create your models here.
class HelpCategory(models.Model):
    id = models.BigAutoField(primary_key=True, auto_created= True)
    category = models.CharField(max_length= 250)
    reference = models.BigIntegerField(default = 0)
    activate = models.BooleanField(default = 1)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class HelpContent(models.Model):
    id = models.BigAutoField(primary_key=True, auto_created= True)
    content = models.TextField()
    contentName = models.CharField(max_length = 250, default='')
    like = models.IntegerField(default = 0)
    dislike = models.IntegerField(default = 0)
    activate = models.BooleanField(default = 1)
    helpcategory = models.ForeignKey(HelpCategory, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)

class HelpAudience(models.Model):
    id= models.BigAutoField(primary_key=True, auto_created = True)
    helpcontent = models.ForeignKey(HelpContent, on_delete = models.CASCADE)
    isLike = models.BooleanField()
    user = models.ForeignKey(Users, on_delete = models.CASCADE, default='')
    created_at = models.DateTimeField(auto_now_add = True, null= True)
    updated_at = models.DateTimeField(auto_now = True, null=True)