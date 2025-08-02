from django.urls import path
from .views import *

urlpatterns = [
    path("",LocationListAPIView.as_view(), name="locations"),
    path("<int:pk>/",LocationDetailAPIView.as_view(), name="locations-details"),
]