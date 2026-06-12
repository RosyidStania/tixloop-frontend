import api from '$lib/axios';

export const marketplaceService = {
  // 1. Browse Listings
  getListings: async (params = {}) => {
    try {
      const response = await api.get('/marketplace/listings', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      throw error;
    }
  },

  // 2. Listing Detail
  getListingDetail: async (id) => {
    try {
      const response = await api.get(`/marketplace/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing detail:', error);
      throw error;
    }
  },

  // 3. Create Listing
  createListing: async (data) => {
    try {
      const response = await api.post('/marketplace/listings', data);
      return response.data;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  // 4. Checkout Listing
  checkoutListing: async (id) => {
    try {
      const response = await api.post(`/marketplace/listings/${id}/checkout`);
      return response.data;
    } catch (error) {
      console.error('Error on checkout:', error);
      throw error;
    }
  },

  // 5. My Listings
  getMyListings: async (params = {}) => {
    try {
      const response = await api.get('/marketplace/my-listings', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching my listings:', error);
      throw error;
    }
  }
};
