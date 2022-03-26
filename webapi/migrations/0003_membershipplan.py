# Generated by Django 4.0.3 on 2022-03-18 05:00

import ckeditor.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapi', '0002_user_delete_super_adminaccount'),
    ]

    operations = [
        migrations.CreateModel(
            name='MembershipPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=30, null=True)),
                ('description', ckeditor.fields.RichTextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=9, null=True)),
                ('create_date', models.DateTimeField(blank=True, null=True)),
                ('is_monthly', models.BooleanField(default=False)),
                ('is_three_month', models.BooleanField(default=False)),
                ('is_annual', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name_plural': 'MemberShip Plan for User',
            },
        ),
    ]
