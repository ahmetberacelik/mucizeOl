import api from './api';

export const requestService = {
  createRequest: async (data) => {
    const response = await api.post('/requests', data);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/requests/my-requests');
    return response.data;
  },

  getMyListingsRequests: async () => {
    const response = await api.get('/requests/my-listings-requests');
    return response.data;
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

