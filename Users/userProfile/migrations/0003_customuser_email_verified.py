# Generated by Django 5.0.3 on 2024-03-27 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userProfile', '0002_alter_customuser_managers'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='email_verified',
            field=models.BooleanField(default=False),
        ),
    ]
