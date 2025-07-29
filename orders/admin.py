from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['item_subtotal']

class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'user', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_id', 'user__email']
    readonly_fields = ['order_id', 'created_at']
    inlines = [OrderItemInline]
    ordering = ['-created_at']

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'content_type', 'object_id', 'quantity', 'item_subtotal']
    list_filter = ['content_type', 'order__status']
    readonly_fields = ['item_subtotal']

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)