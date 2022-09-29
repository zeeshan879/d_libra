from rest_framework.views import APIView
from rest_framework.response import Response
from passlib.hash import django_pbkdf2_sha256 as handler
from webapi.models import *
from decouple import config
import jwt
import webapi.usable as uc
import datetime
from django.http import HttpResponse
from django.shortcuts import redirect
from django.db.models import F,Q,Count,Avg
from rest_framework import status
from .permission import authorization
import api.emailpattern as em
from datetime import timedelta
from django.conf import settings
from itertools import chain
import subprocess
import pandas as pd
import math

# Create your views here.


def index(request):
    return HttpResponse('<h1>Project libra</h1>')

def verification(request,email,authtoken):
    try:
        data = User.objects.get(email = email,Otp  = authtoken)
        data.status = "True"
        data.Otp = 0
        data.save()
        return redirect("https://libraa.ml/login")

    except:
        return redirect("https://libraa.ml/login")

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
                    encryptPassword = handler.hash(password)
                    randomToken = uc.randomcodegenrator()
                    data = User(email=email,password=encryptPassword,username = username,Otp = randomToken)
                    if settings.DEBUG:
                        link = f"{request.META['HTTP_HOST']}/webapi/verification/{email}/{randomToken}"

                    else:
                        link = f"https://{settings.ALLOWED_HOSTS[3]}/webapi/verification/{email}/{randomToken}"
                    

                    print("link",link)
                    emailstatus = em.verificationEmail("Verification",config("fromemail"),email,link)
                    if emailstatus:
                        data.save()
                        return Response({'status':True,'message':'Account Created Successfully'})

                    else:
                        return Response({'status':False,'message':'Something went wrong'})



        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class signupwithgoogle(APIView):
    
    def post(self,request):
        try:
            requireFields = ['email','ui','displayName']
            ##required field validation
            validator = uc.keyValidation(True,True,request.data,requireFields)
            if validator:
                return Response(validator)

            else:
                email = request.data['email']
                password = request.data['ui']
                username = email.split("@")[0]
                firstname,lastname = request.data['displayName'].split(" ")
                ##check if account is not created
                data = User.objects.filter(Q(email = email) | Q(username = username)).first()
                if data:
                    
                    ### Jwt creation
                    access_token_payload = {
                        'id': data.uid,
                        'username': data.fname,
                        'email':data.email,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                        'iat': datetime.datetime.utcnow(),

                    }
                    access_token = jwt.encode(access_token_payload,config('normaluserkey'), algorithm='HS256')

                    userpayload = { 'id': data.uid,'username': data.username,'email':data.email,'fname':data.fname,'lname':data.lname,'profile':data.profile.url,'role':data.role}
                    
                    
                    return Response({'status':True,'message':'login Successfully',"data":userpayload,"token":access_token})

                    return Response({'status':False,'data':"Email or Username already exist"})
                
                
                else:
                    fetchuser = User(email=email,password=handler.hash(password),username = username,fname = firstname,lname = lastname,status = "True")
                    emailStatus = em.credentialsend("Confidentiality",config('fromemail'),email,{'username':username,'password':password})
                    if emailStatus:
                        fetchuser.save()

                        ### Jwt creation
                        access_token_payload = {
                            'id': fetchuser.uid,
                            'username': fetchuser.fname,
                            'email':fetchuser.email,
                            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                            'iat': datetime.datetime.utcnow(),

                        }
                        access_token = jwt.encode(access_token_payload,config('normaluserkey'), algorithm='HS256')

                        userpayload = { 'id': fetchuser.uid,'username': fetchuser.username,'email':fetchuser.email,'fname':fetchuser.fname,'lname':fetchuser.lname,'profile':fetchuser.profile.url,'role':fetchuser.role}
                        
                        
                        return Response({'status':True,'message':'login Successfully',"data":userpayload,"token":access_token})


                    else:
                        return Response({"status":False,"message":"Something went wrong"})

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
                if fetchuser:
                    if fetchuser.status == "True":
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
                            return Response({'status':False,'message':'Invalid Credential'})


                    else:
                        return Response({'status':False,'message':'Your Account is not verify'})


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
            role = request.GET.get("role","normaluser")
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
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

                        if filename == "True":
                            ##Image validation
                            filenameStaus = uc.imageValidator(filename,False,False)
                            if not filenameStaus:
                                return Response({'status':False,'message':'Image format is incorrect'},status=200)
                        if filename:
                            filenameStaus = uc.imageValidator(filename,False,False)
                            if not filenameStaus:
                                return Response({'status':False,'message':'Image format is incorrect'})

                            else:
                                data.profile = filename

                        data.save()
                        return Response({'status':True,'message':'Update Successfully',"data":{"fname":data.fname,"lname":data.lname,"profile":data.profile.url}})

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

