# Generated by Django 4.2.1 on 2023-05-29 03:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('home', '0002_users_address_users_mobile_users_phone'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attribute',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('data', models.TextField()),
                ('activate', models.BooleanField(default=True)),
                ('apiData', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attribute', to='home.apidata')),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('category_id', models.BigIntegerField()),
                ('category_name', models.CharField(max_length=100)),
                ('category_slug', models.CharField(max_length=100)),
                ('activate', models.BooleanField(default=True)),
                ('apiData', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_category', to='home.apidata')),
            ],
        ),
        migrations.CreateModel(
            name='StockStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('status', models.CharField(max_length=100)),
                ('apiData', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stockstatus', to='home.apidata')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('product_id', models.BigIntegerField()),
                ('product_title', models.CharField(max_length=100)),
                ('product_slug', models.CharField(max_length=100)),
                ('product_sku', models.BigIntegerField()),
                ('product_image', models.CharField(max_length=100)),
                ('product_description', models.TextField()),
                ('product_stock_quantity', models.IntegerField()),
                ('product_status', models.IntegerField()),
                ('product_updated_description', models.TextField()),
                ('activate', models.BooleanField(default=True)),
                ('attribute', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.attribute')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.category')),
                ('stockstatus', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.stockstatus')),
            ],
        ),
    ]
