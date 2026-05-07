from django.urls import path
from .views import predict_bookings

urlpatterns = [
    path('predict/', predict_bookings, name='predict_bookings'),
]