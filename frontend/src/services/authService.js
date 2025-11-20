import api from './api';
import { tokenManager } from '../utils/tokenManager';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken } = response.data;
    
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
    
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(newRefreshToken);
    
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getUserById: async (userId) => {
    console.log('authService.getUserById çağrılıyor, userId:', userId);
    try {
      const response = await api.get(`/auth/users/${userId}`);
      console.log('authService.getUserById başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('authService.getUserById hatası:', error);
      console.error('Hata detayları:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  },
};