class parentCategories(APIView):

    def get(self,request):
        try:
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:
                data = parentCategory.objects.values("parentid","name","unique_identifier").order_by('-created_at')
                return Response({"status":True,"data":data})

            else:
                return Response({'status':False,'message':'Unauthorized'})

        
        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)



    def post(self,request):
        try:
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:
                requireFields = ['name','slug','image','uniqueidentity']
                validator = uc.keyValidation(True,True,request.data,requireFields)
                if validator:
                    return Response(validator)

                else:
                    name = request.data.get('name').lower()
                    slug = request.data.get('slug')
                    image = request.FILES.get('image')
                    uniqueid = request.data.get('uniqueidentity')
                    ##Image validation
                    filenameStaus = uc.imageValidator(image,False,False)
                    if not filenameStaus:
                        return Response({'status':False,'message':'Image format is incorrect'})
                    
                    ##check a basic already critarea
                    categoryExist = parentCategory.objects.filter(name=name).first()
                    if categoryExist:
                        return Response({
                            'status':False,
                            'message':'Category Name Already Exist'
                        })

                    slugExist = parentCategory.objects.filter(slug=slug).first()
                    if slugExist:
                        return Response({
                            'status':False,
                            'message':'Slug Name Already Exist'
                        })


                    identifier = parentCategory.objects.filter(unique_identifier = uniqueid)
                    if identifier:
                        return Response({
                            'status':False,
                            'message':'Please choose a unique id'
                        })
                    
                    ## check parent category
                    parent = request.data.get('parent',False)
                    if not parent:
                        data = parentCategory(name=name,slug=slug,image=image,unique_identifier = uniqueid)
                    else:
                        fetechparent = parentCategory.objects.get(parentid = parent)
                        data = parentCategory(name=name,slug=slug,image=image,unique_identifier = uniqueid,parent = fetechparent)
                    
                    data.save()
                    return Response({"status":True,"message":"Add successfully"})

            else:
                return Response({'status':False,'message':'Unauthorized'})



        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class GetParentCategories(APIView):

    def get(self,request):
        try:
            mycategorylits = parentCategory.objects.filter(parent = None).values('unique_identifier','name','image','unique_identifier','created_at','updated_at')
            query = request.GET.get("search",False)
            if not query:
                mydata = Category.objects.filter(CategoryType="Category").annotate(views = Count('courseviewers__id'),totalratinng=Avg('courserating__rating'),totalperson = Count('courserating__rating')).values('id','created_at','updated_at','image','Type','views','unique_identifier','totalratinng','totalperson',CategoryName=F('name'),ParentCategoryType=F('parent_category__name'),authorname = F('author__fname'))

                
            else:
                mydata = Category.objects.filter(CategoryType="Category",name__icontains = query).annotate(views = Count('courseviewers__id'),totalratinng=Avg('courserating__rating')).values('id','created_at','updated_at','image','Type','views','unique_identifier','totalratinng',CategoryName=F('name'),ParentCategoryType=F('parent_category__name'),authorname = F('author__fname'))
            

            finalarray = list()
            for i in range(len(mycategorylits)):
                obj = {"chaptername":mycategorylits[i]['name'],"image":mycategorylits[i]['image'],"unique_identifier":mycategorylits[i]['unique_identifier'],"created_at":mycategorylits[i]['created_at'],"updated_at":mycategorylits[i]['updated_at']}
                listcategory = list()
                for j in range(len(mydata)):
                    if str( mydata[j]['unique_identifier']).startswith(str(mycategorylits[i]['unique_identifier'])):
                        listcategory.append(mydata[j])


                obj['items'] = listcategory
                finalarray.append(obj)


                  
                    

          
        
            Data = [{'status':True,'data':finalarray}]
            return Response(Data)



        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)






        # data = CourseRating.objects.all().values('rating',courseid=F('course_id__id'))
        # query = request.GET.get("search",False)
        # if not query:
        #     mydata = Category.objects.filter(CategoryType="Category").annotate(views = Count('courseviewers__id')).values('id','image','Type','views',CategoryName=F('name'),ParentCategoryType=F('parent_category__name'),authorname = F('author__fname'))

            
        # else:
        #     mydata = Category.objects.filter(CategoryType="Category",name__icontains = query).annotate(views = Count('courseviewers__id')).values('id','image','Type','views',CategoryName=F('name'),ParentCategoryType=F('parent_category__name'),authorname = F('author__fname'))


        # ##calculate total person and their rating
        # starobj = list()
        # for i in data:
        #     for j in mydata:
        #         if i['courseid'] == j['id']:
        #             starobj.append({"courseid":i['courseid'],"rating":i["rating"]})
                   


        # ##populate the data

        # for k in mydata:
        #     for l in starobj:
        #         if l["courseid"] == k["id"]:
        #             if not k.get('rating',False):
        #                 k["rating"] = l['rating']
        #                 k["totalperson"] = 1
        #                 k['totalratinng'] = k["rating"] / k["totalperson"]

        #             else:
        #                 k["rating"] = k["rating"] + l['rating']
        #                 k["totalperson"] = k["totalperson"] + 1
        #                 k['totalratinng'] = k["rating"] / k["totalperson"]



        # ##Add keys
        # for k in mydata:
        #     if not k.get('rating',False):
        #         k["totalperson"] = 0
        #         k['totalratinng'] = 0
        #     else:
        #         del k['rating']

     

        # Categorylist = []
        # mylistlist = []

        

        # mycategorylits = parentCategory.objects.values_list('name',flat=True)
        # unique_list = []
        # for i in range(len(mycategorylits)):
        #     listcategory = list()
        #     for j in range(len(mydata)):

               
        #         if mycategorylits[i] == mydata[j]['ParentCategoryType']:
                    
        #             listcategory.append(mydata[j])
            
                    

        #     data = {'chaptername':mycategorylits[i],'items':listcategory}
        #     mylistlist.append(data)
        
        # Data = [{'status':True,'data':mylistlist}]

        # return Response(Data,status=200)


    def post(self,request):

        try:

            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:

                requireFields = ['name','slug','image','uniqueidentity']
                validator = uc.keyValidation(True,True,request.data,requireFields)
                if validator:
                    return Response(validator)
                
                else:

                    name = request.data.get('name').lower()
                    courseid = request.data.get('courseid',"")
                    slug = request.data.get('slug')
                    image = request.FILES.get('image')
                    uniqueid = request.data.get('uniqueidentity')
                    categoryid = request.data.get('categoryid')
                    
                
                    ##Image validation
                    filenameStaus = uc.imageValidator(image,False,False)
                    if not filenameStaus:
                        return Response({'status':False,'message':'Image format is incorrect'},status=200)



                    slugExist = Category.objects.filter(slug=slug).first()
                    if slugExist:
                        return Response({
                            'status':False,
                            'message':'Slug Name Already Exist'
                        })

                    identifier = Category.objects.filter(unique_identifier = uniqueid)
                    if identifier:
                        return Response({
                            'status':False,
                            'message':'Please choose a unique id'
                        })


                    if courseid == "":
                        categoryExist = Category.objects.filter(name=name).first()
                        if categoryExist:
                            return Response({
                                'status':False,
                                'message':'Coursename already exist'
                            })
                        
                        else:
                            fetchParent = parentCategory.objects.filter(parentid = categoryid).first()
                            if fetchParent:
                                ##fetch author 
                                authordata = User.objects.get(uid = my_token['id']) 
                                data = Category(name=name,slug=slug,image=image,unique_identifier = uniqueid,CategoryType = "Category",parent_category = fetchParent,author = authordata)
                                data.save()
                                return Response({'status':True,'message':"Add Course Successfully"},status=201)


                            else:
                                return Response({'status':False,'message':'categoryid is incorrect'})


                    else:
                        fetchparent = Category.objects.filter(id = courseid).first()
                        if fetchparent:
                            categoryExist = Category.objects.filter(name=name,parent = fetchparent ).first()
                            if categoryExist:
                                return Response({
                                    'status':False,
                                    'message':'Chapter already exist in these course'
                                })
                            
                            else:
                                data = Category(name=name,slug=slug,image=image,unique_identifier = uniqueid,parent = fetchparent,CategoryType="SubCategory")
                                data.save()
                                return Response({'status':True,'message':"Add Chapters Successfully"},status=201)

                        else:
                            return Response({'status':False,'message':'Course id is incorrect'})
            else:
                return Response({'status':False,'message':'Unauthorized'})

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
                    return Response(validator,status=200)

                else:
                    data = Category.objects.filter(id = request.GET['id']).first()
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

class allcategories(APIView):
    permission_classes = [authorization]
    def get(self,request):
        try:
            data = Category.objects.filter(CategoryType = "Category").values('id','unique_identifier',category=F('name'))
            return Response({'status':True,'data':data},status=200)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)
         
class GetChildCategories(APIView):

    def get(self,request):

        try:

            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:
                id = request.GET['id']
                data = Category.objects.filter(parent__id=id).values('id','unique_identifier',course=F('name'))
                return Response({'status':True,'data':data},status=200)

            else:
                return Response({'status':False,'message':'Unauthorized'})

        except Exception as e:
            message = {'status':"errGetParentCategoriesor",'message':str(e)}
            return Response(message,status=500)

