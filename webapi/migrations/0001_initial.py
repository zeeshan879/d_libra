# Generated by Django 3.2.5 on 2022-08-01 09:16

import ckeditor.fields
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import mptt.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('image', models.FileField(blank=True, null=True, upload_to='category_pic')),
                ('unique_identifier', models.BigIntegerField(blank=True, help_text="You don't have to do it manually, & After you save it you can also edit", null=True, unique=True)),
                ('slug', models.SlugField(blank=True, help_text='slug is an Unique value for singel categories page URL, Same as category Name', unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('CategoryType', models.CharField(default='', max_length=20)),
                ('Type', models.CharField(choices=[('popularcourses', 'popularcourses'), ('categoryA', 'categoryA'), ('categoryB', 'categoryB'), ('categoryC', 'categoryC'), ('categoryD', 'categoryD')], default='popularcourses', max_length=30)),
                ('lft', models.PositiveIntegerField(editable=False)),
                ('rght', models.PositiveIntegerField(editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(editable=False)),
            ],
            options={
                'verbose_name': 'Course_or_Chapter',
            },
        ),
        migrations.CreateModel(
            name='fileBridge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('files', models.FileField(default='', upload_to='exportfiles/')),
            ],
        ),
        migrations.CreateModel(
            name='MembershipPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=30, null=True)),
                ('description', ckeditor.fields.RichTextField()),
                ('price', models.FloatField(default=0.0)),
                ('create_date', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('is_monthly', models.BooleanField(default=False)),
                ('is_three_month', models.BooleanField(default=False)),
                ('is_annual', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name_plural': 'MemberShip Plan for User',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('uid', models.AutoField(primary_key=True, serialize=False)),
                ('fname', models.CharField(default='', max_length=255)),
                ('lname', models.CharField(default='', max_length=255)),
                ('email', models.EmailField(default='', max_length=255)),
                ('username', models.CharField(default='', max_length=255)),
                ('password', models.TextField(default='')),
                ('role', models.CharField(choices=[('normaluser', 'normaluser'), ('editor', 'editor')], default='normaluser', max_length=20)),
                ('profile', models.ImageField(default='SuperAdmin/dummy.svg', upload_to='Users/')),
                ('Otp', models.BigIntegerField(default=0)),
                ('OtpStatus', models.CharField(default='False', max_length=10)),
                ('passwordstatus', models.CharField(default='False', max_length=10)),
                ('status', models.CharField(choices=[('True', 'True'), ('False', 'False')], default='False', max_length=10)),
                ('OtpCount', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='ReviewModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('images', models.FileField(blank=True, upload_to='media/uploads', validators=[django.core.validators.FileExtensionValidator(['png', 'jpg', 'jpeg', 'svg'])])),
                ('only_to_my_page', models.BooleanField(default=False)),
                ('unique_identifier', models.BigIntegerField(blank=True, help_text="You don't have to do it manually, & After you save it you can also edit", null=True, unique=True)),
                ('meta_keywords', models.CharField(blank=True, help_text='Comma-delimited set of SEO keywords for meta tag', max_length=255, null=True, verbose_name='Meta keywords')),
                ('meta_description', models.TextField(default='')),
                ('OGP', models.TextField(default='')),
                ('content', ckeditor.fields.RichTextField()),
                ('tags', models.TextField(default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
                ('categories', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='couse_topic', to='webapi.category')),
                ('liked', models.ManyToManyField(blank=True, related_name='likes', to='webapi.User')),
            ],
        ),
        migrations.CreateModel(
            name='RecentlyviewCourse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('BookmarkStatus', models.BooleanField(default=0)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
                ('course_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.category')),
            ],
        ),
        migrations.CreateModel(
            name='RecentlyviewContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('BookmarkStatus', models.BooleanField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
                ('content_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.reviewmodel')),
            ],
        ),
        migrations.CreateModel(
            name='parentCategory',
            fields=[
                ('parentid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default='', max_length=200, null=True)),
                ('slug', models.SlugField(blank=True, help_text='slug is an Unique value for singel categories page URL, Same as category Name', unique=True)),
                ('image', models.FileField(blank=True, null=True, upload_to='category_pic')),
                ('unique_identifier', models.BigIntegerField(blank=True, help_text="You don't have to do it manually, & After you save it you can also edit", null=True, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('parent', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='webapi.parentcategory')),
            ],
            options={
                'verbose_name': 'Category',
            },
        ),
        migrations.CreateModel(
            name='feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('opinion', models.TextField(default='')),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
                ('topic', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.reviewmodel')),
            ],
        ),
        migrations.CreateModel(
            name='CourseRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(default=0)),
                ('comment', models.TextField(default='')),
                ('ratingStatus', models.CharField(choices=[('True', 'True'), ('False', 'False')], default='False', max_length=20)),
                ('commentstatus', models.CharField(choices=[('True', 'True'), ('False', 'False')], default='False', max_length=20)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
                ('course_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.category')),
            ],
        ),
        migrations.CreateModel(
            name='CoursePriority',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PriorityType', models.CharField(default='', max_length=255)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
                ('content_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.reviewmodel')),
            ],
        ),
        migrations.CreateModel(
            name='ContentRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(default=0)),
                ('comment', models.TextField(default='')),
                ('ratingStatus', models.CharField(choices=[('True', 'True'), ('False', 'False')], default='False', max_length=20)),
                ('commentstatus', models.CharField(choices=[('True', 'True'), ('False', 'False')], default='False', max_length=20)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
                ('content_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.reviewmodel')),
            ],
        ),
        migrations.AddField(
            model_name='category',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user'),
        ),
        migrations.AddField(
            model_name='category',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='webapi.category'),
        ),
        migrations.AddField(
            model_name='category',
            name='parent_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.parentcategory'),
        ),
        migrations.CreateModel(
            name='bookmarkName',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=255)),
                ('colorcode', models.CharField(default='', max_length=255)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
            ],
        ),
        migrations.CreateModel(
            name='blacklistToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.TextField(default='')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webapi.user')),
            ],
        ),
    ]
