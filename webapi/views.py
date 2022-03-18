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

# Create your views here.


def index(request):
    return HttpResponse('<h1>Project libra</h1>')

class signup(APIView):
    def post(self,request):
        try:
            requireFields = ['email','password']
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
                

                data = User.objects.filter(email = email)
                if data:
                    return Response({'status':False,'data':"Email already exist"})

                else:
                    username = email.split('@')[0] + str(uc.randomcodegenrator())
                    data = User(email=email,password=handler.hash(password),username = username)
                    data.save()
                    return Response({'status':True,'message':'Account Created Successfully'})  

        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message)




class userlogin(APIView):
    def post(self,request):
        try:
            requireFields = ['email','password']
            ##required field validation
            validator = uc.keyValidation(True,True,request.data,requireFields)
            if validator:
                    return Response(validator)

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
                    access_token = jwt.encode(access_token_payload,config('normaluserkey'), algorithm='HS256')

                    userpayload = { 'id': fetchuser.uid,'username': fetchuser.username,'email':fetchuser.email,'fname':fetchuser.fname,'lname':fetchuser.lname,'profile':fetchuser.profile.url}

                    return Response({'status':True,'message':'Login SuccessFully','token':access_token,'data':userpayload})

                else:
                    return Response({'status':False,'message':'Invalid Credential'})


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message)




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
                    

                    }})

                else:
                    return Response({'status':"error",'message':'userid is incorrect'})

            else:
                return Response({'status':False,'message':'token is expire'})


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message)

    

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
                return Response({'status':False,'message':'token is expire'})


        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message)



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
                return Response({'status':False,'message':'token is expire'})



        except Exception as e:
            message = {'status':"error",'message':str(e)}
            return Response(message)
