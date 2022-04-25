from rest_framework.views import APIView
from rest_framework.response import Response
from passlib.hash import django_pbkdf2_sha256 as handler
from webapi.models import *
from decouple import config
import jwt
import webapi.usable as uc
from django.db.models import Q
import datetime
from django.http import HttpResponse
from django.db.models import F
from rest_framework import status
from .permission import authorization
# Create your views here.


def index(request):
    return HttpResponse('<h1>Project libra</h1>')

class signup(APIView):
    def post(self,request):
        try:
            requireFields = ['email','password','username']
            ##required field validation
            validator = uc.keyValidation(True,True,request.data,requireFields)
            if validator:
                return Response(validator)

            else:
                ##Email validation
                checkemail = uc.checkemailforamt( request.data['email'])
                if not checkemail:
                    return Response({'status':False,'message':'Email format is incorrect'})


                #password length validation

                checkpassword = uc.passwordLengthValidator(request.POST['password'])
                if not checkpassword:
                    return Response({'status':False,'message':'Password must be 8 or less than 20 characters'})
                
                email = request.POST['email']
                password = request.POST['password']
                username = request.POST['username']
                

                data = User.objects.filter(Q(email = email) | Q(username = username))
                if data:
                    return Response({'status':False,'data':"Email or Username already exist"})

            

                else:
                    data = User(email=email,password=handler.hash(password),username = username)
                    data.save()
                    return Response({'status':True,'message':'Account Created Successfully'})  

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class userlogin(APIView):
    def post(self,request):
        try:
            requireFields = ['email','password']
            ##required field validation
            validator = uc.keyValidation(True,True,request.data,requireFields)
            if validator:
                    return Response(validator,status = 422)

            else:
                password = request.data['password']
                email = request.data['email']

                fetchuser = User.objects.filter(Q(username = email) | Q(email = email)).first()
                if fetchuser and handler.verify(password,fetchuser.password):
                    access_token_payload = {
                        'id': fetchuser.uid,
                        'username': fetchuser.fname,
                        'email':fetchuser.email,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                        'iat': datetime.datetime.utcnow(),

                    }
                    if fetchuser.role == "normaluser":
                        access_token = jwt.encode(access_token_payload,config('normaluserkey'), algorithm='HS256')

                        userpayload = { 'id': fetchuser.uid,'username': fetchuser.username,'email':fetchuser.email,'fname':fetchuser.fname,'lname':fetchuser.lname,'profile':fetchuser.profile.url,'role':fetchuser.role}

                        return Response({'status':True,'message':'Login SuccessFully','token':access_token,'data':userpayload},status=200)

                    if fetchuser.role == "editor":
                        access_token = jwt.encode(access_token_payload,config('editorkey'), algorithm='HS256')

                        userpayload = { 'id': fetchuser.uid,'username': fetchuser.username,'email':fetchuser.email,'fname':fetchuser.fname,'lname':fetchuser.lname,'profile':fetchuser.profile.url,'role':fetchuser.role}

                        return Response({'status':True,'message':'Login SuccessFully','token':access_token,'data':userpayload},status=200)
                    else:
                        None

                else:
                    return Response({'status':False,'message':'Invalid Credential'})


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class userprofile(APIView):
    def get(self,request):
        try:
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
            if my_token:
                data = User.objects.filter(uid = my_token['id']).first()
                if data:
                    return Response({'status':True,'data':{
                        'id':data.uid,
                        'fname':data.fname,
                        'lname':data.lname,
                        'email':data.email,
                        'username':data.username,
                        'profile':data.profile.url,
                    

                    }},status=200)

                else:
                    return Response({'status':"error",'message':'userid is incorrect'},status=404)

            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

    

    def put(self,request):
        try:
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
            if my_token:
                ##validator keys and required
                requireFields = ['fname','lname','img']
                validator = uc.requireKeys(requireFields,request.data)
                
                if not validator:
                    return Response({'status':'error','message':f'{requireFields} all keys are required'})

                else:
                    data = User.objects.filter(uid = my_token['id']).first()
                    if data:
                        data.fname = request.data['fname']
                        data.lname = request.data['lname']
                        filename = request.FILES.get('img',False)
                        if filename:
                            filenameStaus = uc.imageValidator(filename,False,False)
                            if not filenameStaus:
                                return Response({'status':False,'message':'Image format is incorrect'})

                            else:
                                data.profile = filename

                        data.save()
                        return Response({'status':True,'message':'Update Successfully'})

                    else:
                        return Response({'status':"error",'message':'userid is incorrect'})


            else:
                return Response({'status':False,'message':'Unauthorized'})


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class changepassword(APIView):
    def put(self,request):
        ##validator keys and required
        try:
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
            if my_token:
                requireFields = ['oldpassword','password']
                validator = uc.keyValidation(True,True,request.data,requireFields)
                if validator:
                    return Response(validator)
                
                
                else:
                    data = User.objects.filter(uid = my_token['id']).first()
                    if data:
                        if handler.verify(request.data['oldpassword'],data.password):
                            ##check if user again use old password
                            if not handler.verify(request.data['password'],data.password):
                                
                                #password length validation
                                checkpassword = uc.passwordLengthValidator( request.data['password'])
                                if not checkpassword:
                                    return Response({'status':False,'message':'Password must be 8 or less than 20 characters'})

                                else:
                                    data.password = handler.hash(request.data['password'])
                                    data.save()
                                    return Response({'status':True,'message':'Password Update Successfully'})

                            else:
                                return Response({'status':False,'message':'You choose old password try another one'})


                        else:
                            return Response({'status':False,'message':'Your Old Password is Wrong'})



                    else:
                        return Response({'status':"error",'message':'userid is incorrect'})
            
            else:
                return Response({'status':False,'message':'Unauthorized'})



        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class GetParentCategories(APIView):

    def get(self,request):

        try:
            data = Category.objects.filter(CategoryType="Category").values('id','image',CategoryName=F('name'))
            return Response({'status':True,'data':data},status=200)
            
       

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

    def post(self,request):

        try:

            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:

                requireFields = ['name','slug','image',"parentCategoryid"]
                validator = uc.keyValidation(True,True,request.data,requireFields[:-1])
                if validator:
                    return Response(validator)
                else:
                    name = request.data.get('name')
                    Categoryid = request.data.get('parentCategoryid')
                    slug = request.data.get('slug')
                    image = request.FILES.get('image')

                    categoryExist = Category.objects.filter(name=name)
                    if categoryExist:
                        return Response({
                            'status':False,
                            'message':'Category Name Already Exist'
                        })

                    slugExist = Category.objects.filter(slug=slug)
                    if slugExist:
                        return Response({
                            'status':False,
                            'message':'Slug Name Already Exist'
                        })
                    
                    if Categoryid == "":

                        data = Category(name=name,slug=slug,image=image,unique_identifier = uc.randomcodegenrator(),CategoryType = "Category")
                        data.save()
                        return Response({'status':True,'message':"Add Categroy Successfully"},status=201)

                    else:
                        fetchparent = Category.objects.filter(id = Categoryid).first()
                        if fetchparent:
                            data = Category(name=name,slug=slug,image=image,unique_identifier = uc.randomcodegenrator(),parent = fetchparent)
                            data.save()
                            return Response({'status':True,'message':"Add Sub Category Successfully"},status=201)

                        else:
                            return Response({'status':False,'message':'Category id is incorrect'})
            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class GetChildCategories(APIView):

    def get(self,request):

        try:

            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:
                id = request.GET['id']
                data = Category.objects.filter(parent__id=id).values('id',CategoryName=F('name'))
                return Response({'status':True,'data':data},status=200)
            
            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class AddPost(APIView):

    def get(self,request):

        try:
            
            role = request.GET['role']
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
            if my_token:
                postid = request.GET.get('postid',False)
                categoryid = request.GET['categoryid']
                data = ReviewModel.objects.filter(categories = categoryid).values('id','title','images','categories__name','OGP','meta_description','content','tags',Categroyid=F('categories__id'))

                if data:
                    nextcategory = Category.objects.all().values_list('id',flat=True)
                    nextindex = list(nextcategory).index(int(categoryid))
                    if int(categoryid) == list(nextcategory)[-1]:
                        nextindex = "null"

                    else:
                        nextindex = nextcategory[nextindex + 1]
                    

                    ##if post id exist
                    if postid:
                        for j in data:
                            if j['id'] == int(postid):
                                post = j
                                break

                            else:
                                post = "null"

                    else:
                        post = data.first()
                    
                    return Response({'status':True,'post':post,'all':data,'nextcategory':nextindex},status=200)
                
               
                else:
                    return Response({'status':True,'post':"null",'all':[]},status=200)


            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

    def post(self,request):

        try:
            
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:

                requireFields = ['title','Categroyid','tags','image','content','meta_description','OGP']
                validator = uc.keyValidation(True,True,request.data,requireFields)
                
                if validator:
                    return Response(validator,status=409)

                else:
                    title = request.data['title']
                    Categroyid = request.data['Categroyid']
                    tags = request.data['tags']
                    image = request.FILES['image']
                    content = request.data['content']
                    meta_description = request.data['meta_description']
                    OGP = request.data['OGP']

                    ##Image validation
                    filenameStaus = uc.imageValidator(image,False,False)
                    if not filenameStaus:
                        return Response({'status':False,'message':'Image format is incorrect'},status=409)


                    checkAlreadyExist = ReviewModel.objects.filter(title=title).first()
                    if checkAlreadyExist:
                        return Response({'status':False,'message':"title Already Exist"},status=409)
                    else:
                        catgory = Category.objects.filter(id = Categroyid).first()
                        if catgory:
                            data = ReviewModel(title=title,tags=tags,images=image,categories = catgory,author = User.objects.filter(uid = my_token['id']).first(),content=content,meta_description=meta_description,OGP=OGP,unique_identifier = uc.randomcodegenrator())
                            data.save()
                        

                            return Response({'status':True,'message':"Add Post Successfully"},status=201)

                        else:
                            return Response({'status':False,'message':"Wrong Course id"},status=409)





            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

    def put(self,request):

        try:
            
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:

                requireFields = ['Postid','title','Categroyid','tags','content','meta_description','OGP','image']

                validator = uc.keyValidation(True,True,request.data,requireFields[:-1])
                
                if validator:
                    return Response(validator,status=409)

                else:

                    Postid = request.data['Postid']
                    title = request.data.get('title',False)
                    tags = request.data['tags']
                    image = request.FILES.get('image',False)
                    content = request.data['content']
                    Categroyid = request.data.get('Categroyid',False)
                    meta_description = request.data['meta_description']
                    OGP = request.data['OGP']
                    

                    data = ReviewModel.objects.filter(id = Postid).first()
                    
                    if data:
                        checktitleexist = ReviewModel.objects.filter(title = title).first()
                        if not checktitleexist:
                            data.title = title
                              
                      
                        
                        data.tags = tags
                        data.content = content
                        data.meta_description = meta_description
                        data.OGP = OGP


                        if Categroyid != False:

                            checkCategoryexist = Category.objects.filter(id = Categroyid).first()
                            if checkCategoryexist:
                                data.categories =checkCategoryexist
                            
                            else:
                                return Response({'status':False,'message':'Category not found'},status=404)
                            

                        if image != False:
                            ##Image validation
                            filenameStaus = uc.imageValidator(image,False,False)
                            if not filenameStaus:
                                return Response({'status':False,'message':'Image format is incorrect'},status=409)
                            else:
                                data.images = image

                        

                        data.save()
                        return Response({'status':True,'message':"Update Post Successfully"},status=200)

                      

                           

                    else:
                        return Response({'status':False,'message':'Data not found'},status=404)


            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

    def delete(self,request):
        try:
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:
                requireFields = ['id']
                validator = uc.keyValidation(True,True,request.GET,requireFields)
                
                if validator:
                    return Response(validator,status=409)

                else:
                    data = ReviewModel.objects.filter(id = request.GET['id']).first()
                    if data:
                        data.delete()
                        return Response({'status':True,'message':'Delete successfully'},status=200)

                    else:
                        return Response({'status':False,'message':'Nothing to delete'},status=404)


            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        
        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)
            
