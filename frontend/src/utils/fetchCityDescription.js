import axios from './axiosInstance';

export const fetchCityDescription = async (cityId) => {
  try {
    const response = await axios.get(`/api/cities/${cityId}/description`); // Adjust as needed
    return response.data;
  } catch (error) {
    console.error(`Error fetching description for city ${cityId}:`, error);
    throw error;
  }
};
