import api from '../config/api';

// Аутентификация
export const authAPI = {
  login: (email, password) => api.post('/users/token/', { email, password }),
  register: (email, password, isBusinessOwner) => 
    api.post('/users/register/', { email, password, is_business_owner: isBusinessOwner }),
  refreshToken: (refresh) => api.post('/users/token/refresh/', { refresh }),
  getProfile: () => api.get('/users/profile/'),
};

// Продукты
export const productsAPI = {
  getAllProducts: () => api.get('/api/all/'),
  getCrop: (id) => api.get(`/api/crops/${id}/`),
  getItem: (id) => api.get(`/api/items/${id}/`),
  getMachinery: (id) => api.get(`/api/machinery/${id}/`),
};

// Фермы
export const farmsAPI = {
  getAllFarms: () => api.get('/api/farms/'),
  getFarm: (id) => api.get(`/api/farms/${id}/`),
  getFarmProducts: (id) => api.get(`/api/farms/${id}/products/`),
  getUserFarms: () => api.get('/api/user/farms/'),
};

// Заказы
export const ordersAPI = {
  createOrder: (items) => api.post('/orders/orders/', { items }),
  getUserOrders: () => api.get('/orders/orders/'),
};

// Управление продуктами (для владельцев бизнеса)
export const businessAPI = {
  addCrop: (data) => api.post('/api/user/crops/add/', data),
  addItem: (data) => api.post('/api/user/items/add/', data),
  addMachinery: (data) => api.post('/api/user/machinery/add/', data),
  updateCrop: (id, data) => api.put(`/api/crops/${id}/update/`, data),
  updateItem: (id, data) => api.put(`/api/items/${id}/update/`, data),
  updateMachinery: (id, data) => api.put(`/api/machinery/${id}/update/`, data),
  deleteCrop: (id) => api.delete(`/api/crops/${id}/delete/`),
  deleteItem: (id) => api.delete(`/api/items/${id}/delete/`),
  deleteMachinery: (id) => api.delete(`/api/machinery/${id}/delete/`),
}; 