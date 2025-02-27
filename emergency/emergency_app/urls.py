
from django.urls import path
from . import views

urlpatterns = [

    path('register/', views.register, name = 'register'),
    path('login/', views.login, name='login'),
    path('refresh-token/', views.refresh_token, name='refresh_token'),
    path("update-location/", views.update_location, name="update_location"), 
    path("resolve-emergency/", views.resolve_emergency, name="resolve_emergency"),

]