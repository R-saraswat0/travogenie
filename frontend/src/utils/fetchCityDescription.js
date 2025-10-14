import axios from './axiosInstance';

const validateCityId = (cityId) => {
  if (!cityId || typeof cityId !== 'string' && typeof cityId !== 'number') {
    throw new Error('Invalid city ID');
  }
  const sanitized = String(cityId).replace(/[^a-zA-Z0-9-_]/g, '');
  if (sanitized.length === 0 || sanitized.length > 50) {
    throw new Error('Invalid city ID format');
  }
  return sanitized;
};

export const fetchCityDescription = async (cityId) => {
  try {
    const validatedId = validateCityId(cityId);
    const response = await axios.get(`/api/cities/${validatedId}/description`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching description for city ${cityId}:`, error);
    throw error;
  }
};
