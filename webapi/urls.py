from django.urls import path,include
from webapi.views import *

urlpatterns = [

#web urls  home
path('signup',signup.as_view()),
path('userlogin',userlogin.as_view()),
path('userprofile',userprofile.as_view()),









]






