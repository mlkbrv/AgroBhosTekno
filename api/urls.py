from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('all/',views.AllProductsView.as_view(),name='all'),
    path('crops/', views.CropListView.as_view(), name='crop-list'),
    path('crops/<int:pk>/', views.CropDetailView.as_view(), name='crop-detail'),
    path('crops/<int:pk>/update/', views.CropUpdateView.as_view(), name='crop-update'),
    path('crops/<int:pk>/delete/', views.CropDeleteView.as_view(), name='crop-delete'),

    path('items/', views.ItemListView.as_view(), name='item-list'),
    path('items/<int:pk>/', views.ItemDetailView.as_view(), name='item-detail'),
    path('items/<int:pk>/update/', views.ItemUpdateView.as_view(), name='item-update'),
    path('items/<int:pk>/delete/', views.ItemDeleteView.as_view(), name='item-delete'),

    path('machinery/', views.MachineryListView.as_view(), name='machinery-list'),
    path('machinery/<int:pk>/', views.MachineryDetailView.as_view(), name='machinery-detail'),
    path('machinery/<int:pk>/update/', views.MachineryUpdateView.as_view(), name='machinery-update'),
    path('machinery/<int:pk>/delete/', views.MachineryDeleteView.as_view(), name='machinery-delete'),

    path('farms/', views.FarmListView.as_view(), name='farm-list'),
    path('farms/<int:pk>/', views.FarmDetailView.as_view(), name='farm-detail'),
    path('farms/<int:pk>/update/', views.FarmUpdateView.as_view(), name='farm-update'),

    path('categories/', views.CropCategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CropCategoryDetailView.as_view(), name='category-detail'),
    
    # Новые URL для владельцев бизнеса
    path('user/farms/', views.UserFarmsView.as_view(), name='user-farms'),
    path('user/farms/create/', views.CreateFarmView.as_view(), name='create-farm'),
    path('user/crops/add/', views.AddCropView.as_view(), name='add-crop'),
    path('user/items/add/', views.AddItemView.as_view(), name='add-item'),
    path('user/machinery/add/', views.AddMachineryView.as_view(), name='add-machinery'),
    
    # Новые URL для получения продуктов конкретной фермы
    path('farms/<int:farm_id>/crops/', views.FarmCropsView.as_view(), name='farm-crops'),
    path('farms/<int:farm_id>/items/', views.FarmItemsView.as_view(), name='farm-items'),
    path('farms/<int:farm_id>/machinery/', views.FarmMachineryView.as_view(), name='farm-machinery'),
    path('farms/<int:farm_id>/products/', views.FarmAllProductsView.as_view(), name='farm-all-products'),
]