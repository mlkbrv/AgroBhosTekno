import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../services/api';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <View style={styles.cartItem}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
    </View>
    
    <View style={styles.itemActions}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(item.object_id, item.content_type, item.quantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(item.object_id, item.content_type, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.object_id, item.content_type)}
      >
        <Text style={styles.removeButtonText}>Удалить</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.itemTotal}>
      Итого: ${item.price * item.quantity}
    </Text>
  </View>
);

const CartScreen = ({ navigation }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsForOrder,
    clearCart,
  } = useCart();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Корзина пуста', 'Добавьте товары в корзину для оформления заказа');
      return;
    }

    Alert.alert(
      'Оформить заказ',
      `Общая сумма: $${getCartTotal()}\n\nПодтвердить заказ?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Подтвердить',
          onPress: async () => {
            setIsLoading(true);
            try {
              const orderItems = getCartItemsForOrder();
              await ordersAPI.createOrder(orderItems);
              
              Alert.alert(
                'Успех',
                'Заказ успешно оформлен!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      clearCart();
                      navigation.navigate('Orders');
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Error creating order:', error);
              Alert.alert('Ошибка', 'Не удалось оформить заказ');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <CartItem
      item={item}
      onUpdateQuantity={updateQuantity}
      onRemove={removeFromCart}
    />
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Корзина пуста</Text>
        <Text style={styles.emptyText}>
          Добавьте товары в корзину для оформления заказа
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.shopButtonText}>Перейти к товарам</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Корзина</Text>
        <Text style={styles.subtitle}>
          {cartItems.length} товаров на сумму ${getCartTotal()}
        </Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => `${item.content_type}-${item.object_id}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Итого:</Text>
          <Text style={styles.totalAmount}>${getCartTotal()}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, isLoading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'right',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CartScreen; 