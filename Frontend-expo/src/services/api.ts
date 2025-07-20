import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Crop,
  Item,
  Machinery,
  Farm,
  CropCategory,
  Product,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../types';

const API_BASE_URL = 'http://192.168.1.70:8000'; // Ваш IP адрес

// Функция для получения полного URL изображения
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // Если путь уже полный URL, возвращаем как есть
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Иначе добавляем базовый URL API
  return `${API_BASE_URL}${imagePath}`;
};

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем токен к каждому запросу
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Обработка ошибок авторизации
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Попытка обновить токен
          const refreshToken = await AsyncStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
                refresh: refreshToken,
              });
              await AsyncStorage.setItem('access_token', response.data.access);
              error.config.headers.Authorization = `Bearer ${response.data.access}`;
              return this.api.request(error.config);
            } catch (refreshError) {
              // Если не удалось обновить токен, очищаем хранилище
              await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
              // Здесь можно добавить навигацию на экран входа
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Аутентификация
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/users/token/', credentials);
    await AsyncStorage.setItem('access_token', response.data.access);
    await AsyncStorage.setItem('refresh_token', response.data.refresh);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<{ user: User; message: string }> {
    const response = await this.api.post('/users/register/', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get('/users/profile/');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.patch('/users/profile/', userData);
    return response.data;
  }

  // Продукты
  async getAllProducts(): Promise<Product[]> {
    const response = await this.api.get('/api/all/');
    return response.data;
  }

  async getCrops(): Promise<Crop[]> {
    const response = await this.api.get('/api/crops/');
    return response.data;
  }

  async getCrop(id: number): Promise<Crop> {
    const response = await this.api.get(`/api/crops/${id}/`);
    return response.data;
  }

  async updateCrop(id: number, cropData: Partial<Crop>): Promise<Crop> {
    const response = await this.api.patch(`/api/crops/${id}/update/`, cropData);
    return response.data;
  }

  async getItems(): Promise<Item[]> {
    const response = await this.api.get('/api/items/');
    return response.data;
  }

  async getItem(id: number): Promise<Item> {
    const response = await this.api.get(`/api/items/${id}/`);
    return response.data;
  }

  async updateItem(id: number, itemData: Partial<Item>): Promise<Item> {
    const response = await this.api.patch(`/api/items/${id}/update/`, itemData);
    return response.data;
  }

  async getMachinery(): Promise<Machinery[]> {
    const response = await this.api.get('/api/machinery/');
    return response.data;
  }

  async getMachineryItem(id: number): Promise<Machinery> {
    const response = await this.api.get(`/api/machinery/${id}/`);
    return response.data;
  }

  async updateMachinery(id: number, machineryData: Partial<Machinery>): Promise<Machinery> {
    const response = await this.api.patch(`/api/machinery/${id}/update/`, machineryData);
    return response.data;
  }

  // Фермы
  async getFarms(): Promise<Farm[]> {
    const response = await this.api.get('/api/farms/');
    return response.data;
  }

  async getFarm(id: number): Promise<Farm> {
    const response = await this.api.get(`/api/farms/${id}/`);
    return response.data;
  }

  async updateFarm(id: number, farmData: Partial<Farm>): Promise<Farm> {
    const response = await this.api.patch(`/api/farms/${id}/update/`, farmData);
    return response.data;
  }

  // Категории
  async getCategories(): Promise<CropCategory[]> {
    const response = await this.api.get('/api/categories/');
    return response.data;
  }

  async getCategory(id: number): Promise<CropCategory> {
    const response = await this.api.get(`/api/categories/${id}/`);
    return response.data;
  }
}

export default new ApiService(); 