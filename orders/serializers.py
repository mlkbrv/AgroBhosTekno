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

class CreateOrderItemSerializer(serializers.ModelSerializer):
    content_type = serializers.CharField()
    
    class Meta:
        model = OrderItem
        fields = ['quantity', 'content_type', 'object_id']
    
    def validate_content_type(self, value):
        """Валидирует content_type и возвращает объект ContentType"""
        try:
            return ContentType.objects.get(model=value)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Content type '{value}' does not exist")
    
    def create(self, validated_data):
        """Создает OrderItem с правильным content_type"""
        content_type = validated_data.pop('content_type')
        validated_data['content_type'] = content_type
        return super().create(validated_data)

class CreateOrderSerializer(serializers.ModelSerializer):
    items = CreateOrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = ['items']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        print(f"Creating order for user: {user.id} - {user.email}")
        
        order = Order.objects.create(user=user)
        print(f"Created order: {order.order_id}")
        
        for item_data in items_data:
            # Создаем OrderItem с правильным content_type
            content_type = item_data['content_type']
            order_item = OrderItem.objects.create(
                order=order,
                quantity=item_data['quantity'],
                content_type=content_type,
                object_id=item_data['object_id']
            )
            print(f"Created order item: {order_item.id} for product {item_data['object_id']}")
        
        return order
    
    def to_representation(self, instance):
        """Переопределяем представление для возврата полного заказа"""
        return OrderSerializer(instance).data

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'user', 'created_at', 'status', 'items']