class AddPost(APIView):

    def get(self,request):

        # try:

        role = request.GET['role']
        # my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        # if my_token:
        postid = request.GET.get('id',False)
        categoryid = request.GET['categoryid']
        courseid = request.GET.get('courseid',False)
        data = ReviewModel.objects.filter(categories = categoryid).values('id','title','images','OGP','meta_description','content','tags',Categroyid=F('categories__id'),category = F('categories__parent__parent_category__name'),coursename = F('categories__parent__name'),courseid = F('categories__parent__id'),chapter=F('categories__name'),slug = F('categories__slug'))

        if data:
            nextcategory = Category.objects.filter(parent = courseid).values_list('id',flat=True)
            nextindex = list(nextcategory).index(int(categoryid))
            previous = "null"
            if nextindex > 0:
                previous =  nextcategory[nextindex -1]

            if int(categoryid) == list(nextcategory)[-1]:
                nextindex = "null"
                




            else:
                if nextindex > 0:
                    previous =  nextcategory[nextindex -1]
                
                
                nextindex = nextcategory[nextindex + 1]


            ##if post id exist
            post=""
            if postid:
                for j in data:
                    if j['id'] == int(postid):
                        post = j
                        break

                    else:
                        post = "null"
                        # post = data.first()
            else:
                post = data.first()

            ##check bookmarktype
            try:
                my_token = uc.tokenauth(request.META.get('HTTP_AUTHORIZATION',False)[7:],role)
                if my_token: 
                    bookmarkType = CoursePriority.objects.filter(content_id = postid,author = my_token['id']).values('PriorityType').first()
                
                else:
                    bookmarkType = "null"

            except:
                bookmarkType = "null"

            ## chapter name
            if courseid:
                chapters = Category.objects.filter(parent__id=courseid).values('id',CategoryName=F('name'))
                

            else:
                chapters = list()
                

            return Response({'status':True,'post':post,'all':data,'nextcategory':nextindex,"previous":previous,"bookmark":bookmarkType,"chapters":chapters},status=200)


        else:
            return Response({'status':True,'post':"null",'all':[],"bookmark":"null"},status=200)


            # else:
            #     return Response({'status':False,'message':'Unauthorized'},status=401)

        # except Exception as e:
        #     message = {'status':"error",'message':str(e)}
        #     return Response(message,status=500)

    def post(self,request):

        try:

            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:

                requireFields = ['title','Categroyid','tags','image','content','meta_description','OGP','uniqueidentifier']
                validator = uc.keyValidation(True,True,request.data,requireFields)

                if validator:
                    return Response(validator,status=200)

                else:
                    title = request.data['title']
                    Categroyid = request.data['Categroyid']
                    tags = request.data['tags']
                    image = request.FILES['image']
                    content = request.data['content']
                    meta_description = request.data['meta_description']
                    OGP = request.data['OGP']
                    uniqueidentifier = request.data['uniqueidentifier']

                    ##Image validation
                    filenameStaus = uc.imageValidator(image,False,False)
                    if not filenameStaus:
                        return Response({'status':False,'message':'Image format is incorrect'},status=200)


                    checkAlreadyExist = ReviewModel.objects.filter(unique_identifier = uniqueidentifier).first()
                    if checkAlreadyExist:
                        return Response({'status':False,'message':"Please provide a uniqueid"},status=200)
                    
                    catgory = Category.objects.filter(id = Categroyid).first()
                    if catgory:
                        data = ReviewModel(title=title,tags=tags,images=image,categories = catgory,author = User.objects.filter(uid = my_token['id']).first(),content=content,meta_description=meta_description,OGP=OGP,unique_identifier = uniqueidentifier)
                        data.save()


                        return Response({'status':True,'message':"Add Post Successfully"},status=201)

                    else:
                        return Response({'status':False,'message':"Wrong Chapterid"},status=200)
            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

    def put(self,request):

        try:

            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:

                requireFields = ['Postid','title','tags','content','meta_description','OGP','image']
                validator = uc.keyValidation(True,True,request.data,requireFields[:-1])

                if validator:
                    return Response(validator,status=200)

                else:

                    Postid = request.data['Postid']
                    title = request.data.get('title',False)
                    tags = request.data['tags']
                    image = request.FILES.get('image',False)
                    content = request.data['content']
                    meta_description = request.data['meta_description']
                    OGP = request.data['OGP']
                    
                    data = ReviewModel.objects.filter(id = Postid).first()

                    if data:
                        data.title = title
                        data.tags = tags
                        data.content = content
                        data.meta_description = meta_description
                        data.OGP = OGP

                       
                        if image:
                             ##Image validation
                            filenameStaus = uc.imageValidator(image,False,False)
                            if not filenameStaus:
                                return Response({'status':False,'message':'Image format is incorrect'},status=200)
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
                    return Response(validator,status=200)

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
            role = request.GET.get('role')
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
            if my_token:
                data = Category.objects.filter(CategoryType = "Category").values('id','image','created_at','updated_at','CategoryType','unique_identifier',CategoryName=F('name'))
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

        role = request.GET['role']
        # my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        # if my_token:

        # try:

        id = request.GET.get('id')

        
        if id:
            checkdata = Category.objects.filter(id=id).first()
            if checkdata:
                if checkdata.CategoryType == "Category":
                    data = Category.objects.filter(parent__id=id,CategoryType="SubCategory").values('id',CategoryName=F('name'))

                    myCategorydata = Category.objects.filter(id=id,CategoryType="Category").values('id',CategoryName=F('name'),slugimg = F('parent_category__image'))

                    if data:
                        for i in range(len(myCategorydata)):

                           
                            mydata = ReviewModel.objects.filter(categories__id = myCategorydata[i]['id']).values('id','title','images','meta_keywords','meta_description',slug = F('categories__slug'),coursename = F('categories__parent__name'),chapter=F('categories__name'))
                            myCategorydata[i]['lecture'] = mydata
                            
                            for l in myCategorydata[i]['lecture']:
                                l['category'] = str(checkdata.parent_category)

                        for j in range(len(data)):
                            
                        
                            mydata = ReviewModel.objects.filter(categories__id = data[j]['id']).values('id','title','images','meta_keywords','meta_description',slug = F('categories__slug'),coursename = F('categories__parent__name'),chapter=F('categories__name'),category = F('categories__parent__parent_category__name'),courseid = F('categories__parent__id'))
                            data[j]['lecture'] = mydata

                        
                        data = list(myCategorydata)+list(data)

                        try:
                            my_token = uc.tokenauth(request.META.get('HTTP_AUTHORIZATION',False)[7:],role)
                            if my_token: 

                                mydata = CoursePriority.objects.filter(author__uid = my_token['id']).values('PriorityType',Contentid=F('content_id__id'))

                                for i in range(len(data)):
                                    for j in range(len(data[i]['lecture'])):
                                        for k in range(len(mydata)):
                                            if data[i]['lecture'][j]['id'] == mydata[k]['Contentid']:
                                                data[i]['lecture'][j]['PriorityType'] = mydata[k]['PriorityType']

                                ##assign null key if not present in a object

                                for i in range(len(data)):
                                    for j in range(len(data[i]['lecture'])):
                                        if not  data[i]['lecture'][j].get('PriorityType',False):
                                            data[i]['lecture'][j]['PriorityType'] = "null"




                        except Exception as e:
                            for i in range(len(data)):
                                for j in range(len(data[i]['lecture'])):
                                    data[i]['lecture'][j]['PriorityType'] = "null"
                                            
                    
                    
                        ##prepare dropdown
                        dropdown = list()
                        for j in range(1,len(data)):
                            obj = {"id":data[j]['id'],"CategoryName":data[j]['CategoryName']}
                            dropdown.append(obj)
                        
                        return Response({'status':True,"slugimg":myCategorydata[0]['slugimg'],'data':data,"dropdown":{

                                "parent":{"id":data[0]['id'],"CategoryName":data[0]['CategoryName']},
                                "childs":dropdown
                            }},status=200)

                    else:
                       
                        
                        if myCategorydata:

                            for i in range(len(myCategorydata)):
                                mydata = ReviewModel.objects.filter(categories__id = myCategorydata[i]['id']).values('id','title','images','meta_keywords','meta_description',slug = F('categories__slug'),coursename = F('categories__parent__name'),chapter=F('categories__name'),category = F('categories__parent__parent_category__name'))
                                myCategorydata[i]['lecture'] = mydata

                                data = list(myCategorydata)

                                try:
                                    my_token = uc.tokenauth(request.META.get('HTTP_AUTHORIZATION',False)[7:],role)
                                    if my_token: 

                                        mydata = CoursePriority.objects.filter(author__uid = my_token['id']).values('PriorityType',Contentid=F('content_id__id'))

                                    
                                        for i in range(len(data)):
                                            
                                            for j in range(len(data[i]['lecture'])):
                                            
                                                for k in range(len(mydata)):

                                                    if data[i]['lecture'][j]['id'] == mydata[k]['Contentid']:

                                                        data[i]['lecture'][j]['PriorityType'] = mydata[k]['PriorityType']
                                                        
                                                        print()

                                                    else:
                                                        data[i]['lecture'][j]['PriorityType'] = "null"

                                except:

                                    for i in range(len(data)):
                                        
                                        for j in range(len(data[i]['lecture'])):
                                        
                                            data[i]['lecture'][j]['PriorityType'] = "null"
                    
                    
                            ##prepare dropdown
                            dropdown = list()
                            for j in range(1,len(data)):
                                obj = {"id":data[j]['id'],"CategoryName":data[j]['CategoryName']}
                                dropdown.append(obj)
                            
                            return Response({'status':True,'data':data,"slugimg":myCategorydata[0]['slugimg'],"dropdown":{

                                "parent":{"id":data[0]['id'],"CategoryName":data[0]['CategoryName']},
                                "childs":dropdown
                            }},status=200)

                else:

                    return Response({'status':True,'data':[]},status=200)


            else:

                return Response({'status':False,'message':"Invalid Course Id"},status=200)

        

        else:
            data = Category.objects.filter(CategoryType="SubCategory").values('id',CategoryName=F('name'))

            for i in range(len(data)):

                mydata = ReviewModel.objects.filter(categories__id = data[i]['id']).values('id','title','images')
                data[i]['lecture'] = mydata

            return Response({'status':True,'data':data},status=200)

        


        # except Exception as e:
        #     message = {'status':"error",'message':str(e)}
        #     return Response(message,status=500)

        # else:
        #     return Response({'status':False,'message':'Unauthorized'},status=401)

