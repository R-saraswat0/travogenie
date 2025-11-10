import axiosInstance from '../utils/axiosInstance';

export const testimonialService = {
  // Get all testimonials
  getTestimonials: async () => {
    try {
      const response = await axiosInstance.get('/api/testimonials');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch testimonials' };
    }
  },

  // Create new testimonial
  createTestimonial: async (testimonialData) => {
    try {
      const response = await axiosInstance.post('/api/testimonials', testimonialData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create testimonial' };
    }
  }
};