import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

const ProductCardWithQuantity = ({ product, onPress, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

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
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop';
      case 'item':
        return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop';
      case 'machinery':
        return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop';
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (quantity < 1) {
      Alert.alert('Ошибка', 'Количество должно быть больше 0');
      return;
    }
    
    // Создаем продукт с указанным количеством
    const productWithQuantity = {
      ...product,
      quantity: quantity,
    };
    
    onAddToCart(productWithQuantity);
    setQuantity(1); // Сбрасываем количество после добавления
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ 
          uri: product.image || getDefaultImage(product.type) 
        }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{getTypeLabel(product.type)}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>${product.price}</Text>
        </View>

        <View style={styles.quantitySection}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 8,
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeContainer: {
    alignSelf: 'flex-start',
  },
  type: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footer: {
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProductCardWithQuantity; 