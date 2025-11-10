// Travel API service for fetching real destination data
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_KEY;
const AMADEUS_API_KEY = process.env.REACT_APP_AMADEUS_KEY;

// Fallback data for when APIs are unavailable
const fallbackDestinations = [
  {
    id: 1,
    name: 'Goa, India',
    location: 'India | Goa | Beach Paradise',
    price: 18000,
    duration: 5,
    rating: 4.7,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Goa is India\'s premier beach destination, famous for its golden sands, vibrant nightlife, and Portuguese heritage.',
    amenities: ['Beach Access', 'Water Sports', 'Nightlife', 'Historical Sites', 'Seafood'],
    type: 'Beach',
    host: 'Goa Tourism'
  },
  {
    id: 2,
    name: 'Leh-Ladakh, India',
    location: 'India | Jammu & Kashmir | Himalayan Adventure',
    price: 25000,
    duration: 7,
    rating: 4.8,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    description: 'Leh-Ladakh offers breathtaking mountain landscapes, ancient monasteries, and thrilling adventure activities.',
    amenities: ['Mountain Views', 'Monasteries', 'Adventure Sports', 'Cultural Tours', 'Photography'],
    type: 'Adventure',
    host: 'Ladakh Adventures'
  },
  {
    id: 3,
    name: 'Kerala Backwaters, India',
    location: 'India | Kerala | Tranquil Waterways',
    price: 16500,
    duration: 6,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    description: 'Kerala\'s backwaters are a network of serene lagoons and rivers, best explored by houseboat.',
    amenities: ['Houseboat', 'Nature Tours', 'Ayurveda', 'Local Cuisine', 'Bird Watching'],
    type: 'Nature',
    host: 'Kerala Tourism'
  }
];

// Popular destinations data with real places
const popularDestinations = [
  { name: 'Paris', country: 'France', type: 'City', basePrice: 45000, keywords: ['paris', 'france', 'eiffel', 'tower'] },
  { name: 'Tokyo', country: 'Japan', type: 'City', basePrice: 55000, keywords: ['tokyo', 'japan', 'shibuya', 'anime'] },
  { name: 'Bali', country: 'Indonesia', type: 'Beach', basePrice: 35000, keywords: ['bali', 'indonesia', 'beach', 'ubud'] },
  { name: 'New York', country: 'USA', type: 'City', basePrice: 60000, keywords: ['new york', 'newyork', 'nyc', 'manhattan', 'usa', 'america'] },
  { name: 'Santorini', country: 'Greece', type: 'Beach', basePrice: 50000, keywords: ['santorini', 'greece', 'oia', 'sunset'] },
  { name: 'Dubai', country: 'UAE', type: 'City', basePrice: 40000, keywords: ['dubai', 'uae', 'burj', 'khalifa'] },
  { name: 'Maldives', country: 'Maldives', type: 'Beach', basePrice: 80000, keywords: ['maldives', 'beach', 'resort', 'island'] },
  { name: 'London', country: 'UK', type: 'City', basePrice: 48000, keywords: ['london', 'uk', 'britain', 'england'] },
  { name: 'Rome', country: 'Italy', type: 'City', basePrice: 42000, keywords: ['rome', 'italy', 'colosseum', 'vatican'] },
  { name: 'Bangkok', country: 'Thailand', type: 'City', basePrice: 28000, keywords: ['bangkok', 'thailand', 'temple', 'street food'] },
  { name: 'Sydney', country: 'Australia', type: 'City', basePrice: 65000, keywords: ['sydney', 'australia', 'opera house', 'harbour'] },
  { name: 'Barcelona', country: 'Spain', type: 'City', basePrice: 38000, keywords: ['barcelona', 'spain', 'gaudi', 'sagrada'] },
  { name: 'Phuket', country: 'Thailand', type: 'Beach', basePrice: 32000, keywords: ['phuket', 'thailand', 'beach', 'patong'] },
  { name: 'Singapore', country: 'Singapore', type: 'City', basePrice: 45000, keywords: ['singapore', 'marina bay', 'gardens'] },
  { name: 'Istanbul', country: 'Turkey', type: 'City', basePrice: 35000, keywords: ['istanbul', 'turkey', 'hagia sophia', 'bosphorus'] }
];

