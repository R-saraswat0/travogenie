// fetchCities.js
import axios from './axiosInstance';

export const fetchCities = async () => {
  try {
    const response = await axios.get('/api/cities');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    return [];
  }
};
