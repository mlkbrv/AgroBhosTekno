from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer, CreateOrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().select_related('user')
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Возвращает только заказы текущего пользователя"""
        print(f"Getting orders for user: {self.request.user.id} - {self.request.user.email}")
        queryset = Order.objects.filter(user=self.request.user).select_related('user')
        print(f"Found {queryset.count()} orders for user {self.request.user.id}")
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        # Пользователь уже сохраняется в CreateOrderSerializer.create()
        serializer.save()

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
