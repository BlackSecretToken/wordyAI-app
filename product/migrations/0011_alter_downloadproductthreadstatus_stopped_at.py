# Generated by Django 4.2.1 on 2023-06-21 13:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0010_downloadproductthreadstatus'),
    ]

    operations = [
        migrations.AlterField(
            model_name='downloadproductthreadstatus',
            name='stopped_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]
