# Generated by Django 4.2.3 on 2023-08-06 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('helpcenter', '0004_helpaudience_created_at_helpaudience_updated_at_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FaqContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('title', models.CharField(default='', max_length=250)),
                ('activate', models.BooleanField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
        ),
    ]
