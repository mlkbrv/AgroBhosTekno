import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { farmsAPI } from '../services/api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [userFarms, setUserFarms] = useState([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(false);

  useEffect(() => {
    if (user?.is_business_owner) {
      loadUserFarms();
    }
  }, [user]);

  const loadUserFarms = async () => {
    setIsLoadingFarms(true);
    try {
      const response = await farmsAPI.getUserFarms();
      // API возвращает данные с пагинацией, нужно взять results
      const farmsData = response.data.results || response.data;
      setUserFarms(farmsData);
    } catch (error) {
      console.error('Error loading user farms:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить ваши фермы');
    } finally {
      setIsLoadingFarms(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleFarmPress = (farm) => {
    navigation.navigate('FarmDetail', { farm });
  };

  const handleAddProduct = (farm) => {
    navigation.navigate('AddProduct', { farm });
  };

  const handleManageProducts = (farm) => {
    navigation.navigate('ManageFarmProducts', { farm });
  };

  const renderFarm = ({ item }) => (
    <View style={styles.farmCard}>
      <View style={styles.farmHeader}>
        <Text style={styles.farmName}>{item.name}</Text>
        <Text style={styles.farmLocation}>{item.address}</Text>
      </View>
      
      <View style={styles.farmActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleFarmPress(item)}
        >
          <Text style={styles.actionButtonText}>Просмотр</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.addProductButton]}
          onPress={() => handleAddProduct(item)}
        >
          <Text style={styles.actionButtonText}>Добавить</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.manageButton]}
          onPress={() => handleManageProducts(item)}
        >
          <Text style={styles.actionButtonText}>Управление</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.userTypeContainer}>
            <Text style={styles.userType}>
              {user?.is_business_owner ? 'Владелец бизнеса' : 'Покупатель'}
            </Text>
          </View>
        </View>
      </View>

      {user?.is_business_owner && (
        <View style={styles.businessSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Мои фермы</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadUserFarms}
              disabled={isLoadingFarms}
            >
              <Text style={styles.refreshButtonText}>
                {isLoadingFarms ? 'Загрузка...' : 'Обновить'}
              </Text>
            </TouchableOpacity>
          </View>

          {isLoadingFarms ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Загрузка ферм...</Text>
            </View>
          ) : userFarms.length > 0 ? (
            <FlatList
              data={userFarms}
              renderItem={renderFarm}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.farmsList}
            />
          ) : (
            <View style={styles.emptyFarms}>
              <Text style={styles.emptyText}>У вас пока нет ферм</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
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
  },
  profileSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileInfo: {
    alignItems: 'center',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  userTypeContainer: {
    alignSelf: 'flex-start',
  },
  userType: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  businessSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  farmsList: {
    padding: 0,
  },
  farmCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  farmHeader: {
    marginBottom: 12,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  farmLocation: {
    fontSize: 14,
    color: '#666',
  },
  farmActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  addProductButton: {
    backgroundColor: '#2196F3',
  },
  manageButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyFarms: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  actionsSection: {
    margin: 16,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 