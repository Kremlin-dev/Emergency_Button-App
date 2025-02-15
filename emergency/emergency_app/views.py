from django.shortcuts import render
from .models import employee_collection, company_collection
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from .authentication import jwt_required


##########################
# REFRESH TOKEEN
#########################
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    data = request.data
    refresh_token = data.get("refresh_token")

    if not refresh_token:
        return JsonResponse({"error": "Refresh token is required"}, status=400)

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])

        new_access_payload = {
                            "employeeId": payload["employeeId"],
                            "exp": datetime.now(timezone.utc) + timedelta(days=3),
                             "iat": datetime.now(timezone.utc)
                            }
        new_access_token = jwt.encode(new_access_payload, settings.SECRET_KEY, algorithm="HS256")

        return JsonResponse({"access_token": new_access_token}, status=200)

    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Refresh token expired, please log in again"}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({"error": "Invalid token"}, status=401)

#####################################################################################################

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data

    firstname = data.get('firstname')
    lastname = data.get('lastname')
    employeeId = data.get('employeeId')
    email = data.get('email')
    companyCode = data.get('code')
    password = data.get('password')

    if not all([firstname, lastname, employeeId, email, companyCode, password]):
        return JsonResponse({"error": "All fields are required"}, status=400)

    company = company_collection.find_one({'companyCode': companyCode})

    if not company:
        return JsonResponse({"error": "Invalid Company Code"}, status=400)

    if employeeId not in company.get("employeeIds", []):
        return JsonResponse({"error": "Employee ID not recognized, Contact your Administrator"}, status=400)

    existing_employee = employee_collection.find_one({"employeeId": employeeId})
    if existing_employee:
        return JsonResponse({"error": "Employee ID is already registered"}, status=400)

    if employee_collection.find_one({"email": email}):
        return JsonResponse({"error": "User with this email already exists"}, status=400)

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    employeeData = {
        "firstname": firstname,
        "lastname": lastname,
        "employeeId": employeeId,
        "email": email,
        "companyCode": companyCode,
        "password": hashed_password
    }
    employee_collection.insert_one(employeeData)

    return JsonResponse({"success": "Signup successful"}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    data = request.data

    employeeId = data.get('employeeId')
    password = data.get('password')

    if not employeeId or not password:
        return JsonResponse({"error": "Employee ID and password are required"}, status=400)

    employee = employee_collection.find_one({"employeeId": employeeId})

    if not employee:
        return JsonResponse({"error": "Invalid Employee ID or password"}, status=401)

    if not bcrypt.checkpw(password.encode('utf-8'), employee['password'].encode('utf-8')):
        return JsonResponse({"error": "Invalid Employee ID or password"}, status=401)

    access_payload = {
        "employeeId": employeeId,
        "exp": datetime.now(timezone.utc) + timedelta(days=3),
        "iat": datetime.now(timezone.utc)
    }
    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm="HS256")

    refresh_payload = {
        "employeeId": employeeId,
        "exp": datetime.now(timezone.utc) + timedelta(days=365),
        "iat": datetime.now(timezone.utc)
    }
    refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm="HS256")

    return JsonResponse({
        "success": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token
    }, status=200)
