
from django.shortcuts import render
from .models import employee_collection, company_collection, emergency_collection, category
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication 
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import json
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    data = json.loads(request.body)

    firstname = data.get('lastname')
    lastname = data.get('lastname')
    employeeId = data.get('employeeId')
    email = data.get('email')
    companyCode = data.get('code')
    password = data.get(password)

    

