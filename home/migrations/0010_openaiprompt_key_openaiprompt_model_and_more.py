# Generated by Django 4.2.3 on 2023-08-09 22:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0009_openaiprompt'),
    ]

    operations = [
        migrations.AddField(
            model_name='openaiprompt',
            name='key',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='openaiprompt',
            name='model',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='openaiprompt',
            name='hint',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='openaiprompt',
            name='prompt',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='openaiprompt',
            name='teaser',
            field=models.TextField(default='', null=True),
        ),
    ]
