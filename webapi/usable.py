
import jwt
from decouple import config
import re
from PIL import Image
import random



def requireKeys(reqArray,requestData):
    try:
        for j in reqArray:
            if not j in requestData:
                return False
            
        return True

    except:
        return False


def allfieldsRequired(reqArray,requestData):
    try:
        for j in reqArray:
            if len(requestData[j]) == 0:
                return False

        
        return True

    except:
        return False

            

def checkemailforamt(email):
    emailregix = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

    if(re.match(emailregix, email)):

        return True

    else:
       return False



def imageValidator(img,ignoredimension = True,formatcheck = False):

    try:

        im = Image.open(img)
        width, height = im.size
        if ignoredimension:
            if width > 330 and height > 330:
                return False

            else:
                return True

        if formatcheck:
            if im.format == "PNG":
                
                return True

            else:
                
                return False
            
        else:
            return True
    
    except:
        return False


def passwordLengthValidator(passwd):
    if len(passwd) >= 8 and len(passwd) <= 20:
        return True

    else:
        return False





##both keys and required field validation

def keyValidation(keyStatus,reqStatus,requestData,requireFields):


    ##keys validation
    if keyStatus:
        keysStataus = requireKeys(requireFields,requestData)
        if not keysStataus:
            return {'status':False,'message':f'{requireFields} all keys are required'}



    ##Required field validation
    if reqStatus:
        requiredStatus = allfieldsRequired(requireFields,requestData)
        if not requiredStatus:
            return {'status':False,'message':'All Fields are Required'}



#Token Expire
def tokenauth(tokencatch,role="superadmin"):

    try:
        if role == "superadmin":
            my_token = jwt.decode(tokencatch,superadmintokenkey, algorithms=["HS256"])
            return my_token

        elif role == "normaluser":
            my_token = jwt.decode(tokencatch,config('normaluserkey'), algorithms=["HS256"])
            return my_token

        elif role == "editor":
            my_token = jwt.decode(tokencatch,config('editorkey'), algorithms=["HS256"])
            return my_token


     


    except jwt.ExpiredSignatureError:
        return False

    except:
        return False



def randomcodegenrator():

    randomcode = "%0.12d" % random.randint(0,999999999999)
    return randomcode

def emailrandomcodegenrator():

    randomcode = random.randint(1000,10000)
    return randomcode

