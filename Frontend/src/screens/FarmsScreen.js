import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { farmsAPI } from '../services/api';

const FarmCard = ({ farm, onPress }) => (
  <TouchableOpacity style={styles.farmCard} onPress={onPress}>
    <Image
      source={{ 
        uri: farm.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=200&fit=crop'
      }}
      style={styles.farmImage}
      resizeMode="cover"
    />
    
    <View style={styles.farmContent}>
      <View style={styles.farmHeader}>
        <Text style={styles.farmName}>{farm.name}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.location}>{farm.address}</Text>
        </View>
      </View>
      
      <View style={styles.farmDetails}>
        {farm.description && (
          <Text style={styles.description} numberOfLines={2}>
            {farm.description}
          </Text>
        )}
        
        <View style={styles.farmStats}>
          <Text style={styles.statText}>
            Владелец: {farm.owner?.email || 'Не указан'}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const FarmsScreen = ({ navigation }) => {
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const response = await farmsAPI.getAllFarms();
      // API возвращает данные с пагинацией, нужно взять results
      const farmsData = response.data.results || response.data;
      setFarms(farmsData);
    } catch (error) {
      console.error('Error loading farms:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить фермы');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFarms();
    setRefreshing(false);
  };

  const handleFarmPress = (farm) => {
    navigation.navigate('FarmDetail', { farm });
  };

  const renderFarm = ({ item }) => (
    <FarmCard
      farm={item}
      onPress={() => handleFarmPress(item)}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Загрузка ферм...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Фермы</Text>
        <Text style={styles.subtitle}>
          {farms.length} ферм доступно
        </Text>
      </View>

      {farms.length === 0 && !isLoading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Фермы не найдены</Text>
          <Text style={styles.emptySubtext}>Попробуйте обновить страницу</Text>
        </View>
      )}

      <FlatList
        data={farms}
        renderItem={renderFarm}
        keyExtractor={(item) => item.id.toString()}
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
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  farmCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
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
  farmImage: {
    width: '100%',
    height: 150,
  },
  farmContent: {
    padding: 16,
  },
  farmHeader: {
    marginBottom: 12,
  },
  farmName: {
    fontSize: 18,
    fontWeight: '600',
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  farmDetails: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  farmStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
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

export default FarmsScreen; 