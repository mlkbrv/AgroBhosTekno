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
import { farmsAPI } from '../services/api';

const FarmDetailScreen = ({ route, navigation }) => {
  const { farm } = route.params;
  const [farmDetail, setFarmDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFarmDetail();
  }, []);

  const loadFarmDetail = async () => {
    try {
      const response = await farmsAPI.getFarm(farm.id);
      setFarmDetail(response.data);
    } catch (error) {
      console.error('Error loading farm detail:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить детали фермы');
    } finally {
      setIsLoading(false);
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
          uri: farmDetail?.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop'
        }}
        style={styles.farmImage}
        resizeMode="cover"
      />
      
      <View style={styles.header}>
        <Text style={styles.farmName}>{farm.name}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.location}>{farm.address}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {farmDetail ? (
          <>
            {farmDetail.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Описание</Text>
                <Text style={styles.description}>{farmDetail.description}</Text>
              </View>
            )}

            {farmDetail.owner && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Владелец</Text>
                <Text style={styles.owner}>
                  {farmDetail.owner.email || 'Email не указан'}
                  {farmDetail.owner.first_name && farmDetail.owner.last_name && 
                    ` (${farmDetail.owner.first_name} ${farmDetail.owner.last_name})`
                  }
                </Text>
              </View>
            )}

            {farmDetail.contact && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Контакты</Text>
                <Text style={styles.contact}>
                  {typeof farmDetail.contact === 'string' 
                    ? farmDetail.contact 
                    : JSON.stringify(farmDetail.contact)
                  }
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Загрузка деталей фермы...</Text>
          </View>
        )}

        <View style={styles.productsSection}>
          <View style={styles.productsHeader}>
            <Text style={styles.sectionTitle}>Продукты фермы</Text>
            <TouchableOpacity
              style={styles.loadProductsButton}
              onPress={() => navigation.navigate('FarmProducts', { farm })}
            >
              <Text style={styles.loadProductsButtonText}>
                Все продукты фермы
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsPreview}>
            <Text style={styles.previewText}>
              Просмотрите все доступные товары этой фермы, включая урожай, товары и технику
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {farmDetail.crops?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Урожай</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {farmDetail.items?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Товары</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {farmDetail.machines?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Техника</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  farmImage: {
    width: '100%',
    height: 200,
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
  farmName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    alignSelf: 'flex-start',
  },
  location: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  owner: {
    fontSize: 16,
    color: '#666',
  },
  contact: {
    fontSize: 16,
    color: '#666',
  },
  productsSection: {
    marginTop: 20,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadProductsButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loadProductsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    padding: 8,
  },
  productsPreview: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default FarmDetailScreen; 