class recentlyViewCourseStatus(APIView):

   

    def get(self,request):

        role = request.GET['role']
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            data = CourseRating.objects.all().values('rating',courseid=F('course_id__id'))

            recentlyviewdata = RecentlyviewCourse.objects.filter(author__uid = my_token['id']).values(Courseid=F('course_id__id'),title=F('course_id__name'),images=F('course_id__image'),created = F('course_id__created_at'))

            ##calculate total person and their rating
            starobj = list()
            for i in data:
                for j in recentlyviewdata:
                    if i['courseid'] == j['Courseid']:
                        starobj.append({"courseid":i['courseid'],"rating":i["rating"]})
                    


            ##populate the data

            for k in recentlyviewdata:
                for l in starobj:
                    if l["courseid"] == k["Courseid"]:
                        if not k.get('rating',False):
                            k["rating"] = l['rating']
                            k["totalperson"] = 1
                            k['totalratinng'] = k["rating"] / k["totalperson"]

                        else:
                            k["rating"] = k["rating"] + l['rating']
                            k["totalperson"] = k["totalperson"] + 1
                            k['totalratinng'] = k["rating"] / k["totalperson"]



            ##Add keys
            for k in recentlyviewdata:
                if not k.get('rating',False):
                    k["totalperson"] = 0
                    k['totalratinng'] = 0
                else:
                    del k['rating']


            bookmarkContent = RecentlyviewCourse.objects.filter(author__uid = my_token['id'],BookmarkStatus = 1).values(Courseid=F('course_id__id'),title=F('course_id__name'),images=F('course_id__image'),created = F('course_id__created_at'))

            ##calculate total person and their rating
            starobj = list()
            for i in data:
                for j in bookmarkContent:
                    if i['courseid'] == j['Courseid']:
                        starobj.append({"courseid":i['courseid'],"rating":i["rating"]})
                    


            ##populate the data

            for k in bookmarkContent:
                for l in starobj:
                    if l["courseid"] == k["Courseid"]:
                        if not k.get('rating',False):
                            k["rating"] = l['rating']
                            k["totalperson"] = 1
                            k['totalratinng'] = k["rating"] / k["totalperson"]

                        else:
                            k["rating"] = k["rating"] + l['rating']
                            k["totalperson"] = k["totalperson"] + 1
                            k['totalratinng'] = k["rating"] / k["totalperson"]



            ##Add keys
            for k in bookmarkContent:
                if not k.get('rating',False):
                    k["totalperson"] = 0
                    k['totalratinng'] = 0
                else:
                    del k['rating']


            data = [{'chapterName':"Recently Viewed Courses",'items':recentlyviewdata},{'chapterName': "Courses with Bookmark Contents",'items':bookmarkContent}]

            return Response(data,status=200)


        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

    def post(self,request):

        role = request.data.get('role')
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            requireFields = ['course_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)

            if validator:
                return Response(validator,status=200)

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
                            return Response({'status':True,'message':"Already Viewed"},status=200)


                    else:
                        return Response({'status':False,'message':"Something went wrong"},status=200)


                else:

                    return Response({'status':False,'message':"Wrong Course id"},status=200)




        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

    def put(self,request):

        role = request.data.get('role')
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            requireFields = ['course_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)

            if validator:
                return Response(validator,status=200)

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
                        return Response({'status':True,'message':"Already Viewed"},status=200)

                else:

                    return Response({'status':False,'message':"Wrong Course id"},status=200)




        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

class recentlyViewContentStatus(APIView):

    def get(self,request):

        role = request.GET['role']
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            recentlyviewdata = RecentlyviewContent.objects.filter(author__uid = my_token['id']).values(Content_id=F('content_id__id'),title=F('content_id__title'),images=F('content_id__images'),created = F('content_id__created_at'))

            bookmarkContent = RecentlyviewContent.objects.filter(author__uid = my_token['id'],BookmarkStatus = 1).values(RecentlyviewContent=F('content_id__id'),title=F('content_id__title'),images=F('content_id__images'),created = F('content_id__created_at'))

            data = [{'chapterName':"Recently Viewed Content",'items':recentlyviewdata},{'chapterName': "Courses with Bookmark Contents",'items':bookmarkContent}]

            return Response(data,status=200)



        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

    def post(self,request):

        role = request.data.get('role')
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            requireFields = ['content_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)

            if validator:
                return Response(validator,status=200)

            else:
                content_id = request.data['content_id']

                checkContent = ReviewModel.objects.filter(id = content_id).first()
                if checkContent:
                    checkStatus = RecentlyviewContent.objects.filter(content_id__id = content_id,author = my_token['id']).first()
                    if not checkStatus:

                        data = RecentlyviewContent(author = User.objects.filter(uid = my_token['id']).first(),content_id = checkContent)
                        data.save()
                        return Response({'status':True,'message':"Bookmark Successfully"},status=201)

                    else:
                        checkStatus.created_at = datetime.datetime.now().date()
                        checkStatus.save()
                        return Response({'status':True,'message':"update Bookmark"},status=200)

                else:

                    return Response({'status':False,'message':"Wrong Content id"},status=200)




        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

    def put(self,request):
        role = request.data.get('role')
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            requireFields = ['content_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)

            if validator:
                return Response(validator,status=200)

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
                        return Response({'status':True,'message':"Already Viewed"},status=200)

                else:

                    return Response({'status':False,'message':"Wrong Content id"},status=200)




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

class RatingContent(APIView):

    def put(self,request):

        role = request.data.get('role')
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            requireFields = ['content_id']
            validator = uc.keyValidation(True,True,request.data,requireFields)

            if validator:
                return Response(validator,status=200)

            else:

                content_id = request.data.get('content_id')
                rating = request.data.get('rating')
                comment = request.data.get('comment')

                if rating == "":

                    rating = 0

                checkContent = ReviewModel.objects.filter(id = content_id).first()
                if not checkContent:
                    return Response({'status':False,'message':'Content id is incorrect'})

                authorobj = User.objects.filter(uid = my_token['id']).first()

                checkAlready = ContentRating.objects.filter(content_id = content_id).first()
                if checkAlready:

                    checkAlready.rating = rating
                    checkAlready.save()

                    

                    return Response({'status':False,'message':'Rating Content Sucessfully',"data":{'content_id':content_id,'rating':rating}})

                if comment:

                    data = ContentRating(content_id = checkContent,rating=rating,comment=comment,ratingStatus="True",commentstatus="True",author=authorobj)
                    data.save()

                    return Response({'status':False,'message':'Rating Content Sucessfully',"data":{'content_id':content_id,'rating':rating}})

                else:

                    data = ContentRating(content_id = checkContent,rating=rating,comment=comment,ratingStatus="True",author=authorobj)
                    data.save()
                    return Response({'status':False,'message':'Rating Content Sucessfully',"data":{'content_id':content_id,'rating':rating}})
        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

class RatingCourse(APIView):

    def put(self,request):

        try:
            role = request.data.get('role')
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
            if my_token:

                requireFields = ['course_id','rating','comment','role']
                validator = uc.keyValidation(True,True,request.data,requireFields)

                if validator:
                    return Response(validator,status=200)

                else:

                    course_id = request.data.get('course_id')
                    rating = request.data.get('rating')
                    comment = request.data.get('comment')

            

                    checkCourse = Category.objects.filter(id = course_id).first()
                    if not checkCourse:
                        return Response({'status':False,'message':'Course id is incorrect'})

                    authorobj = User.objects.filter(uid = my_token['id']).first()

                    checkAlready = CourseRating.objects.filter(course_id = course_id,author = my_token['id'] ).first()
                    if not checkAlready:

                        data = CourseRating(course_id = checkCourse,rating=rating,comment=comment,ratingStatus="True",author=authorobj)
                        data.save()
                        return Response({'status':True,'message':'Rating Course Sucessfully',"data":{'course_id':course_id,'rating':rating}})



                    else:
                        return Response({"status":False,"message":"already rated","data":{'course_id':course_id,'rating':checkAlready.rating}})



            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        

        
        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class GetTopicContent(APIView):

    def get(self,request):

        role = request.GET['role']
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:
                course_id = request.GET['course_id']

                checkCourse = Category.objects.filter(id = course_id).first()
                if not checkCourse:
                    return Response({'status':False,'message':'Course id is incorrect'})

                mydata = ReviewModel.objects.filter(categories__id = course_id).values('id','title')
                data = ReviewModel.objects.filter(categories__parent = course_id).values('id','title')
                combined_results = list(chain(mydata, data))
                return Response({'status':True,'data':combined_results},status=200)


        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

class SearchCourse(APIView):

    def get(self,request):
        try:
            role = request.GET.get('role',"superadmin")
            coursename = request.GET['coursename']
            data = ReviewModel.objects.filter(Q(title__icontains = coursename) | Q(tags__icontains = coursename)).values('id','title','images','meta_keywords','meta_description',chapterid=F('categories__id'),chapter = F('categories__name'),coursename = F('categories__parent__name'),slug = F('categories__slug'),courseid = F('categories__parent__id'),category=F('categories__parent__parent_category__name'))
            data = [{"items":data}]


            ###priority

            try:

                my_token = uc.tokenauth(request.META.get('HTTP_AUTHORIZATION',False)[7:],role)
                if my_token: 

                    mydata = CoursePriority.objects.filter(author__uid = my_token['id']).values('PriorityType',Contentid=F('content_id__id'))

                            
                    for i in range(len(data)):
                        
                        for j in range(len(data[i]['items'])):
                        
                            for k in range(len(mydata)):
                                
                                if data[i]['items'][j]['id'] == mydata[k]['Contentid']:

                                    data[i]['items'][j]['PriorityType'] = mydata[k]['PriorityType']
                                    break
                                    

                                else:
                                    data[i]['items'][j]['PriorityType'] = "null"


                
            except:
                for i in range(len(data)):
                    for j in range(len(data[i]['items'])):
                        data[i]['items'][j]['PriorityType'] = "null"
            
            
            return Response({'status':True,'data':data},status=200)





        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class SetPriority(APIView):

    def get(self,request):

        role = request.GET['role']
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            prioritylist = ['highpriority','reviewlist','futureread']

            bookmarkdata = bookmarkName.objects.filter(user__uid = my_token['id']).values('name')
            if not bookmarkdata:
                


                mylistlist = []
                for i in range(len(prioritylist)):

                    getdata = CoursePriority.objects.filter(author = my_token['id'],PriorityType=prioritylist[i]).values(Chapterid=F('content_id__categories__id'),Contentid=F('content_id__id'),Contenttitle=F('content_id__title'),Contentimage=F('content_id__images'),chapter=F('content_id__categories__name'),coursename = F('content_id__categories__parent__name'),slug = F('content_id__categories__slug'),courseid = F('content_id__categories__parent__id'),metakeywords = F('content_id__meta_keywords'),meta_description = F('content_id__meta_description'))

                    data = [{'PriorityType':prioritylist[i],'items':getdata}]
                    mylistlist.append(data)


                    

                return Response({'status':True,'data':mylistlist},status=200)

            else:
                if len(bookmarkdata) > 1:

                    for j in range(len(bookmarkdata)):

                        prioritylist.append(bookmarkdata[j]['name'])

                else:

                    prioritylist.append(bookmarkdata[0]['name'])

                
                mylistlist = []

                for i in range(len(prioritylist)):

                    getdata = CoursePriority.objects.filter(author = my_token['id'],PriorityType=prioritylist[i]).values('id',Chapterid=F('content_id__categories__id'),Contentid=F('content_id__id'),Contenttitle=F('content_id__title'),Contentimage=F('content_id__images'),chapter=F('content_id__categories__name'),coursename = F('content_id__categories__parent__name'),slug = F('content_id__categories__slug'),courseid = F('content_id__categories__parent__id'),category = F('content_id__categories__parent__parent_category__name'),metakeywords = F('content_id__meta_keywords'),meta_description = F('content_id__meta_description'))

                    data = [{'PriorityType':prioritylist[i],'items':getdata}]
                    mylistlist.append(data)
                    

                return Response({'status':True,'data':mylistlist},status=200)

        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

    def post(self,request):

        role = request.data.get('role')
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            course_id = request.data.get('content_id')
            PriorityType = request.data.get('PriorityType')

            prioritylist = ['highpriority','reviewlist','futureread']

            if PriorityType not in prioritylist:

                return Response({'status':False,'message':'Incorrect Priority type'})

            checkCourse = ReviewModel.objects.filter(id = course_id).first()
            if not checkCourse:
                return Response({'status':False,'message':'Content id is incorrect'})

            checkPriority = CoursePriority.objects.filter(content_id__id = course_id,PriorityType=PriorityType,author = my_token['id']).first()
            if checkPriority:

                return Response({'status':False,'message':'You have already set this priority'})

            data = CoursePriority(PriorityType=PriorityType,content_id = checkCourse,author = User.objects.filter(uid = my_token['id']).first())
            data.save()

            return Response({'status':True,'message':'Set Priority Successfully'},status=201)



        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

class SendVerificationCode(APIView):

    def post(self,request):

        requireFields = ['Email']
        validator = uc.keyValidation(True,True,request.data,requireFields)

        if validator:
            return Response(validator,status=200)

        else:

            Email = request.data.get('Email')

            checkEmailExist = User.objects.filter(email=Email).first()
            if checkEmailExist:
                token = uc.emailrandomcodegenrator()
                checkSendEmail = em.forgetPassword('Verification',config('fromemail'),Email,token)
                checkEmailExist.Otp = token
                checkEmailExist.OtpStatus = "True"
                checkEmailExist.OtpCount = 0
                checkEmailExist.save()


                return Response({
                    'status':True,
                    'message':"Please Check Your Email",
                    'Email':Email
                },200)
            else:
                return Response({
                    'status':False,
                    'message':"Email Doesnot Exist"
                },200)

class VerifyCode(APIView):

    def post(self,request):

        requireFields = ['Email','Code']
        validator = uc.keyValidation(True,True,request.data,requireFields)

        if validator:
            return Response(validator,status=200)

        else:

            Email = request.data.get('Email')
            Code = int(request.data.get('Code'))

            userObj = User.objects.filter(email=Email).first()

            if userObj:

                if userObj.OtpStatus == "True":

                    if userObj.OtpCount < 3:

                        if userObj.Otp == Code:

                            userObj.OtpCount = 0
                            userObj.OtpStatus = "False"
                            userObj.passwordstatus = "False"
                            userObj.save()
                            return Response({'status':True})

                        else:

                            userObj.OtpCount = userObj.OtpCount + 1
                            userObj.save()
                            return Response({'status':False,'message':"Invalid Code"},200)



                    else:
                        return Response({'status':False,'message':"Code is expire"},200)

                else:
                    return Response({'status':False,'message':"Code is expire"},200)

            else:
                return Response({'status':False,'message':"Account Doesnot Exist"},200)

class ChangePassword(APIView):

    def post(self,request):

        requireFields = ['Email','Password']
        validator = uc.keyValidation(True,True,request.data,requireFields)

        if validator:
            return Response(validator,status=200)

        else:

            Email = request.data.get('Email')
            Password = request.data.get('Password')

            if Email:

                checkpassword = uc.passwordLengthValidator(request.POST['Password'])
                if not checkpassword:
                    return Response({'status':False,'message':'Password must be 8 or less than 20 characters'})

                data = User.objects.filter(email=Email).first()
                if data:

                    if data.passwordstatus == "False":

                        data.password = handler.hash(Password)
                        data.passwordstatus = "True"
                        data.save()

                        return Response({
                            'status':True,
                            'message':'Change Password Sussessfully'
                        },200)

                    else:
                        return Response({
                            'status':False,
                            'message':"You have not rights to change Password Please follow the steps"
                        },200)

                else:
                    return Response({
                        'status':False,
                        'message':"Email Doesnot Exist"
                    },200)

            else:
                return Response({
                    'status':False,
                    'message':"You have not rights to change Password Please follow the steps"
                },403)

class UpdatePassword(APIView):

    def put(self,request):

        role = request.GET['role']
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            requireFields = ['Password','oldpassword']
            validator = uc.keyValidation(True,True,request.data,requireFields)

            if validator:
                return response(validator,status=200)

            else:
                Password = request.data.get('Password')
                oldpassword = request.data.get('oldpassword')

                data = User.objects.filter(uid = my_token['id']).first()

                if handler.verify(request.data['oldpassword'],data.password):
                ##check if user again use old password
                    if not handler.verify(request.data['Password'],data.password):

                        checkpassword = uc.passwordLengthValidator(request.POST['Password'])
                        if not checkpassword:
                            return Response({'status':False,'message':'Password must be 8 or less than 20 characters'})

                        
                        data.password = handler.hash(Password)
                        data.save()

                        return Response({'status':True,'message':'Change Password Successfully'},status=200)

                    else:
                        return Response({'status':False,'message':'You choose old password try another one'})

                else:
                    return Response({'status':False,'message':'You old password is incorrect'})


        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)
            
class recentlyViewContenthistory(APIView):

    def get(self,request):

        role = request.GET['role']
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
        if my_token:

            yesterday = datetime.datetime.now().date() - timedelta(days=1)
            today = datetime.datetime.now().date()

            today_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
            today_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)
            
            weekly = datetime.datetime.now().date() - timedelta(days=7)
            monthly = datetime.datetime.now().date() - timedelta(days=30)
     

            todaydata = RecentlyviewContent.objects.filter(created_at__range=(today_min, today_max),author__uid = my_token['id']).values(chapterid=F('content_id__categories'),Content_id=F('content_id__id'),title=F('content_id__title'),images=F('content_id__images'),created = F('content_id__created_at'),chapter = F('content_id__categories__name'),coursename = F('content_id__categories__parent__name'),slug = F('content_id__categories__slug'),courseid = F('content_id__categories__parent__id'),category = F('content_id__categories__parent__parent_category__name'))


            for i in range(len(todaydata)):

                mydata = CoursePriority.objects.filter(author__uid = my_token['id'],content_id__id=todaydata[i]['Content_id']).values('PriorityType',Contentid=F('content_id__id')).first()
                if mydata:

                    todaydata[i]['PriorityType'] = mydata['PriorityType']
                else:
                    todaydata[i]['PriorityType'] = "null"



            yesterddaydata = RecentlyviewContent.objects.filter(created_at__range=(yesterday, today),author__uid = my_token['id']).values(chapterid=F('content_id__categories'),Content_id=F('content_id__id'),title=F('content_id__title'),images=F('content_id__images'),created = F('content_id__created_at'),chapter = F('content_id__categories__name'),coursename = F('content_id__categories__parent__name'),slug = F('content_id__categories__slug'),courseid = F('content_id__categories__parent__id'),category = F('content_id__categories__parent__parent_category__name'))

            for i in range(len(yesterddaydata)):

                mydata = CoursePriority.objects.filter(author__uid = my_token['id'],content_id__id=yesterddaydata[i]['Content_id']).values('PriorityType',Contentid=F('content_id__id')).first()
                if mydata:

                    yesterddaydata[i]['PriorityType'] = mydata['PriorityType']
                else:
                    yesterddaydata[i]['PriorityType'] = "null"

           
            weeklydata = RecentlyviewContent.objects.filter(created_at__range=[weekly,today],author__uid = my_token['id']).values(chapterid=F('content_id__categories'),Content_id=F('content_id__id'),title=F('content_id__title'),images=F('content_id__images'),created = F('content_id__created_at'),chapter = F('content_id__categories__name'),coursename = F('content_id__categories__parent__name'),slug = F('content_id__categories__slug'),courseid = F('content_id__categories__parent__id'),category = F('content_id__categories__parent__parent_category__name'))
            for i in range(len(weeklydata)):

                mydata = CoursePriority.objects.filter(author__uid = my_token['id'],content_id__id=weeklydata[i]['Content_id']).values('PriorityType',Contentid=F('content_id__id')).first()
                if mydata:

                    weeklydata[i]['PriorityType'] = mydata['PriorityType']
                else:
                    weeklydata[i]['PriorityType'] = "null"

            monthlydata = RecentlyviewContent.objects.filter(created_at__range=[monthly,today],author__uid = my_token['id']).values(chapterid=F('content_id__categories'),Content_id=F('content_id__id'),title=F('content_id__title'),images=F('content_id__images'),created = F('content_id__created_at'),chapter = F('content_id__categories__name'),coursename = F('content_id__categories__parent__name'),slug = F('content_id__categories__slug'),courseid = F('content_id__categories__parent__id'),category = F('content_id__categories__parent__parent_category__name'))

            for i in range(len(monthlydata)):

                mydata = CoursePriority.objects.filter(author__uid = my_token['id'],content_id__id=monthlydata[i]['Content_id']).values('PriorityType',Contentid=F('content_id__id')).first()
                if mydata:

                    monthlydata[i]['PriorityType'] = mydata['PriorityType']
                else:
                    monthlydata[i]['PriorityType'] = "null"

           

            data = [{'chapterName':"Today",'items':todaydata},{'chapterName': "Yesterday",'items':yesterddaydata},{'chapterName': "This Week",'items':weeklydata},{'chapterName': "This Month",'items':monthlydata}]

            return Response(data,status=200)



        else:
            return Response({'status':False,'message':'Unauthorized'},status=401)

class logout(APIView):
    def post(self,request):
        try:
            role = request.GET.get('role',"superadmin")
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
            if my_token:
                fetchuser = User.objects.get(uid = my_token['id'])
                blacklistToken(user = fetchuser,token = request.META['HTTP_AUTHORIZATION'][7:]).save()
                return Response({"status":True,"message":"logout successfully"})

            
            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class GetTopicData(APIView):

    def get(self,request):

        try:

            role = request.GET['role']
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
            if my_token:

                Postid = request.GET['Postid']
                data = Category.objects.filter(id = Postid).values('id','name','image').first()
            

                if data:
                    mydata = ReviewModel.objects.filter(categories__id = data['id']).values('id','title','images','meta_keywords','meta_description')

                    return Response({'status':True,"data":mydata},status=200)

                else:
                    return Response({'status':False,'message':'Invalid id'},status=401)

            else:
                return Response({'status':False,'message':'Unauthorized'},status=401)

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class bookadd(APIView):
    permission_classes = [authorization]

    def get(self,request):
        try:
            fetchalready = bookmarkName.objects.filter(user = request.GET['token']['id']).values("id","name","colorcode")
            return Response({"status":True,"data":fetchalready})

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)
    
    def post(self,request):
        try:
            obj = request.data
            if len(obj) > 0:
                
                ##remove duplicates
                statusDuplicate = uc.removeDuplicates(obj)
                if not statusDuplicate:
                    return Response({"status":False,"message":"Please enter a valid data"})
                
                bulklist = list()
                fetchuser = User.objects.filter(uid = request.GET['token']['id']).first()

                ##check if already exist
                fetchalready = bookmarkName.objects.filter(user = request.GET['token']['id'])
                if fetchalready:
                    for i in fetchalready:
                        for index,k in enumerate(statusDuplicate):
                            if k['bookmarkname'] == i.name:
                                # print(i.name,index,k['bookmarkname'])
                                statusDuplicate.pop(index)

                # print("final",statusDuplicate)
                if len(statusDuplicate) > 0:
                    for j in statusDuplicate:
                        bulklist.append(
                            bookmarkName(name = j['bookmarkname'],colorcode = j['colorcode'],user = fetchuser)
                        )

                    bookmarkName.objects.bulk_create(bulklist)
                    return Response({"status":True,"message":"Add successfully"})

                else:
                    return Response({"status":True,"message":"All bookmarks already exist"})


            
            else:
                return Response({"status":False,"message":"Please enter a valid data"})





        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)



    def put(self,request):
        try:
            requireFields = ['id','name']
            validator = uc.keyValidation(True,True,request.data,requireFields)
            if validator:
                return Response(validator,status=200)
            
            else:
                data = bookmarkName.objects.filter(id = request.data['id'],user = request.GET['token']['id']).first()
                if data:
                    #check if already exists name
                    checkdata = bookmarkName.objects.filter(name = request.data['name'],user = request.GET['token']['id']).first()
                    if not checkdata:
                        data.name = request.data['name']
                        data.save()
                    return Response({"status":True,"message":"Update successfully"})
                else:
                    return Response({"status":False,"message":"Incorrect id"})


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

    def delete(self,request):
        try:
            requireFields = ['bookmarkid']
            validator = uc.keyValidation(True,True,request.GET,requireFields)
            if validator:
                return Response(validator,status=200)
            else:
                bookmarkid = request.GET['bookmarkid']
                fetchname = bookmarkName.objects.get(id = bookmarkid)
                CoursePriority.objects.filter(author = request.GET['token']['id'],PriorityType = fetchname.name ).delete()
                fetchname.delete()
                return Response({"status":True,"message":"Delete successfully"})

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)



