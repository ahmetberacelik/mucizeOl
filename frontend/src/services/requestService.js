import api from './api';

export const requestService = {
  createRequest: async (data) => {
    console.log('requestService.createRequest çağrılıyor:', data);
    try {
      const response = await api.post('/requests', data);
      console.log('requestService.createRequest başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('requestService.createRequest hatası:', error);
      throw error;
    }
  },

  getMyRequests: async () => {
    console.log('getMyRequests çağrılıyor');
    try {
      const response = await api.get('/requests/my-requests');
      console.log('getMyRequests başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('getMyRequests hatası:', error);
      throw error;
    }
  },

  getMyListingsRequests: async () => {
    console.log('getMyListingsRequests çağrılıyor');
    try {
      const response = await api.get('/requests/my-listings-requests');
      console.log('getMyListingsRequests başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('getMyListingsRequests hatası:', error);
      throw error;
    }
  },

  approveRequest: async (id) => {
    const response = await api.post(`/requests/${id}/approve`);
    return response.data;
  },

  rejectRequest: async (id) => {
    const response = await api.post(`/requests/${id}/reject`);
    return response.data;
  },
};

