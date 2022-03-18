from django.db import models
from ckeditor.fields import RichTextField
from django.utils import timezone
# Create your models here.


class User(models.Model):

    uid = models.AutoField(primary_key=True)
    fname=models.CharField(max_length=255, default="")
    lname=models.CharField(max_length=255, default="")
    email=models.EmailField(max_length=255, default="")
    username=models.CharField(max_length=255, default="")
    password=models.TextField(default="")
    profile= models.ImageField(upload_to='Users/',default="SuperAdmin/dummy.jpg")
    def __str__(self):
        return self.username


class MembershipPlan(models.Model):
    name = models.CharField(max_length=30, null=True, blank=True)
    description = RichTextField()
    price = models.FloatField(default=0.0)
    create_date = models.DateTimeField(blank=True, null=True, default=timezone.now)
    is_monthly = models.BooleanField(default=False)
    is_three_month = models.BooleanField(default=False)
    is_annual = models.BooleanField(default=False)

    def __str__(self):
        return (self.name)

    class Meta:
        verbose_name_plural = 'MemberShip Plan for User'