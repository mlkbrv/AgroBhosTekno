from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from users.views import *



urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),

    # Login and token management using simplejwt
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # User profile (requires authentication)
    path('profile/', ProfileView.as_view(), name='user_profile'),
]
