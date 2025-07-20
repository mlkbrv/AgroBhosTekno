from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Order, OrderItem
from api.models import Crop, Item, Machinery

class ProductRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        return {
            "id": value.id,
            "name": value.name,
            "price": value.price,
            "type": value.__class__.__name__.lower(),
        }

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductRelatedField(read_only=True)
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(),
        slug_field='model'
    )
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'quantity', 'content_type', 'object_id', 'product', 'item_subtotal']
        read_only_fields = ['id', 'product', 'item_subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'status', 'items']