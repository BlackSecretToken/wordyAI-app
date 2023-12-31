# Generated by Django 4.2.3 on 2023-08-08 02:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_users_company'),
        ('product', '0014_uploadproductthreadstatus'),
    ]

    operations = [
        migrations.CreateModel(
            name='OptimizeProductThreadStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('thread_id', models.PositiveBigIntegerField(null=True)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('stopped_at', models.DateTimeField(auto_now=True, null=True)),
                ('count', models.IntegerField(default=0)),
                ('is_completed', models.BooleanField(default=False)),
                ('apidata', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.apidata')),
            ],
        ),
    ]
