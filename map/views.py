from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .models import Location
from .serializers import LocationSerializer


class LocationListAPIView(generics.ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get_queryset(self):
        """Фильтрация и обработка ошибок"""
        try:
            return Location.objects.all()
        except Exception as e:
            print(f"Ошибка при получении локаций: {e}")
            return Location.objects.none()

    def get_serializer_context(self):
        """Передаем request в сериализатор"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            print(f"Ошибка сериализации: {e}")
            return Response(
                {"error": "Ошибка при загрузке локаций"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LocationDetailAPIView(generics.RetrieveAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )