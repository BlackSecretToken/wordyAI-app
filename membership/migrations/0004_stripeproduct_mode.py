# Generated by Django 4.2.1 on 2023-06-13 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('membership', '0003_stripeproduct'),
    ]

    operations = [
        migrations.AddField(
            model_name='stripeproduct',
            name='mode',
            field=models.CharField(default='', max_length=10),
        ),
    ]