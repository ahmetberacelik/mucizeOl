import api from './api';

export const messageService = {
  sendMessage: async (data) => {
    console.log('messageService.sendMessage çağrılıyor:', data);
    try {
      const response = await api.post('/messages', data);
      console.log('messageService.sendMessage başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('messageService.sendMessage hatası:', error);
      throw error;
    }
  },

  getConversation: async (conversationId, userId) => {
    console.log('messageService.getConversation çağrılıyor:', conversationId, userId);
    try {
      // Gateway otomatik olarak X-User-Id header'ını ekliyor, manuel eklemeye gerek yok
      const response = await api.get(`/messages/conversations/${conversationId}`);
      console.log('messageService.getConversation başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('messageService.getConversation hatası:', error);
      throw error;
    }
  },

  getConversations: async () => {
    console.log('messageService.getConversations çağrılıyor');
    try {
      const response = await api.get('/messages/conversations');
      console.log('messageService.getConversations başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('messageService.getConversations hatası:', error);
      throw error;
    }
  },

  markAsRead: async (conversationId) => {
    console.log('messageService.markAsRead çağrılıyor:', conversationId);
    try {
      await api.post(`/messages/conversations/${conversationId}/read`);
      console.log('messageService.markAsRead başarılı');
    } catch (error) {
      console.error('messageService.markAsRead hatası:', error);
      throw error;
    }
  },
};

