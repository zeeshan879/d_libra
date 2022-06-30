from django.db import models
from ckeditor.fields import RichTextField
from django.utils import timezone
from mptt.models import MPTTModel, TreeForeignKey
from django.core.validators import FileExtensionValidator
from taggit.managers import TaggableManager
from taggit.models import TaggedItem, TaggedItemBase
from rest_framework import serializers
import uuid
# Create your models here.

user_role =(
    ("normaluser", "normaluser"),
    ("editor", "editor"),
    
)

RatingStatus = (
    ('True','True'),
    ('False','False')
)
Priority = (
    ('highpriority','highpriority'),
    ('reviewlist','reviewlist'),
    ('futureread','futureread'),
)
Coursetype = (

    ('popularcourses','popularcourses'),
    ('categoryA','categoryA'),
    ('categoryB','categoryB'),
    ('categoryC','categoryC'),
    ('categoryD','categoryD'),


)


class User(models.Model):

    uid = models.AutoField(primary_key=True)
    fname=models.CharField(max_length=255, default="")
    lname=models.CharField(max_length=255, default="")
    email=models.EmailField(max_length=255, default="")
    username=models.CharField(max_length=255, default="")
    password=models.TextField(default="")
    role = models.CharField(choices = user_role,max_length=20,default="normaluser")
    profile= models.ImageField(upload_to='Users/',default="SuperAdmin/dummy.jpg")
    Otp = models.BigIntegerField(default=0)
    OtpStatus = models.CharField(max_length=10,default="False")
    passwordstatus = models.CharField(max_length=10,default="False")
    status = models.CharField(max_length=10,default="False",choices= RatingStatus)
    OtpCount = models.IntegerField(default=0)
    def __str__(self):
        return self.username


class blacklistToken(models.Model):
    token = models.TextField(default="")
    user = models.ForeignKey(User, on_delete =models.CASCADE)




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



class parentCategory(models.Model):
    parentid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True,db_index=True,help_text='slug is an Unique value for singel categories page URL, Same as category Name',blank=True)
    image = models.FileField(upload_to="category_pic", blank=True, null=True)
    unique_identifier = models.BigIntegerField(unique=True,null=True, blank=True,
    help_text="You don't have to do it manually, & After you save it you can also edit")
    created_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True,blank=True, null=True)


    class Meta:
        verbose_name = 'Category'

    def __str__(self):
        return self.name




class Category(MPTTModel):

    name = models.CharField(max_length=200)
    parent_category = models.ForeignKey(parentCategory, on_delete =models.CASCADE,blank=True, null=True)
    image = models.FileField(upload_to="category_pic", blank=True, null=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name= 'children', db_index=True, on_delete=models.CASCADE)
    unique_identifier = models.BigIntegerField(unique=True,null=True, blank=True,
    help_text="You don't have to do it manually, & After you save it you can also edit")
    slug = models.SlugField(unique=True,db_index=True,help_text='slug is an Unique value for singel categories page URL, Same as category Name',blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CategoryType = models.CharField(max_length=20,default="")
    Type = models.CharField(max_length=30,choices=Coursetype,default="popularcourses")

    
    class Meta:
        verbose_name = 'Course_or_Chapter'
    
    
    def __str__(self):
        return self.name

class SerSubCategories(serializers.ModelSerializer):

    
    
    class Meta:
        model = Category
        fields = ['id','name']

class ReviewModel(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    images = models.FileField(upload_to='media/uploads', blank=True ,validators=[FileExtensionValidator(['png','jpg','jpeg','svg'])])
    categories = models.ForeignKey(Category, on_delete =models.CASCADE)
    liked = models.ManyToManyField(User, blank=True, related_name='likes')
    only_to_my_page = models.BooleanField(default=False,)
    unique_identifier = models.BigIntegerField(unique=True,null=True, blank=True, help_text="You don't have to do it manually, & After you save it you can also edit")
    meta_keywords = models.CharField("Meta keywords", max_length=255, help_text='Comma-delimited set of SEO keywords for meta tag', blank=True, null=True)
    meta_description = models.TextField(default="")
    OGP = models.TextField(default="")
    content = RichTextField()
    tags =   models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def __str__(self):
        return self.title


class feedback(models.Model):
    topic =  models.ForeignKey(ReviewModel, on_delete=models.CASCADE,blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    opinion = models.TextField(default="")


class RecentlyviewCourse(models.Model):

    author = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    course_id = models.ForeignKey(Category, on_delete=models.CASCADE,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    BookmarkStatus = models.BooleanField(default=0)


class RecentlyviewContent(models.Model):

    author = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    content_id = models.ForeignKey(ReviewModel, on_delete=models.CASCADE,blank=True, null=True)
    BookmarkStatus = models.BooleanField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class CourseRating(models.Model):

    course_id = models.ForeignKey(Category, on_delete=models.CASCADE,blank=True, null=True)
    rating = models.IntegerField(default=0)
    comment = models.TextField(default="")
    ratingStatus = models.CharField(max_length=20,choices=RatingStatus,default="False")
    commentstatus = models.CharField(max_length=20,choices=RatingStatus,default="False")
    author = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)


class ContentRating(models.Model):

    content_id = models.ForeignKey(ReviewModel, on_delete=models.CASCADE,blank=True, null=True)
    rating = models.IntegerField(default=0)
    comment = models.TextField(default="")
    ratingStatus = models.CharField(max_length=20,choices=RatingStatus,default="False")
    commentstatus = models.CharField(max_length=20,choices=RatingStatus,default="False")
    author = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)



class bookmarkName(models.Model):
    name =  models.CharField(max_length=255,default="")
    colorcode = models.CharField(max_length=255,default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)


class CoursePriority(models.Model):

    author = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    content_id = models.ForeignKey(ReviewModel, on_delete=models.CASCADE,blank=True, null=True)
    PriorityType = models.CharField(max_length=255,default="")


    

