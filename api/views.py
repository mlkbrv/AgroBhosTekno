from itertools import chain
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from rest_framework import generics
from .models import Crop, Item, Machinery, Farm, CropCategory
from .serializers import (
    CropSerializer, ItemSerializer, MachinerySerializer,
    FarmSerializer, CropCategorySerializer
)
from .permissions import *




class CropListView(generics.ListAPIView):
    queryset = Crop.objects.all().order_by('name')
    serializer_class = CropSerializer


class CropDetailView(generics.RetrieveAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer


class CropUpdateView(generics.UpdateAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsOwnerOrAdmin]


class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all().order_by('name')
    serializer_class = ItemSerializer


class ItemDetailView(generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ItemUpdateView(generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsOwnerOrAdmin]


class MachineryListView(generics.ListAPIView):
    queryset = Machinery.objects.all().order_by('name')
    serializer_class = MachinerySerializer


class MachineryDetailView(generics.RetrieveAPIView):
    queryset = Machinery.objects.all()
    serializer_class = MachinerySerializer


class MachineryUpdateView(generics.UpdateAPIView):
    queryset = Machinery.objects.all()
    serializer_class = MachinerySerializer
    permission_classes = [IsOwnerOrAdmin]


class FarmListView(generics.ListAPIView):
    queryset = Farm.objects.all().order_by('name')
    serializer_class = FarmSerializer
    permission_classes = [AllowAny]

class FarmDetailView(generics.RetrieveAPIView):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [AllowAny]


class FarmUpdateView(generics.UpdateAPIView):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [IsOwnerOrAdmin]


class CropCategoryListView(generics.ListAPIView):
    queryset = CropCategory.objects.all().order_by('name')
    serializer_class = CropCategorySerializer


class CropCategoryDetailView(generics.RetrieveAPIView):
    queryset = CropCategory.objects.all()
    serializer_class = CropCategorySerializer


class AllProductsView(generics.ListAPIView):
    serializer_class = AllProductsSerializer

    def get_queryset(self):
        return Crop.objects.none()

    def list(self, request, *args, **kwargs):
        crops = Crop.objects.all()
        items = Item.objects.all()
        machinery = Machinery.objects.all()

        all_products = list(chain(crops, items, machinery))
        serializer = self.get_serializer(all_products, many=True)
        return Response(serializer.data)


# Представления для владельцев бизнеса
class UserFarmsView(generics.ListAPIView):
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Отключаем пагинацию для ферм пользователя

    def get_queryset(self):
        """Возвращает только фермы текущего пользователя"""
        return Farm.objects.filter(owner=self.request.user).order_by('name')


class AddCropView(generics.CreateAPIView):
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Создает продукт для фермы пользователя"""
        farm = serializer.validated_data.get('farm')
        if farm.owner != self.request.user:
            raise PermissionError("You can only add products to your own farm")
        serializer.save()


class AddItemView(generics.CreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Создает продукт для фермы пользователя"""
        farm = serializer.validated_data.get('farm')
        if farm.owner != self.request.user:
            raise PermissionError("You can only add products to your own farm")
        serializer.save()


class AddMachineryView(generics.CreateAPIView):
    serializer_class = MachinerySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Создает продукт для фермы пользователя"""
        farm = serializer.validated_data.get('farm')
        if farm.owner != self.request.user:
            raise PermissionError("You can only add products to your own farm")
        serializer.save()


class CreateFarmView(generics.CreateAPIView):
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Создает ферму для текущего пользователя"""
        serializer.save(owner=self.request.user)


# Новые views для фильтрации по ферме
class FarmCropsView(generics.ListAPIView):
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        farm_id = self.kwargs.get('farm_id')
        return Crop.objects.filter(farm_id=farm_id).order_by('name')


class FarmItemsView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        farm_id = self.kwargs.get('farm_id')
        return Item.objects.filter(farm_id=farm_id).order_by('name')


class FarmMachineryView(generics.ListAPIView):
    serializer_class = MachinerySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        farm_id = self.kwargs.get('farm_id')
        return Machinery.objects.filter(farm_id=farm_id).order_by('name')


class FarmAllProductsView(generics.ListAPIView):
    serializer_class = AllProductsSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        farm_id = self.kwargs.get('farm_id')
        
        crops = Crop.objects.filter(farm_id=farm_id)
        items = Item.objects.filter(farm_id=farm_id)
        machinery = Machinery.objects.filter(farm_id=farm_id)

        all_products = list(chain(crops, items, machinery))
        serializer = self.get_serializer(all_products, many=True)
        return Response(serializer.data)


# Views для удаления продуктов
class CropDeleteView(generics.DestroyAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsOwnerOrAdmin]


class ItemDeleteView(generics.DestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsOwnerOrAdmin]


class MachineryDeleteView(generics.DestroyAPIView):
    queryset = Machinery.objects.all()
    serializer_class = MachinerySerializer
    permission_classes = [IsOwnerOrAdmin]
