from django.db import models
from ckeditor.fields import RichTextField
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



