import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeImage from '../components/SafeImage';
import apiService from '../services/api';
import { Product } from '../types';

const MarketplaceScreen: React.FC = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadProducts = async () => {
    try {
      const data = await apiService.getAllProducts();
      setProducts(data);
    } catch (error: any) {
      Alert.alert('Ошибка', 'Не удалось загрузить продукты');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail' as never, { product } as never);
  };

  const categories = [
    { id: 'All', name: 'Все', icon: 'grid-outline' },
    { id: 'crop', name: 'Культуры', icon: 'leaf-outline' },
    { id: 'item', name: 'Товары', icon: 'bag-outline' },
    { id: 'machinery', name: 'Техника', icon: 'construct-outline' },
  ];

  const filteredProducts = products.filter(product => {
    // Поиск по названию продукта, фермы и описанию
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchLower) ||
      product.farm.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower);
    
    // Фильтр по категории
    const matchesCategory = selectedCategory === 'All' || product.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'All') return products.length;
    return products.filter(product => product.type === categoryId).length;
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: () => navigation.navigate('Login' as never)
        }
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <SafeImage
        imagePath={item.image}
        style={styles.productImage}
        placeholderText="Нет изображения"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.farmName} numberOfLines={1}>
          {item.farm.name}
        </Text>
        {item.price ? (
          <Text style={styles.price}>{item.price} ₽</Text>
        ) : (
          <Text style={styles.noPrice}>Цена не указана</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>AgroBhos</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск продуктов..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Категории</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.id ? '#FFFFFF' : '#4CAF50'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
              <View style={[
                styles.categoryCount,
                selectedCategory === category.id && styles.categoryCountActive
              ]}>
                <Text style={[
                  styles.categoryCountText,
                  selectedCategory === category.id && styles.categoryCountTextActive
                ]}>
                  {getCategoryCount(category.id)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.productCount}>
        {searchQuery.length > 0 || selectedCategory !== 'All' 
          ? `Найдено: ${filteredProducts.length} ${filteredProducts.length === 1 ? 'продукт' : 'продуктов'}`
          : `Всего: ${filteredProducts.length} ${filteredProducts.length === 1 ? 'продукт' : 'продуктов'}`
        }
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {searchQuery.length > 0 || selectedCategory !== 'All' ? (
        <>
          <Ionicons name="search-outline" size={64} color="#9E9E9E" />
          <Text style={styles.emptyText}>
            {searchQuery.length > 0 
              ? `По запросу "${searchQuery}" ничего не найдено`
              : `В категории "${categories.find(c => c.id === selectedCategory)?.name}" нет продуктов`
            }
          </Text>
          <TouchableOpacity 
            style={styles.clearFiltersButton} 
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            <Text style={styles.clearFiltersText}>Очистить фильтры</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Ionicons name="basket-outline" size={64} color="#9E9E9E" />
          <Text style={styles.emptyText}>Продукты не найдены</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadProducts}>
            <Text style={styles.refreshButtonText}>Обновить</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка продуктов...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
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
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  cartButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  categoryCount: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  categoryCountActive: {
    backgroundColor: '#FFFFFF',
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#757575',
  },
  categoryCountTextActive: {
    color: '#4CAF50',
  },
  productCount: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 16,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    width: '100%',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  farmName: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  noPrice: {
    fontSize: 12,
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  clearFiltersButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MarketplaceScreen; 