class addcontent(APIView):
    permission_classes = [authorization]

    def post(self,request):
        try:
            requireFields = ['contentid']
            validator = uc.keyValidation(True,True,request.data,requireFields)

            if validator:
                return Response(validator)

            else:
                prioritylist = ['highpriority','reviewlist','futureread']
                
                ##check if user firsttime add
                
                fetchcontent = ReviewModel.objects.filter(id = request.data['contentid']).first()
                if not fetchcontent:
                    return Response({"status":False,"message":"incorrect contentid"})
                    

                else:
                    fetchuser =  User.objects.filter(uid = request.GET['token']['id']).first()
                    ##check if already add to bookmark
                    checkalreadyAd = CoursePriority.objects.filter(author = request.GET['token']['id'],content_id = request.data['contentid'] ).first()
                    if not checkalreadyAd:
                        addFirst = CoursePriority(author = fetchuser,content_id = fetchcontent,PriorityType = prioritylist[0] )
                        addFirst.save()
                        return Response({"status":True,"message":"Add bookmark"})

                    else:
                        ##fetch all bookmarkname
                        bookmarkname = bookmarkName.objects.filter(user = request.GET['token']['id']).values_list('name', flat=True).distinct().order_by('id')
                        
                        
                        if bookmarkname:
                            prioritylist = prioritylist + list(bookmarkname)


                        
                        if checkalreadyAd.PriorityType in prioritylist:
                            if len(prioritylist) != prioritylist.index(checkalreadyAd.PriorityType) + 1:
                                checkalreadyAd.PriorityType = prioritylist[prioritylist.index(checkalreadyAd.PriorityType) + 1]
                                checkalreadyAd.save()
                            
                            else:
                                # checkalreadyAd.PriorityType = prioritylist[0]
                                # checkalreadyAd.save()
                                checkalreadyAd.delete()


                        
                        return Response({"status":False,"message":"Update bookmark"})   


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class feedbackrecord(APIView):
    permission_classes = [authorization]

    def get(self,request):
        try:
            course_id = request.GET.get("courseid",False)
            if course_id:
                fetchTopics = ReviewModel.objects.filter(categories__parent = course_id).values("id","title","unique_identifier")
                return Response({"status":True,"data":fetchTopics})

            else:
                return Response({"status": False,"message":"courseid is required"})

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)


    def post(self,request):
        try:
            topicid = request.data.get('topicid',False)
            opinion = request.data.get('opinion',False)
            if topicid and opinion:
                ##fetch author
                tokenid = request.GET['token']
                authorFetch = User.objects.get(uid = tokenid['id'])
                
                ###check user already record response

                fetchFeedback = feedback.objects.filter(author = authorFetch,topic = topicid)
                if not fetchFeedback:
                    fetchTopic = ReviewModel.objects.filter(id = topicid).first()
                    if fetchTopic:
                        feedback(author = authorFetch,topic = fetchTopic,opinion = opinion).save()
                        return Response({"status":True,"message":"Response recorded"})

                    else:
                        return Response({"status":False,"message":"topicid is incorrect"})


                else:
                    return Response({"status":False,"message":"response already recorded"})

            else:
                return Response({"status": False,"message":"topicid,opinion is required"})



        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)

