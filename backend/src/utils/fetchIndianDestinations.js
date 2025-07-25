// Fetch top Indian cities from GeoDB Cities API
export async function fetchIndianCities(limit = 6) {
  const response = await fetch(
    `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/IN/cities?limit=${limit}&sort=-population`,
    {
      headers: {
        'X-RapidAPI-Key': '9467c4c227msh826b80a64914732p1c735fjsnfa44341afb4b',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    }
  );
  const data = await response.json();
  // Defensive: if data.data is not an array, return []
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
}

// Fetch city image from Unsplash API
export async function fetchCityImage(cityName) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)}&client_id=Pb_MWkPquYqZqS_4ro_sj-emnnmdcCnw1nq5dn-YByo`
  );
  const data = await response.json();
  return data.results[0]?.urls?.regular || 'https://via.placeholder.com/300x200?text=Image+Not+Found';
}

// Generate mock price and rating
export function getMockPriceAndRating() {
  return {
    price: Math.floor(Math.random() * 4000 + 2000), // ₹2000-₹6000
    rating: (Math.random() * 1.5 + 3.5).toFixed(1) // 3.5-5.0
  };
}
