# Generated by Django 4.2.1 on 2023-06-13 01:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('membership', '0005_stripeproduct_price'),
    ]

    operations = [
        migrations.CreateModel(
            name='BillingHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('method', models.BooleanField()),
                ('stripesubscription_id', models.BigIntegerField()),
                ('status', models.CharField(max_length=10)),
                ('stripeproduct_id', models.BigIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='StripeSubscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('subscription_id', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('stripecustomer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='membership.stripecustomer')),
                ('stripeproduct', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='membership.stripeproduct')),
            ],
        ),
    ]