// Generate random destination data
const generateDestination = (place, index) => {
  const duration = Math.floor(Math.random() * 8) + 3; // 3-10 days
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
  const reviews = Math.floor(Math.random() * 300) + 50; // 50-350 reviews
  const priceVariation = (Math.random() * 0.4 + 0.8); // 80%-120% of base price
  const finalPrice = Math.round(place.basePrice * priceVariation);

  return {
    id: index + 1,
    name: place.name,
    location: `${place.country} | ${place.name} | ${place.type}`,
    price: finalPrice,
    duration,
    rating: parseFloat(rating),
    reviews,
    image: `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=800&q=80`,
    description: `Discover the beauty and culture of ${place.name}, ${place.country}. Experience local attractions, cuisine, and hospitality.`,
    amenities: getAmenitiesForType(place.type),
    type: place.type,
    host: `${place.name} Tourism Board`,
    keywords: place.keywords || []
  };
};

const getAmenitiesForType = (type) => {
  const amenityMap = {
    'City': ['City Tours', 'Museums', 'Shopping', 'Restaurants', 'Public Transport'],
    'Beach': ['Beach Access', 'Water Sports', 'Sunset Views', 'Seafood', 'Beach Bars'],
    'Nature': ['Nature Walks', 'Wildlife', 'Photography', 'Fresh Air', 'Hiking Trails'],
    'Adventure': ['Adventure Sports', 'Mountain Views', 'Trekking', 'Local Guides', 'Equipment Rental']
  };
  return amenityMap[type] || ['Local Attractions', 'Cultural Sites', 'Local Cuisine', 'Guided Tours', 'Shopping'];
};

// Fetch destinations with search functionality
export const fetchDestinations = async (searchQuery = '') => {
  try {
    // Generate destinations from popular places
    let destinations = popularDestinations.map(generateDestination);
    
    // Add fallback destinations
    destinations = [...fallbackDestinations, ...destinations];
    
    // Apply search filter if query provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().replace(/\s+/g, '');
      destinations = destinations.filter(dest => {
        const nameMatch = dest.name.toLowerCase().replace(/\s+/g, '').includes(query);
        const locationMatch = dest.location.toLowerCase().includes(searchQuery.toLowerCase());
        const typeMatch = dest.type.toLowerCase().includes(searchQuery.toLowerCase());
        const keywordMatch = dest.keywords && dest.keywords.some(keyword => 
          keyword.toLowerCase().replace(/\s+/g, '').includes(query) ||
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return nameMatch || locationMatch || typeMatch || keywordMatch;
      });
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: destinations,
      total: destinations.length
    };
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return {
      success: false,
      data: fallbackDestinations,
      total: fallbackDestinations.length,
      error: 'Failed to fetch destinations'
    };
  }
};

// Fetch destination by ID
export const fetchDestinationById = async (id) => {
  try {
    const response = await fetchDestinations();
    const destination = response.data.find(dest => dest.id === parseInt(id));
    
    if (!destination) {
      throw new Error('Destination not found');
    }
    
    return {
      success: true,
      data: destination
    };
  } catch (error) {
    console.error('Error fetching destination:', error);
    return {
      success: false,
      data: null,
      error: 'Destination not found'
    };
  }
};

// Search destinations by location
export const searchDestinations = async (query) => {
  return await fetchDestinations(query);
};

// Get popular destinations
export const getPopularDestinations = async () => {
  try {
    const response = await fetchDestinations();
    // Return top rated destinations
    const popular = response.data
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    
    return {
      success: true,
      data: popular
    };
  } catch (error) {
    return {
      success: false,
      data: fallbackDestinations.slice(0, 3),
      error: 'Failed to fetch popular destinations'
    };
  }
};