import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { businessAPI } from '../services/api';

const AddProductScreen = ({ route, navigation }) => {
  const { farm } = route.params;
  const [selectedType, setSelectedType] = useState('crop');
  const [isLoading, setIsLoading] = useState(false);
  
  // Общие поля для всех типов продуктов
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState('');
  
  // Поля для урожая (crop)
  const [stock, setStock] = useState('');
  const [predictedYield, setPredictedYield] = useState('');
  
  // Поля для товаров (item)
  const [category, setCategory] = useState('');
  
  // Поля для техники (machinery)
  const [producer, setProducer] = useState('');
  const [isNew, setIsNew] = useState(true);

  const productTypes = [
    { id: 'crop', name: 'Урожай', icon: '🌱' },
    { id: 'item', name: 'Товар', icon: '📦' },
    { id: 'machinery', name: 'Техника', icon: '🚜' },
  ];

  const pickImage = async () => {
    // Запрашиваем разрешение на доступ к галерее
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходимо разрешение на доступ к галерее');
      return;
    }

    // Открываем галерею
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Запрашиваем разрешение на доступ к камере
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходимо разрешение на доступ к камере');
      return;
    }

    // Открываем камеру
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
      setImageUri(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Выберите изображение',
      'Откуда вы хотите выбрать изображение?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Камера',
          onPress: takePhoto,
        },
        {
          text: 'Галерея',
          onPress: pickImage,
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните обязательные поля');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректную цену');
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        name: name.trim(),
        price: priceValue,
        description: description.trim(),
        image: imageUri, // Используем URI изображения
        farm: farm.id,
      };

      // Добавляем специфичные поля в зависимости от типа продукта
      if (selectedType === 'crop') {
        if (stock.trim()) {
          productData.stock = parseInt(stock);
        }
        if (predictedYield.trim()) {
          productData.predicted_yield = parseFloat(predictedYield);
        }
      } else if (selectedType === 'item') {
        if (category.trim()) {
          productData.category = category.trim();
        }
      } else if (selectedType === 'machinery') {
        if (producer.trim()) {
          productData.producer = producer.trim();
        }
        productData.is_new = isNew;
      }

      let response;
      switch (selectedType) {
        case 'crop':
          response = await businessAPI.addCrop(productData);
          break;
        case 'item':
          response = await businessAPI.addItem(productData);
          break;
        case 'machinery':
          response = await businessAPI.addMachinery(productData);
          break;
        default:
          throw new Error('Неизвестный тип продукта');
      }

      Alert.alert(
        'Успех',
        'Продукт успешно добавлен на ферму!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Ошибка', 'Не удалось добавить продукт');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Тип продукта</Text>
      <View style={styles.typeSelector}>
        {productTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              selectedType === type.id && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <Text
              style={[
                styles.typeText,
                selectedType === type.id && styles.typeTextActive,
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCommonFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Основная информация</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Название *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Введите название продукта"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Цена ($) *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Описание</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Описание продукта"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Изображение</Text>
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={showImagePicker}
            >
              <Text style={styles.changeImageText}>Изменить</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={showImagePicker}
          >
            <Text style={styles.imagePickerText}>📷 Выбрать изображение</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCropFields = () => (
    selectedType === 'crop' && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Информация об урожае</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Количество в наличии</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Прогнозируемый урожай (кг)</Text>
          <TextInput
            style={styles.input}
            value={predictedYield}
            onChangeText={setPredictedYield}
            placeholder="0.0"
            keyboardType="numeric"
          />
        </View>
      </View>
    )
  );

  const renderItemFields = () => (
    selectedType === 'item' && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Информация о товаре</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Категория</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Например: Инструменты, Семена"
          />
        </View>
      </View>
    )
  );

  const renderMachineryFields = () => (
    selectedType === 'machinery' && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Информация о технике</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Производитель</Text>
          <TextInput
            style={styles.input}
            value={producer}
            onChangeText={setProducer}
            placeholder="Название производителя"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Состояние</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                isNew && styles.radioButtonActive,
              ]}
              onPress={() => setIsNew(true)}
            >
              <Text
                style={[
                  styles.radioText,
                  isNew && styles.radioTextActive,
                ]}
              >
                Новый
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.radioButton,
                !isNew && styles.radioButtonActive,
              ]}
              onPress={() => setIsNew(false)}
            >
              <Text
                style={[
                  styles.radioText,
                  !isNew && styles.radioTextActive,
                ]}
              >
                Б/у
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Добавить продукт</Text>
        <Text style={styles.subtitle}>Ферма: {farm.name}</Text>
      </View>

      {renderTypeSelector()}
      {renderCommonFields()}
      {renderCropFields()}
      {renderItemFields()}
      {renderMachineryFields()}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Добавить продукт</Text>
          )}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeTextActive: {
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  radioButtonActive: {
    backgroundColor: '#4CAF50',
  },
  radioText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  radioTextActive: {
    color: '#ffffff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePickerText: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  changeImageButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changeImageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddProductScreen; 