import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.70:8000';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок и обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

                        try {
                    const refreshToken = await AsyncStorage.getItem('refreshToken');
                    if (refreshToken) {
                      const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
                        refresh: refreshToken,
                      });

          const { access } = response.data;
          await AsyncStorage.setItem('accessToken', access);

          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Если обновление токена не удалось, очищаем хранилище
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export default api; 