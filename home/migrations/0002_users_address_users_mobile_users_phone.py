# Generated by Django 4.2.1 on 2023-05-27 11:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='address',
            field=models.CharField(default='', max_length=50),
        ),
        migrations.AddField(
            model_name='users',
            name='mobile',
            field=models.CharField(default='', max_length=50),
        ),
        migrations.AddField(
            model_name='users',
            name='phone',
            field=models.CharField(default='', max_length=50),
        ),
    ]
