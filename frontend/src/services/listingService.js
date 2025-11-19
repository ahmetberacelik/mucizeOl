import api from './api';

export const listingService = {
  getListings: async (params = {}) => {
    console.log('getListings çağrılıyor, params:', params);
    const response = await api.get('/listings', { params });
    console.log('getListings yanıtı:', response.data);
    return response.data;
  },

  getListingById: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  getMyListings: async (params = {}) => {
    console.log('getMyListings çağrılıyor, params:', params);
    const response = await api.get('/listings/my-listings', { params });
    console.log('getMyListings yanıtı:', response.data);
    return response.data;
  },

  createListing: async (formData) => {
    const response = await api.post('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateListing: async (id, data) => {
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
  },

  deleteListing: async (id) => {
    await api.delete(`/listings/${id}`);
  },

  getCities: async () => {
    const response = await api.get('/meta/cities');
    return response.data;
  },

  getAnimalTypes: async () => {
    const response = await api.get('/meta/animal-types');
    return response.data;
  },

  getAnimalBreeds: async (typeId) => {
    const response = await api.get(`/meta/animal-types/${typeId}/breeds`);
    return response.data;
  },
};

