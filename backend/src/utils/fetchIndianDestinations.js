const ALLOWED_HOSTS = ['wft-geo-db.p.rapidapi.com', 'api.unsplash.com'];

function validateUrl(url) {
  try {
    const urlObj = new URL(url);
    if (!ALLOWED_HOSTS.includes(urlObj.hostname)) {
      throw new Error('Unauthorized host');
    }
    return true;
  } catch (error) {
    throw new Error('Invalid URL');
  }
}

// Fetch top Indian cities from GeoDB Cities API
export async function fetchIndianCities(limit = 6) {
  try {
    const sanitizedLimit = Math.min(Math.max(parseInt(limit) || 6, 1), 20);
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/IN/cities?limit=${sanitizedLimit}&sort=-population`;
    
    validateUrl(url);
    
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '9467c4c227msh826b80a64914732p1c735fjsnfa44341afb4b',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      },
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data || !Array.isArray(data.data)) {
      console.log('GeoDB API response error:', data);
      return [];
    }
    
    return data.data.map(city => ({
      name: city.name,
      region: city.region,
      country: city.country,
      population: city.population
    }));
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    return [];
  }
}

// Fetch city image from Unsplash API
export async function fetchCityImage(cityName) {
  try {
    if (!cityName || typeof cityName !== 'string') {
      throw new Error('Invalid city name');
    }
    
    const sanitizedCityName = cityName.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
    if (!sanitizedCityName) {
      throw new Error('Invalid city name after sanitization');
    }
    
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(sanitizedCityName)}&client_id=${process.env.UNSPLASH_ACCESS_KEY || 'Pb_MWkPquYqZqS_4ro_sj-emnnmdcCnw1nq5dn-YByo'}`;
    
    validateUrl(url);
    
    const response = await fetch(url, { timeout: 5000 });
    
    if (!response.ok) {
      throw new Error(`Unsplash API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results?.[0]?.urls?.regular || 'https://via.placeholder.com/300x200?text=Image+Not+Found';
  } catch (error) {
    console.error('Error fetching city image:', error.message);
    return 'https://via.placeholder.com/300x200?text=Image+Not+Found';
  }
}

// Generate mock price and rating
export function getMockPriceAndRating() {
  return {
    price: Math.floor(Math.random() * 4000 + 2000), // ₹2000-₹6000
    rating: (Math.random() * 1.5 + 3.5).toFixed(1) // 3.5-5.0
  };
}