class GetPriorityCourse(APIView):

    permission_classes = [authorization]

    def get(self,request):

        try:


            data = CoursePriority.objects.filter(author__uid = request.GET['token']['id']).values_list('content_id__id',flat=True).distinct()
            
            mydata = ReviewModel.objects.filter(id__in = data).values(Courseid=F('categories__parent__id'),Coursename=F('categories__parent__name')).distinct()

            for i in range(len(mydata)):

                data = CoursePriority.objects.filter(author__uid = request.GET['token']['id'],content_id__categories__parent__id = mydata[i]['Courseid']).values('id',Chapterid=F('content_id__categories__id'),contentid=F('content_id__id'),contentname=F('content_id__title'),contentimage=F('content_id__images'),Prioritytype=F('PriorityType'),chapter=F('content_id__categories__name'),coursename = F('content_id__categories__parent__name'),slug = F('content_id__categories__slug'),courseid = F('content_id__categories__parent__id'),category = F('content_id__categories__parent__parent_category__name'),metakeywords = F('content_id__meta_keywords'),meta_description = F('content_id__meta_description'))

                mydata[i]['Chapter'] = data
                del mydata[i]['Courseid']

            for j in range(len(mydata)):
                for k in range(len(data)):
                    if mydata[j]['Coursename'] == None:
                        dataObj = ReviewModel.objects.filter(id = mydata[j]['Chapter'][0]['contentid']).values(Courseid=F('categories__id'),Coursename=F('categories__name')).first()
                        mydata[j]['Coursename'] = dataObj['Coursename']
                        
            return Response({"status":True,"data":mydata})

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)



