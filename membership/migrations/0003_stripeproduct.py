# Generated by Django 4.2.1 on 2023-06-13 00:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('membership', '0002_stripecustomer'),
    ]

    operations = [
        migrations.CreateModel(
            name='StripeProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('productid', models.CharField(max_length=100)),
            ],
        ),
    ]
