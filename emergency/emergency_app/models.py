from django.db import models
from .db_connection import db

employee_collection = db['Employee']
company_collection = db['companies']
emergency_collection = db['Emergency']
emergency_response_collection = db['Emergency_response']
category = db['Category']

# Create your models here.
