import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useAuth } from '../contexts/AuthContext';
import { getLocations } from '../services/api';

const MapScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await getLocations(token);
      console.log('API Response:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      
      // Убеждаемся, что locations - это массив
      let locationsData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          locationsData = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          locationsData = response.data.results;
        } else {
          console.log('Unexpected data structure:', response.data);
        }
      }
      
             console.log('Final locations data:', locationsData);
       
       // Логируем информацию о картинках
       locationsData.forEach((location, index) => {
         console.log(`Location ${index}:`, {
           name: location.farm.name,
           image: location.farm.image,
           imageType: typeof location.farm.image,
           hasImage: !!location.farm.image
         });
       });
       
       setLocations(locationsData);
    } catch (error) {
      console.error('Ошибка загрузки локаций:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить локации ферм');
      setLocations([]); // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  };

  const handleFarmPress = (location) => {
    // Передаем и ферму, и координаты
    setSelectedFarm({
      ...location.farm,
      lat: location.lat,
      lon: location.lon
    });
    setModalVisible(true);
  };

  const handleViewFarmDetails = () => {
    // Просто закрываем модальное окно, детали уже показаны
    setModalVisible(false);
  };

  const handleViewFarmProducts = () => {
    // Просто закрываем модальное окно, детали уже показаны
    setModalVisible(false);
  };

  if (loading) {
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
        <Text style={styles.headerTitle}>🗺️ Карта ферм</Text>
        <Text style={styles.headerSubtitle}>
          Нажмите на маркер для просмотра деталей фермы
        </Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 55.7558,
          longitude: 37.6176,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
                 {Array.isArray(locations) && locations.map((location, index) => (
           <Marker
             key={index}
             coordinate={{
               latitude: location.lat,
               longitude: location.lon,
             }}
             title={location.farm.name}
             description={location.farm.description}
             onPress={() => handleFarmPress(location)}
           >
             <View style={styles.customMarker}>
               <Text style={styles.markerText}>🏡</Text>
             </View>
                           <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{location.farm.name}</Text>
                  <Text style={styles.calloutDescription}>
                    {location.farm.description}
                  </Text>
                  <Text style={styles.calloutAddress}>
                    📍 {location.farm.address}
                  </Text>
                </View>
              </Callout>
           </Marker>
         ))}
      </MapView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
                         {selectedFarm && (
               <>
                 {selectedFarm.image && selectedFarm.image !== 'null' && (
                   <Image 
                     source={{ uri: selectedFarm.image }} 
                     style={styles.modalImage}
                     resizeMode="cover"
                     onError={(error) => console.log('Modal image error:', error)}
                   />
                 )}
                 <Text style={styles.modalTitle}>{selectedFarm.name}</Text>
                 <Text style={styles.modalDescription}>
                   {selectedFarm.description}
                 </Text>
                 <Text style={styles.modalAddress}>
                   📍 {selectedFarm.address}
                 </Text>
                
                                 <View style={styles.modalInfo}>
                   <Text style={styles.modalInfoTitle}>📍 Координаты:</Text>
                   <Text style={styles.modalInfoText}>
                     {selectedFarm.lat?.toFixed(4) || 'N/A'}, {selectedFarm.lon?.toFixed(4) || 'N/A'}
                   </Text>
                 </View>
                 
                                  <View style={styles.modalButtons}>
                   <TouchableOpacity
                     style={styles.closeButton}
                     onPress={() => setModalVisible(false)}
                   >
                     <Text style={styles.closeButtonText}>Закрыть</Text>
                   </TouchableOpacity>
                 </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100, // Учитываем header
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontSize: 20,
    color: 'white',
  },
  callout: {
    width: 200,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  calloutDescription: {
    fontSize: 11,
    color: '#666',
    marginBottom: 5,
  },
  calloutAddress: {
    fontSize: 9,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalAddress: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInfo: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalInfoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 3,
  },
  modalInfoText: {
    fontSize: 12,
    color: '#888',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 120,
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MapScreen; 