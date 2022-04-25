from django.urls import path,include
from webapi.views import *

urlpatterns = [

#web urls  home
path('',index),
path('signup',signup.as_view()),
path('userlogin',userlogin.as_view()),
path('userprofile',userprofile.as_view()),
path('changepassword',changepassword.as_view()),
path('GetParentCategories',GetParentCategories.as_view()),
path('GetChildCategories',GetChildCategories.as_view()),
path('AddPost',AddPost.as_view()),
path('GetDashboardData',GetDashboardData.as_view()),
path('GetParentChildCategories',GetParentChildCategories.as_view()),
path('GetDashboardDataWithAuthorization',GetDashboardDataWithAuthorization.as_view()),
path('recentlyViewCourseStatus',recentlyViewCourseStatus.as_view()),
path('recentlyViewContentStatus',recentlyViewContentStatus.as_view()),
path('CourseAccorddingtoPost',CourseAccorddingtoPost.as_view()),









]






