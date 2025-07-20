from rest_framework import serializers
from users.models import User
from .models import *

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name')

class FarmShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = ('id', 'name', 'description', 'address')

class CropCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CropCategory
        fields = ('id', 'name',)


class FarmSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)               # вложенный
    crops = serializers.StringRelatedField(many=True, read_only=True)
    items = serializers.StringRelatedField(many=True, read_only=True)
    machines = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Farm
        fields = (
            'id', 'name', 'description', 'image',
            'owner', 'crops', 'items', 'machines','address'
        )

class CropSerializer(serializers.ModelSerializer):
    category = CropCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=CropCategory.objects.all(),
        source='category',
        write_only=True
    )
    farm = FarmShortSerializer(read_only=True)
    farm_id = serializers.PrimaryKeyRelatedField(
        queryset=Farm.objects.all(),
        source='farm',
        write_only=True
    )
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Crop
        fields = (
            'id', 'name', 'description', 'image',
            'category', 'category_id',
            'farm', 'farm_id',
            'stock', 'predicted_yield', 'price', 'in_stock'
        )


class ItemSerializer(serializers.ModelSerializer):
    farm = FarmShortSerializer(read_only=True)
    farm_id = serializers.PrimaryKeyRelatedField(
        queryset=Farm.objects.all(),
        source='farm',
        write_only=True
    )
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Item
        fields = (
            'id', 'name', 'description', 'image',
            'farm', 'farm_id',
            'stock', 'price', 'is_new', 'in_stock'
        )


class MachinerySerializer(serializers.ModelSerializer):
    farm = FarmShortSerializer(read_only=True)
    farm_id = serializers.PrimaryKeyRelatedField(
        queryset=Farm.objects.all(),
        source='farm',
        write_only=True
    )
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Machinery
        fields = (
            'id', 'name', 'producer', 'description', 'image',
            'farm', 'farm_id',
            'stock', 'price', 'is_new', 'in_stock'
        )

class AllProductsSerializer(serializers.Serializer):
    def to_representation(self, instance):
        if isinstance(instance, Crop):
            return CropSerializer(instance, context=self.context).data
        if isinstance(instance, Item):
            return ItemSerializer(instance, context=self.context).data
        if isinstance(instance, Machinery):
            return MachinerySerializer(instance, context=self.context).data
        raise TypeError('Unexpected object type')
