
from django.shortcuts import render
from .models import employee_collection
from django.http import HttpResponse

def index(request):
    return HttpResponse("<h1> App is running</h1>")

def add_employee(request):
    records ={
        "name": "John",
        "age": 12
    }
    employee_collection.insert_one(records)
    return HttpResponse("New Person added")

def get_all_employees(request):
    employee = employee_collection.find()
    return HttpResponse(employee)