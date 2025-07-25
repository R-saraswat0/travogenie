import axios from './axiosInstance';

export const fetchCityImages = async (cityId) => {
  try {
    const response = await axios.get(`/api/cities/${cityId}/images`); // Adjust to match your API
    return response.data;
  } catch (error) {
    console.error(`Error fetching images for city ${cityId}:`, error);
    throw error;
  }
};
