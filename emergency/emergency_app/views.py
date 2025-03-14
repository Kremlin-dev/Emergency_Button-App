from django.shortcuts import render
from .models import employee_collection, company_collection, emergency_collection
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from .authentication import jwt_required
from django.views.decorators.csrf import csrf_exempt
import json
from .consumers import LocationHandler
from .firebase_config import firebase_db
from django.contrib.auth import login, logout
from django.contrib.sessions.models import Session
from .decorators import admin_required 

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

#REGISTER USER

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
        return JsonResponse({"error": "All fields are required", "reqState": False}, status=400)

    company = company_collection.find_one({'companyCode': companyCode})

    if not company:
        return JsonResponse({"error": "Invalid Company Code", "reqState": False}, status=400)

    matched_employee = None
    for emp in company.get("employees", []):
        if emp["employeeId"] == employeeId:
            matched_employee = emp
            break

    if not matched_employee:
        return JsonResponse({"error": "Employee ID not recognized. Contact your Administrator", "reqState": False}, status=400)

    existing_employee = employee_collection.find_one({"employeeId": employeeId})
    if existing_employee:
        return JsonResponse({"error": "Employee ID is already registered", "reqState": False}, status=400)

    if employee_collection.find_one({"email": email}):
        return JsonResponse({"error": "User with this email already exists", "reqState": False}, status=400)

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

    return JsonResponse({"success": "Signup successful", "reqState": True}, status=200)

#LOGIN USER
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    data = request.data
    employeeId = data.get('employeeId')
    password = data.get('password')

    if not employeeId or not password:
        return JsonResponse({"error": "Employee ID and password are required", "reqState": False}, status=400)

    employee = employee_collection.find_one({"employeeId": employeeId})

    if not employee:
        return JsonResponse({"error": "Invalid Employee ID or password", "reqState": False}, status=401)

    if not bcrypt.checkpw(password.encode('utf-8'), employee['password'].encode('utf-8')):
        return JsonResponse({"error": "Invalid Employee ID or password", "reqState": False}, status=401)

    company = company_collection.find_one({"companyCode": employee["companyCode"]})
    phone_number = None
    if company:
        for emp in company.get("employees", []):
            if emp["employeeId"] == employeeId:
                phone_number = emp.get("phone", None)
                break

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
        "employeeId": employeeId,
        "firstname": employee["firstname"],
        "lastname": employee["lastname"],
        "companyCode": employee["companyCode"],
        "email": employee["email"],
        "phone": phone_number, 
        "access_token": access_token,
        "refresh_token": refresh_token,
        "reqState": True
    }, status=200)


#REPORT EMERGENCY
@csrf_exempt
# @jwt_required  
def report_emergency(request):
    
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            employee_id = data.get("employeeId")
            company_code = data.get("companyCode")
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            accuracy = data.get("accuracy")
            category = data.get("category")

            if not all([employee_id, company_code, latitude, longitude, accuracy, category]):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            response = LocationHandler.report_emergency(
                employee_id, company_code, latitude, longitude, accuracy, category
            )
            return JsonResponse(response, status=200 if "success" in response else 400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


#UPDATE EMERGENCY STATUS
@csrf_exempt
@csrf_exempt
@admin_required
def update_emergency_status(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            emergency_id = data.get("emergencyId")
            status = data.get("status")

            if not emergency_id or status not in ["active", "resolved"]:
                return JsonResponse({"error": "Missing emergencyId or invalid status"}, status=400)

            response = LocationHandler.update_emergency_status(emergency_id, status)
            return JsonResponse(response, status=200 if "success" in response else 400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

############
# ADD WORK NOTES
@csrf_exempt
def add_work_note(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            emergency_id = data.get("emergencyId")
            note = data.get("note")

            if not emergency_id or not note:
                return JsonResponse({"error": "Missing emergencyId or note"}, status=400)

            work_note = {
                "note": note,
                "timestamp": datetime.utcnow().isoformat()
            }

            emergency_collection.update_one(
                {"emergencyId": emergency_id},
                {"$push": {"workNotes": {"$each": [work_note], "$position": 0}}}
            )

            updated_emergency = emergency_collection.find_one(
                {"emergencyId": emergency_id}, {"workNotes": 1, "_id": 0}
            )

            return JsonResponse({
                "success": "Work note added successfully",
                "workNotes": updated_emergency.get("workNotes", [])
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

# RESET PASSWORD
@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            employee_id = data.get("employeeId")
            new_password = data.get("newPassword")

            if not employee_id or not new_password:
                return JsonResponse({"error": "Employee ID and new password are required", "reqState": False}, status=400)

            employee = employee_collection.find_one({"employeeId": employee_id})

            if not employee:
                return JsonResponse({"error": "Employee ID not found", "reqState": False}, status=404)

            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            employee_collection.update_one(
                {"employeeId": employee_id},
                {"$set": {"password": hashed_password}}
            )

            return JsonResponse({"success": "Password reset successful", "reqState": True}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data", "reqState": False}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e), "reqState": False}, status=500)

    return JsonResponse({"error": "Invalid request method", "reqState": False}, status=405)

@csrf_exempt
def admin_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            company_code = data.get("companyCode")
            password = data.get("password")

            if not company_code or not password:
                return JsonResponse({"error": "Company code and password are required"}, status=400)

            company = company_collection.find_one({"companyCode": company_code})

            if not company or not bcrypt.checkpw(password.encode('utf-8'), company["password"].encode('utf-8')):
                return JsonResponse({"error": "Invalid company code or password"}, status=401)

            request.session["admin_company_code"] = company_code
            request.session["is_admin"] = True

            return JsonResponse({"success": "Login successful", "companyCode": company_code, "companyName": company["companyName"]}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@admin_required
def get_company_employees(request, company_code):
    if request.method == "GET":
        company = company_collection.find_one(
            {"companyCode": company_code}, {"employees": 1, "_id": 0}
        )

        if not company:
            return JsonResponse({"error": "Company not found"}, status=404)

        employees = company.get("employees", [])

        registered_ids = set(
            emp["employeeId"] for emp in employee_collection.find({}, {"employeeId": 1})
        )

        for emp in employees:
            emp["registered"] = emp["employeeId"] in registered_ids

        return JsonResponse({"employees": employees}, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)