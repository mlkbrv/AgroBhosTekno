import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');

const ProductCard = ({ product, onPress, onAddToCart }) => {
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
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => onAddToCart(product)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
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

export default ProductCard; 