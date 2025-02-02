
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('add/', views.add_employee, name ='add_employee'),
    path('get/', views.get_all_employees, name ='get_employee')
]