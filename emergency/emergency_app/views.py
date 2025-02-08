from django.shortcuts import render
from .models import employee_collection, company_collection
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
import bcrypt

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
        return JsonResponse({"error": "Employee ID not recognized"}, status=400)
    
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
