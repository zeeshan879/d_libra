from rest_framework import permissions
from rest_framework.exceptions import APIException
from rest_framework import status
from decouple import config
import jwt


class authorization(permissions.BasePermission):

    def has_permission(self, request, view):
        try:

            role = request.GET['role']
            if role == "editor":
                tokencatch = request.META['HTTP_AUTHORIZATION'][7:]
                my_token = jwt.decode(tokencatch,config('editorkey'), algorithms=["HS256"])
                return True


            elif role == "normaluser":
                my_token = jwt.decode(tokencatch,config('normaluserkey'), algorithms=["HS256"])
                return my_token

            else:
                raise NeedLogin()


   

        except jwt.ExpiredSignatureError:
             raise NeedLogin()

        except:
            raise NeedLogin()



    

class NeedLogin(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = {'status': False, 'message': 'Unauthorized'}
    default_code = 'not_authenticated'