class backupdata(APIView):
    def get(self,request):
        action = request.GET.get('action')
        if action == "backup":
            subprocess.call(str(settings.BASE_DIR) + "/webapi/backup.sh", shell=True)
            return Response({"status":True,"message":"Category table backup successfully"})

        elif action == "loaddata":
            subprocess.call(str(settings.BASE_DIR) + "/webapi/loaddata.sh", shell=True)
            return Response({"status":True,"message":"loaddata successfully"})

        else:
            return Response({"status":False,"message":"Invalid action specified"})

class exportcategory_or_course(APIView):
    def post(self,request):
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
        if my_token:
            requireFields = ['file']
            validator = uc.keyValidation(True,True,request.data,requireFields)
            if validator:
                return Response(validator)
            
            else:
                filepath = request.FILES.get('file')
                columnFormat = ["name","image","parent","unique_identifier","slug","category"]
                if filepath.name.endswith('xlsx'):
                    datafile = fileBridge(files = filepath)
                    datafile.save()

                    ###then read this file with complete url
                    objreadfile = fileBridge.objects.get(id = datafile.id)
                    readfile = objreadfile.files
                    datafetchfile = pd.read_excel(readfile)
                    datafetchfile = pd.DataFrame(datafetchfile)
                    dataColumns =  datafetchfile.columns
                    if set(dataColumns) == set(columnFormat):
                        ## filter parents
                        authordata = User.objects.get(uid = my_token['id']) 
                        for one,two,three,four,five,six in zip( datafetchfile['name'],datafetchfile['image'],datafetchfile['parent'],datafetchfile['unique_identifier'],datafetchfile['slug'],datafetchfile['category']):
                        
                            if type(three) == float:
                                ##first insert parent means course
                                fetchparentCategory = parentCategory.objects.filter(name = six).first()
                                if fetchparentCategory:
                                    ## check course is already exist  or not
                                    alreadyexistCheck = Category.objects.filter(name = one).first()
                                    if not alreadyexistCheck:

                                        createParent = Category(name = one,parent_category = fetchparentCategory,slug = five,CategoryType = "Category",image = two,unique_identifier = four,author = authordata)
                                        createParent.save()
                                      


                                        for subone,subtwo,subthree,subfour,subfive,subsix in zip( datafetchfile['name'],datafetchfile['image'],datafetchfile['parent'],datafetchfile['unique_identifier'],datafetchfile['slug'],datafetchfile['category']):

                                            if type(subthree) != float:
                                                if str(subfour).startswith(str(four)):
                                                    Category(name = subone,slug = subfive,CategoryType = "SubCategory",image = subtwo,unique_identifier = subfour,parent = createParent).save()
                                                   
                                             



                                        

                                    else:
                                        return Response({'status':False,'message':f'{one} Coursename already exists'})

                                    

                                else:
                                    return Response({'status':False,'message':'Wrong category'})


                               
                        
                        return Response({"status":True,"message":"Data Upload Successfully"})


                    
                    else:
                        return Response({'status':'warning','message':"Column format is incorrect"})

                else:
                    return Response({'status':False,'message':'Only xlsx files are supported'})


        else:
            return Response({'status':False,'message':'Unauthorized'})



