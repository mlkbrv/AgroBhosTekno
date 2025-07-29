import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [productDetail, setProductDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProductDetail();
  }, []);

  const loadProductDetail = async () => {
    try {
      let response;
      switch (product.type) {
        case 'crop':
          response = await productsAPI.getCrop(product.id);
          break;
        case 'item':
          response = await productsAPI.getItem(product.id);
          break;
        case 'machinery':
          response = await productsAPI.getMachinery(product.id);
          break;
        default:
          throw new Error('Неизвестный тип продукта');
      }
      setProductDetail(response.data);
    } catch (error) {
      console.error('Error loading product detail:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить детали продукта');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      type: product.type,
      quantity: quantity,
    });
    Alert.alert('Успех', `Добавлено ${quantity} шт. в корзину за $${product.price * quantity}`);
    setQuantity(1); // Сбрасываем количество после добавления
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'crop':
        return 'Урожай';
      case 'item':
        return 'Товар';
      case 'machinery':
        return 'Техника';
      default:
        return type;
    }
  };

  const getDefaultImage = (type) => {
    switch (type) {
      case 'crop':
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop';
      case 'item':
        return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop';
      case 'machinery':
        return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ 
          uri: productDetail?.image || getDefaultImage(product.type) 
        }}
        style={styles.productImage}
        resizeMode="cover"
      />
      
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.type}>{getTypeLabel(product.type)}</Text>
        </View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>

      <View style={styles.content}>
        {productDetail ? (
          <>
            {productDetail.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Описание</Text>
                <Text style={styles.description}>{productDetail.description}</Text>
              </View>
            )}

            {productDetail.category && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Категория</Text>
                <Text style={styles.category}>
                  {typeof productDetail.category === 'string' 
                    ? productDetail.category 
                    : productDetail.category.name || 'Не указана'
                  }
                </Text>
              </View>
            )}

            {productDetail.farm && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ферма</Text>
                <Text style={styles.farm}>
                  {typeof productDetail.farm === 'string' 
                    ? productDetail.farm 
                    : productDetail.farm.name || 'Не указана'
                  }
                </Text>
              </View>
            )}

            {productDetail.stock && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>В наличии</Text>
                <Text style={styles.quantity}>{productDetail.stock} шт.</Text>
              </View>
            )}

            {productDetail.predicted_yield && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Прогнозируемый урожай</Text>
                <Text style={styles.quantity}>{productDetail.predicted_yield} кг</Text>
              </View>
            )}

            {productDetail.producer && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Производитель</Text>
                <Text style={styles.manufacturer}>{productDetail.producer}</Text>
              </View>
            )}

            {productDetail.is_new && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Состояние</Text>
                <Text style={styles.quantity}>
                  {productDetail.is_new ? 'Новый' : 'Б/у'}
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Загрузка деталей продукта...</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Количество:</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Добавить в корзину</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: 250,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  typeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  type: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  category: {
    fontSize: 16,
    color: '#666',
  },
  farm: {
    fontSize: 16,
    color: '#666',
  },
  quantity: {
    fontSize: 16,
    color: '#666',
  },
  manufacturer: {
    fontSize: 16,
    color: '#666',
  },
  model: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductDetailScreen; 