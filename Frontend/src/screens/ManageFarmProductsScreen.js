import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { farmsAPI, businessAPI } from '../services/api';

const ManageFarmProductsScreen = ({ route, navigation }) => {
  const { farm } = route.params;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categories = [
    { id: 'all', name: 'Все', icon: '🌾' },
    { id: 'crop', name: 'Урожай', icon: '🌱' },
    { id: 'item', name: 'Товары', icon: '📦' },
    { id: 'machinery', name: 'Техника', icon: '🚜' },
  ];

  useEffect(() => {
    loadFarmProducts();
  }, []);

  useEffect(() => {
    filterByCategory(selectedCategory);
  }, [products, selectedCategory]);

  const loadFarmProducts = async () => {
    try {
      const response = await farmsAPI.getFarmProducts(farm.id);
      const productsData = response.data.results || response.data;
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error loading farm products:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить продукты фермы');
    } finally {
      setIsLoading(false);
    }
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.type === category);
      setFilteredProducts(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFarmProducts();
    setRefreshing(false);
  };

  const handleEditProduct = (product) => {
    navigation.navigate('EditProduct', { product, farm });
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Удалить продукт',
      `Вы уверены, что хотите удалить "${product.name}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              switch (product.type) {
                case 'crop':
                  await businessAPI.deleteCrop(product.id);
                  break;
                case 'item':
                  await businessAPI.deleteItem(product.id);
                  break;
                case 'machinery':
                  await businessAPI.deleteMachinery(product.id);
                  break;
                default:
                  throw new Error('Неизвестный тип продукта');
              }
              
              Alert.alert('Успех', 'Продукт удален');
              loadFarmProducts(); // Перезагружаем список
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Ошибка', 'Не удалось удалить продукт');
            }
          },
        },
      ]
    );
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

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{getTypeLabel(item.type)}</Text>
          </View>
        </View>
        
        <Text style={styles.productPrice}>${item.price}</Text>
        
        {item.description && (
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      
      <View style={styles.productActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditProduct(item)}
        >
          <Text style={styles.actionButtonText}>Изменить</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item)}
        >
          <Text style={styles.actionButtonText}>Удалить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => filterByCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Загрузка продуктов...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Управление продуктами</Text>
        <Text style={styles.farmName}>{farm.name}</Text>
        <Text style={styles.subtitle}>
          {filteredProducts.length} товаров
        </Text>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {filteredProducts.length === 0 && !isLoading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Продукты не найдены</Text>
          <Text style={styles.emptySubtext}>
            В этой категории пока нет товаров
          </Text>
        </View>
      )}

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  farmName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
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
  productInfo: {
    marginBottom: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
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
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ManageFarmProductsScreen; 