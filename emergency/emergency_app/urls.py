
from django.urls import path
from . import views

urlpatterns = [

    path('register/', views.register, name = 'register'),
    path('login/', views.login, name='login'),
    path('refresh-token/', views.refresh_token, name='refresh_token'),
    path('emergency/report/', views.report_emergency, name='report_emergency'),
    path('emergency/update-status/', views.update_emergency_status, name='update_emergency_status'),
    path('work-notes/', views.add_work_note, name='add-work-note'),
]