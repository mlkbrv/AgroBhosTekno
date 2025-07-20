import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import SafeImage from '../components/SafeImage';
import { Product } from '../types';

interface RouteParams {
  product: Product;
}

const ProductDetailScreen: React.FC = () => {
  const route = useRoute();
  const { product } = route.params as RouteParams;

  const handleContact = () => {
    Alert.alert(
      'Связаться с фермером',
      `Позвонить ${product.farm.owner.first_name} ${product.farm.owner.last_name}?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Позвонить',
          onPress: () => {
            // Здесь можно добавить логику звонка
            Alert.alert('Информация', 'Функция звонка будет добавлена позже');
          },
        },
      ]
    );
  };

  const getProductTypeText = (type: string) => {
    switch (type) {
      case 'crop':
        return 'Культура';
      case 'item':
        return 'Товар';
      case 'machinery':
        return 'Техника';
      default:
        return 'Продукт';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeImage
        imagePath={product.image}
        style={styles.productImage}
        placeholderText="Нет изображения"
        contentFit="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {getProductTypeText(product.type)}
            </Text>
          </View>
        </View>

        {product.price ? (
          <Text style={styles.price}>{product.price} ₽</Text>
        ) : (
          <Text style={styles.noPrice}>Цена не указана</Text>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Информация о ферме</Text>
          <View style={styles.farmInfo}>
            <Text style={styles.farmName}>{product.farm.name}</Text>
            <Text style={styles.farmAddress}>{product.farm.address}</Text>
            {product.farm.owner && (
              <Text style={styles.ownerName}>
                Владелец: {product.farm.owner.first_name} {product.farm.owner.last_name}
              </Text>
            )}
          </View>
        </View>

        {product.category && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Категория</Text>
            <Text style={styles.categoryName}>{product.category.name}</Text>
          </View>
        )}

        {product.producer && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Производитель</Text>
            <Text style={styles.producerName}>{product.producer}</Text>
          </View>
        )}

        {product.predicted_yield && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Прогнозируемый урожай</Text>
            <Text style={styles.yieldText}>{product.predicted_yield} кг</Text>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Наличие</Text>
          <View style={styles.stockInfo}>
            <Text style={styles.stockText}>
              В наличии: {product.stock} {product.type === 'crop' ? 'кг' : 'шт'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: product.in_stock ? '#4CAF50' : '#F44336' }]}>
              <Text style={styles.statusText}>
                {product.in_stock ? 'В наличии' : 'Нет в наличии'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Text style={styles.contactButtonText}>Связаться с фермером</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    height: 300,
    width: '100%',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 12,
  },
  typeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  noPrice: {
    fontSize: 16,
    color: '#9E9E9E',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  farmInfo: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  farmAddress: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  categoryName: {
    fontSize: 14,
    color: '#757575',
  },
  producerName: {
    fontSize: 14,
    color: '#757575',
  },
  yieldText: {
    fontSize: 14,
    color: '#757575',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
    color: '#757575',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen; 