class GetDashboardData(APIView):

    def get(self,request):

        # my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        # if my_token:  

        try:
            data = Category.objects.all().values('id',CategoryName=F('name'))

            for i in range(len(data)):

                mydata = ReviewModel.objects.filter(categories__id = data[i]['id']).values('id','title','images')
                data[i]['lecture'] = mydata
                
            return Response({'status':True,'data':data},status=200)

        
        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

        # else:
        #     return Response({'status':False,'message':'Unauthorized'},status=401)

class GetParentChildCategories(APIView):

    def get(self,request):

        try:

            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:

                data = Category.objects.filter(CategoryType = "Category").values('id','CategoryType',CategoryName=F('name'))
                if data:
                    for i in range(len(data)):

                        mydata  = Category.objects.filter(parent__id= data[i]['id']).values('id','image','unique_identifier','created_at','updated_at',CategoryName=F('name'))
                        
                        data[i]['SubCategory'] = mydata

                    return Response({'status':True,'data':data},status=200)

                else:
                    return Response({'status':True,'data':[]},status=200)



            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class GetDashboardDataWithAuthorization(APIView):

    def get(self,request):

        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        if my_token:  

            try:
                data = Category.objects.all().values('id',CategoryName=F('name'))

                for i in range(len(data)):

                    mydata = ReviewModel.objects.filter(categories__id = data[i]['id']).values('id','title','images')
                    data[i]['lecture'] = mydata
                    
                return Response({'status':True,'data':data},status=200)

            
            except Exception as e:
                message = {'status':"error",'message':str(e)}
                return Response(message,status=500)

        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