class exportcategory_and_course(APIView):
    def post(self,request):
        try:
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:
                requireFields = ['file']
                validator = uc.keyValidation(True,True,request.data,requireFields)
                if validator:
                    return Response(validator)

                else:
                    filepath = request.FILES.get('file')
                    columnFormat = ['Category level #', 'category_course_id', 'category_course_name','parent_category_id', 'slug', 'category_icon_img']

                    if filepath.name.endswith('xlsx'):
                        datafile = fileBridge(files = filepath)
                        datafile.save()
                        ###then read this file with complete url
                        objreadfile = fileBridge.objects.get(id = datafile.id)
                        readfile = objreadfile.files
                        datafetchfile = pd.read_excel(readfile)
                        datafetchfile = pd.DataFrame(datafetchfile)
                        dataColumns =  datafetchfile.columns

                        if set(dataColumns) == set(columnFormat):
                            
                            ##author
                            fetchauthor = User.objects.get(uid = my_token['id'])

                            # selecting rows based on condition 
                            rslt_df = datafetchfile[datafetchfile['parent_category_id'] == "-"]
                            for one,two,three,four,five in (zip(rslt_df['category_course_id'],rslt_df['category_course_name'],rslt_df['parent_category_id'],rslt_df['slug'],rslt_df['category_icon_img'])):
                                
                                ## check if already 
                                alreadyexistParent = parentCategory.objects.filter(unique_identifier = one).first()
                                if not alreadyexistParent:
                                    createparent = parentCategory(unique_identifier = one,name = two,slug = four,image = "category_pic/"+five)
                                    createparent.save()

                            
                            # selecting rows based on condition 
                            rslt_df = datafetchfile[datafetchfile['parent_category_id'] != "-"]
                            for one,two,three,four,five in (zip(rslt_df['category_course_id'],rslt_df['category_course_name'],rslt_df['parent_category_id'],rslt_df['slug'],rslt_df['category_icon_img'])):
                                
                                if type(one) == int:
                                    #create category
                                    fetchParent = parentCategory.objects.filter(unique_identifier = three).first()
                                    if fetchParent:
                                        # print("data",one,two,three,four,five)
                                        ## check if already exist
                                        alreadyslug = parentCategory.objects.filter(Q(unique_identifier = one) |Q(slug = four)).first()
                                        
                                        if not alreadyslug:

                                            data = parentCategory(unique_identifier = one,name = two,slug = four,image = "category_pic/"+five,parent = fetchParent )
                                            data.save()
                                            # print('--------------------------')

                                else:
                                    ## create course
                                    fetchParent = parentCategory.objects.filter(unique_identifier = three).first()
                                    if fetchParent:
                                        one = int(one.replace('-',''))

                                        ##check if not exists critarea
                                        alreadyexistCritArea = Category.objects.filter(Q(unique_identifier = one) |Q(slug = four)).first()
                                        if not alreadyexistCritArea:
                                            createcourses = Category(unique_identifier = one,name = two,parent_category = fetchParent,slug = four,image =  "category_pic/"+five,author = fetchauthor,CategoryType = "Category")
                                            createcourses.save()
                                        
                                    

                                        

                                    



                                

                                


                            return Response({"status":True,"message":"Data Upload Successfully"})

                        else:
                            return Response({'status':'warning','message':"Column format is incorrect"})

                    else:
                        return Response({'status':False,'message':'Only xlsx files are supported'})

            else:
                return Response({'status':False,'message':'Unauthorized'})





        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)


class course_chapters(APIView):
    def post(self, request):
        try:
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
            if my_token:
                requireFields = ['file']
                validator = uc.keyValidation(True,True,request.data,requireFields)
                if validator:
                    return Response(validator)

                else:
                    filepath = request.FILES.get('file')
                    columnFormat = ['capter_id', 'chapter_name', 'course_id', 'linked_content_id','linked_slide_file', 'slug']

                    if filepath.name.endswith('xlsx'):
                        datafile = fileBridge(files = filepath)
                        datafile.save()
                        ###then read this file with complete url
                        objreadfile = fileBridge.objects.get(id = datafile.id)
                        readfile = objreadfile.files
                        datafetchfile = pd.read_excel(readfile)
                        datafetchfile = pd.DataFrame(datafetchfile)
                        dataColumns =  datafetchfile.columns

                        if set(dataColumns) == set(columnFormat):
                            for one,two,three,four,five in (zip(datafetchfile['capter_id'],datafetchfile['chapter_name'],datafetchfile['course_id'],datafetchfile['linked_slide_file'],datafetchfile['slug'])):
                                
                                
                                ##fetch course information
                                three = int(three.replace('-',''))
                                one = int(one.replace('-',''))

                                fetchcourse = Category.objects.filter(unique_identifier = three ).first()
                                if fetchcourse:
                                    
                                    ##check if not exists critarea
                                    alreadyexistCritArea = Category.objects.filter(Q(unique_identifier = one) |Q(slug = five)).first()

                                    if not alreadyexistCritArea:
                                        createcourses = Category(unique_identifier = one,name = two,slug = five,image =  "MainSlideImages/"+four,CategoryType = "SubCategory",parent = fetchcourse)
                                        createcourses.save()

        
                            
                            
                            
                            return Response({"status":True,"message":"Data Upload Successfully"})

                        else:
                            return Response({'status':'warning','message':"Column format is incorrect"})

                    else:
                        return Response({'status':False,'message':'Only xlsx files are supported'})

            else:
                return Response({'status':False,'message':'Unauthorized'})




        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)



class exportpost(APIView):
    def post(self,request):
        my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],"editor")
        if my_token:
            requireFields = ['file']
            validator = uc.keyValidation(True,True,request.data,requireFields)
            if validator:
                return Response(validator)

            else:
                filepath = request.FILES.get('file')
                columnFormat = ['content_id', 'content_name', 'chapter_id', 'tag', 'meta_description','mainslide_img', 'content', 'slug', 'editor_id', 'only_to_editor','access_level', 'created_at', 'updated_at']
                if filepath.name.endswith('xlsx'):
                    datafile = fileBridge(files = filepath)
                    datafile.save()
                    ###then read this file with complete url
                    objreadfile = fileBridge.objects.get(id = datafile.id)
                    readfile = objreadfile.files
                    datafetchfile = pd.read_excel(readfile)
                    datafetchfile = pd.DataFrame(datafetchfile)
                    dataColumns =  datafetchfile.columns

                    if set(dataColumns) == set(columnFormat):
                        author = User.objects.get(uid = my_token['id'])

                        for one,two,three,four,five,six,seven,eight,nine,ten,eleven,twelve in (zip(datafetchfile['content_id'],datafetchfile['content_name'],datafetchfile['chapter_id'],datafetchfile['tag'],datafetchfile['meta_description'],datafetchfile['mainslide_img'],datafetchfile['content'],datafetchfile['slug'],datafetchfile['created_at'],datafetchfile['updated_at'],datafetchfile['only_to_editor'],datafetchfile['slug'])):

                            three = int(three.replace('-',''))
                            one = int(one.replace('-',''))
                            ## fetch chapter
                            fetchchapter = Category.objects.filter(unique_identifier = three).first()
                            if fetchchapter:
                                
                                ##check if post not exists
                                checkalreadypost = ReviewModel.objects.filter(unique_identifier = one).first()
                                if not checkalreadypost:
                                    createpost = ReviewModel(title = two,author =author,images = "MainSlideImages/"+ six,categories = fetchchapter,tags = four,meta_description = five,content = seven,created_at = nine,updated_at = ten,unique_identifier = one,only_to_my_page = eleven,postslug = twelve)

                                    createpost.save()
                             
                          


                            
                        
                        
                        
                        return Response({"status":True,"message":"Data Upload Successfully"})

                    else:
                        return Response({'status':'warning','message':"Column format is incorrect"})

                else:
                    return Response({'status':False,'message':'Only xlsx files are supported'})

        else:
            return Response({'status':False,'message':'Unauthorized'})





class courseviews(APIView):
    def post(self, request):
        try:
            role = request.GET.get('role',False)
            my_token = uc.tokenauth(request.META['HTTP_AUTHORIZATION'][7:],role)
            if my_token:
                requireFields = ['courseid']
                validator = uc.keyValidation(True,True,request.data,requireFields)
                if validator:
                    return Response(validator)

                else:
                    courseid = request.data['courseid']
                    checkalreadyView = courseViews.objects.filter(courseid = courseid,viewer = my_token['id']).first()
                    if not checkalreadyView:
                        fetchcourse = Category.objects.filter(id = courseid).first()
                        if fetchcourse:
                            fetchviewer = User.objects.get(uid = my_token['id'])
                            courseViews(courseid = fetchcourse,viewer = fetchviewer).save()
                            return Response({"status":True,"message":"View recorded"})

                        else:
                            return Response({"status":False,"message":"courseid is incorrect"})

                    else:
                        return Response({"status":True,"message":"Already View"})

            else:
                return Response({'status':False,'message':'Unauthorized'})

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message,status=500)