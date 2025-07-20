from itertools import chain
from rest_framework.response import Response
from .serializers import *
from rest_framework import generics
from .models import Crop, Item, Machinery, Farm, CropCategory
from .serializers import (
    CropSerializer, ItemSerializer, MachinerySerializer,
    FarmSerializer, CropCategorySerializer
)
from .permissions import *




class CropListView(generics.ListAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer


class CropDetailView(generics.RetrieveAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer


class CropUpdateView(generics.UpdateAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsOwnerOrAdmin]


class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ItemDetailView(generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ItemUpdateView(generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsOwnerOrAdmin]


class MachineryListView(generics.ListAPIView):
    queryset = Machinery.objects.all()
    serializer_class = MachinerySerializer


class MachineryDetailView(generics.RetrieveAPIView):
    queryset = Machinery.objects.all()
    serializer_class = MachinerySerializer


class MachineryUpdateView(generics.UpdateAPIView):
    queryset = Machinery.objects.all()
    serializer_class = MachinerySerializer
    permission_classes = [IsOwnerOrAdmin]


class FarmListView(generics.ListAPIView):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer


class FarmDetailView(generics.RetrieveAPIView):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer


class FarmUpdateView(generics.UpdateAPIView):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [IsOwnerOrAdmin]


class CropCategoryListView(generics.ListAPIView):
    queryset = CropCategory.objects.all()
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
