# Generated by Django 4.0.3 on 2022-05-26 11:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapi', '0018_user_passwordstatus'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='unique_identifier',
            field=models.BigIntegerField(blank=True, help_text="You don't have to do it manually, & After you save it you can also edit", null=True, unique=True),
        ),
    ]
