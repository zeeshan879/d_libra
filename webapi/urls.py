from django.urls import path,include
from webapi.views import *

urlpatterns = [

#web urls  home
path('',index),
path('verification/<str:email>/<str:authtoken>',verification),
path('signup',signup.as_view()),
path('signupwithgoogle',signupwithgoogle.as_view()),
path('userlogin',userlogin.as_view()),
path('userprofile',userprofile.as_view()),
path('changepassword',changepassword.as_view()),
path('GetParentCategories',GetParentCategories.as_view()),
path('GetChildCategories',GetChildCategories.as_view()),
path('allcategories',allcategories.as_view()),


path('parentCategories',parentCategories.as_view()),
path('feedbackrecord',feedbackrecord.as_view()),




path('AddPost',AddPost.as_view()),
path('GetDashboardData',GetDashboardData.as_view()),
path('GetParentChildCategories',GetParentChildCategories.as_view()),
path('GetDashboardDataWithAuthorization',GetDashboardDataWithAuthorization.as_view()),
path('recentlyViewCourseStatus',recentlyViewCourseStatus.as_view()),
path('recentlyViewContentStatus',recentlyViewContentStatus.as_view()),
path('CourseAccorddingtoPost',CourseAccorddingtoPost.as_view()),
path('RatingContent',RatingContent.as_view()),
path('RatingCourse',RatingCourse.as_view()),
path('GetTopicContent',GetTopicContent.as_view()),
path('SearchCourse',SearchCourse.as_view()),
path('SetPriority',SetPriority.as_view()),
path('SendVerificationCode',SendVerificationCode.as_view()),
path('ChangePassword',ChangePassword.as_view()),
path('VerifyCode',VerifyCode.as_view()),
path('UpdatePassword',UpdatePassword.as_view()),
path('recentlyViewContenthistory',recentlyViewContenthistory.as_view()),
path('GetTopicData',GetTopicData.as_view()),
path('bookadd',bookadd.as_view()),
path('addcontent',addcontent.as_view()),
path('logout',logout.as_view()),






]






