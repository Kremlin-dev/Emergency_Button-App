from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/location/", consumers.LocationConsumer.as_asgi()), 

    # re_path(r'ws/livec/$', consumers.Calculator.as_asgi()),
]