class recentlyViewCourseStatus(APIView):

    def get(self,request):

        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        if my_token:

            recentlyviewdata = RecentlyviewCourse.objects.filter(author__uid = my_token['id']).values(Courseid=F('course_id__id'),title=F('course_id__name'),images=F('course_id__image'),created = F('course_id__created_at')) 

            bookmarkContent = RecentlyviewCourse.objects.filter(author__uid = my_token['id'],BookmarkStatus = 1).values(Courseid=F('course_id__id'),title=F('course_id__name'),images=F('course_id__image'),created = F('course_id__created_at')) 

            return Response({'status':True,'RecentlyViewdCourse':recentlyviewdata,'BookmarkContent':bookmarkContent},status=200) 

        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

    def post(self,request):

        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        if my_token:

            requireFields = ['course_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)
            
            if validator:
                return Response(validator,status=409)

            else:
                course_id = request.data['course_id']
                
                checkContent = Category.objects.filter(id = course_id).first()
                if checkContent:
                   
                    if checkContent.CategoryType == "Category":
                        checkStatus = RecentlyviewCourse.objects.filter(course_id__id = course_id).first()
                        if not checkStatus:

                            data = RecentlyviewCourse(author = User.objects.filter(uid = my_token['id']).first(),course_id = checkContent)
                            data.save()
                            return Response({'status':True,'message':"View Course Successfully"},status=201)

                        else:
                            return Response({'status':True,'message':"Already Viewed"},status=409)
                    

                    else:
                        return Response({'status':False,'message':"Something went wrong"},status=409)


                else:
                    
                    return Response({'status':False,'message':"Wrong Course id"},status=409)




        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)


    def put(self,request):

        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        if my_token:

            requireFields = ['course_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)
            
            if validator:
                return Response(validator,status=409)

            else:
                course_id = request.data['course_id']
                
                checkContent = Category.objects.filter(id = course_id).first()
                if checkContent:

                    checkStatus = RecentlyviewCourse.objects.filter(BookmarkStatus = 0).first()
                    if checkStatus:

                        checkStatus.BookmarkStatus = 1
                        checkStatus.save()
                        return Response({'status':True,'message':"Course Bookmark Successfully"},status=201)

                    else:
                        return Response({'status':True,'message':"Already Viewed"},status=409)

                else:
                    
                    return Response({'status':False,'message':"Wrong Course id"},status=409)




        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

class recentlyViewContentStatus(APIView):

    def get(self,request):

        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        if my_token:

            recentlyviewdata = RecentlyviewContent.objects.filter(author__uid = my_token['id']).values(Content_id=F('content_id__id'),title=F('content_id__title'),images=F('content_id__images'),created = F('content_id__created_at')) 

            bookmarkContent = RecentlyviewContent.objects.filter(author__uid = my_token['id'],BookmarkStatus = 1).values(RecentlyviewContent=F('content_id__id'),title=F('content_id__title'),images=F('content_id__images'),created = F('content_id__created_at')) 

            return Response({'status':True,'RecentlyViewdCourse':recentlyviewdata,'BookmarkContent':bookmarkContent},status=200) 

        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

    def post(self,request):

        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        if my_token:

            requireFields = ['content_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)
            
            if validator:
                return Response(validator,status=409)

            else:
                content_id = request.data['content_id']
                
                checkContent = ReviewModel.objects.filter(id = content_id).first()
                if checkContent:

                    checkStatus = RecentlyviewContent.objects.filter(content_id__id = content_id).first()
                    if not checkStatus:

                        data = RecentlyviewContent(author = User.objects.filter(uid = my_token['id']).first(),content_id = checkContent)
                        data.save()
                        return Response({'status':True,'message':"Bookmark Successfully"},status=201)

                    else:
                        return Response({'status':True,'message':"Already Bookmark"},status=409)

                else:
                    
                    return Response({'status':False,'message':"Wrong Content id"},status=409)




        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

    def put(self,request):

        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        if my_token:

            requireFields = ['content_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)
            
            if validator:
                return Response(validator,status=409)

            else:
                content_id = request.data['content_id']
                
                checkContent = ReviewModel.objects.filter(id = content_id).first()
                if checkContent:

                    checkStatus = RecentlyviewContent.objects.filter(BookmarkStatus = 0).first()
                    if checkStatus:

                        checkStatus.BookmarkStatus = 1
                        checkStatus.save()
                        return Response({'status':True,'message':"Content Bookmark Successfully"},status=201)

                    else:
                        return Response({'status':True,'message':"Already Viewed"},status=409)

                else:
                    
                    return Response({'status':False,'message':"Wrong Content id"},status=409)




        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

class CourseAccorddingtoPost(APIView):

    def get(self,request):

        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"normaluser")
        if my_token:  

            Postid = request.GET['Postid']
            data = Category.objects.filter(id = Postid).values('id','name','image').first()

            mydata = Category.objects.filter(CategoryType = "Category",id = Postid).values('id','CategoryType',CategoryName=F('name'))

            childdata = Category.objects.filter(CategoryType = "SubCategory",parent__id = Postid).values('id','CategoryType',CategoryName=F('name'))

            if mydata:
            
                for i in range(len(mydata)):
                    parentCategories = ReviewModel.objects.filter(categories__id = mydata[i]['id'],categories__CategoryType = "Category").values('id','title','images')

                    mydata[i]['ParentCategoryCourse'] = parentCategories
                    

                for i in range(len(childdata)):


                    childcategories = ReviewModel.objects.filter(categories__id = childdata[i]['id'],categories__CategoryType = "SubCategory").values('id','title','images')

                    childdata[i]['ChildCategoryCourse'] = childcategories
                    

                return Response({'status':True,'CourseDetails':data,'ParentCategoryCourse':mydata,'ChildCategoryCourse':childdata},status=200)


           
        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

