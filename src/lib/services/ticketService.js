import api from '$lib/axios';

export const ticketService = {
  // 1. Upload tiket
  uploadTicket: async (formData) => {
    try {
      const response = await api.post('/tickets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading ticket:', error);
      throw error;
    }
  },

  // 2. Melihat tiket milik sendiri
  getMyTickets: async () => {
    try {
      const response = await api.get('/tickets');
      return response.data;
    } catch (error) {
      console.error('Error fetching my tickets:', error);
      throw error;
    }
  },

  // 3. Melihat detail tiket milik sendiri
  getTicketDetail: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket detail:', error);
      throw error;
    }
  }
};
