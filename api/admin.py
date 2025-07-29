from django.contrib import admin
from .models import CropCategory, Farm, Crop, Machinery, Item

@admin.register(CropCategory)
class CropCategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'address']
    search_fields = ['name', 'description', 'address']

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ['name', 'farm', 'category', 'price', 'stock']
    list_filter = ['category', 'farm']
    search_fields = ['name', 'description']

@admin.register(Machinery)
class MachineryAdmin(admin.ModelAdmin):
    list_display = ['name', 'farm', 'price', 'stock']
    list_filter = ['farm']
    search_fields = ['name', 'description']

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'farm', 'price', 'stock']
    list_filter = ['farm']
    search_fields = ['name', 'description']

