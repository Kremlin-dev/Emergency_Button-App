from django.urls import path

from . import consumersFirst

websocket_urlpatterns = [
    path("ws/location/", consumersFirst.LocationConsumer.as_asgi()), 

    # re_path(r'ws/livec/$', consumers.Calculator.as_asgi()),
]
