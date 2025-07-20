from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('all/',views.AllProductsView.as_view(),name='all'),
    path('crops/', views.CropListView.as_view(), name='crop-list'),
    path('crops/<int:pk>/', views.CropDetailView.as_view(), name='crop-detail'),
    path('crops/<int:pk>/update/', views.CropUpdateView.as_view(), name='crop-update'),

    path('items/', views.ItemListView.as_view(), name='item-list'),
    path('items/<int:pk>/', views.ItemDetailView.as_view(), name='item-detail'),
    path('items/<int:pk>/update/', views.ItemUpdateView.as_view(), name='item-update'),

    path('machinery/', views.MachineryListView.as_view(), name='machinery-list'),
    path('machinery/<int:pk>/', views.MachineryDetailView.as_view(), name='machinery-detail'),
    path('machinery/<int:pk>/update/', views.MachineryUpdateView.as_view(), name='machinery-update'),

    path('farms/', views.FarmListView.as_view(), name='farm-list'),
    path('farms/<int:pk>/', views.FarmDetailView.as_view(), name='farm-detail'),
    path('farms/<int:pk>/update/', views.FarmUpdateView.as_view(), name='farm-update'),

    path('categories/', views.CropCategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CropCategoryDetailView.as_view(), name='category-detail'),
]