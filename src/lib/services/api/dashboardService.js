import api from '$lib/axios';

export const dashboardService = {
  // Get waste dashboard metrics
  getWasteMetrics: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/waste', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching waste metrics:', error);
      throw error;
    }
  },

  // Get burn prevention metrics (authenticated gives user-specific data)
  getBurnPreventionMetrics: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/burn-prevention', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching burn prevention metrics:', error);
      throw error;
    }
  }
};
