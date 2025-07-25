import axios from 'axios';

const GEO_API_HEADERS = {
  'X-RapidAPI-Key': 'your-rapidapi-key',
  'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
};

const UNSPLASH_CLIENT_ID = 'your-unsplash-client-id';

export async function fetchIndianCities(limit = 100) {
  try {
    const response = await axios.get(
      'https://wft-geo-db.p.rapidapi.com/v1/geo/countries/IN/cities',
      {
        params: {
          limit,
          sort: '-population',
        },
        headers: GEO_API_HEADERS,
      }
    );

    return response.data.data || [];
  } catch (error) {
    console.error('❌ Error fetching Indian cities:', error);
    return [];
  }
}

export async function fetchCityImage(cityName) {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: cityName,
        client_id: UNSPLASH_CLIENT_ID,
      },
    });

    return (
      response.data.results[0]?.urls?.regular ||
      'https://via.placeholder.com/300x200?text=Image+Not+Found'
    );
  } catch (error) {
    console.error(`❌ Error fetching image for ${cityName}:`, error);
    return 'https://via.placeholder.com/300x200?text=Image+Not+Found';
  }
}

export function getMockPriceAndRating() {
  return {
    price: Math.floor(Math.random() * 4000 + 2000),
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
  };
}
