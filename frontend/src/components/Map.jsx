import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#1E90FF"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <circle cx="12.5" cy="12.5" r="3" fill="#1E90FF"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Travel destinations with coordinates
  const destinations = [
    {
      id: 1,
      name: 'Bali, Indonesia',
      coordinates: [-8.3405, 115.0920],
      price: '₹35,999',
      duration: '7 Days',
      rating: '4.8',
      description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur']
    },
    {
      id: 2,
      name: 'Paris, France',
      coordinates: [48.8566, 2.3522],
      price: '₹39,999',
      duration: '5 Days',
      rating: '4.9',
      description: 'City of love with iconic landmarks, world-class cuisine, and rich history',
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées']
    },
    {
      id: 3,
      name: 'Tokyo, Japan',
      coordinates: [35.6762, 139.6503],
      price: '₹42,999',
      duration: '6 Days',
      rating: '4.7',
      description: 'Modern metropolis blending traditional culture with cutting-edge technology',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Mount Fuji', 'Harajuku District']
    },
    {
      id: 4,
      name: 'Maldives',
      coordinates: [3.2028, 73.2207],
      price: '₹47,999',
      duration: '5 Days',
      rating: '4.9',
      description: 'Luxury overwater villas in crystal-clear lagoons',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      highlights: ['Overwater Bungalows', 'Coral Reefs', 'Water Sports', 'Spa Treatments']
    },
    {
      id: 5,
      name: 'Swiss Alps, Switzerland',
      coordinates: [46.5197, 8.0512],
      price: '₹49,999',
      duration: '8 Days',
      rating: '4.8',
      description: 'Breathtaking mountain landscapes and alpine adventures',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      highlights: ['Jungfraujoch', 'Matterhorn', 'Lake Geneva', 'Skiing & Hiking']
    },
    {
      id: 6,
      name: 'Santorini, Greece',
      coordinates: [36.3932, 25.4615],
      price: '₹43,999',
      duration: '6 Days',
      rating: '4.6',
      description: 'Stunning sunsets, white-washed buildings, and volcanic landscapes',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400',
      highlights: ['Oia Sunset', 'Red Beach', 'Fira Town', 'Wine Tasting']
    }
  ];

  const handleMarkerClick = (destination) => {
    setSelectedDestination(destination);
    if (mapRef) {
      mapRef.setView(destination.coordinates, 8);
    }
  };

  const resetView = () => {
    setSelectedDestination(null);
    setSearchQuery('');
    setSearchResults([]);
    if (mapRef) {
      mapRef.setView([20, 0], 2);
    }
  };

  // Search for places using Nominatim API
  const searchPlace = async (query) => {
    if (!query || !query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchPlace(query);
    }, 500);
  };

  // Handle search result selection
  const handleSearchSelect = (result) => {
    if (!result || !result.lat || !result.lon) {
      return;
    }
    
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    if (isNaN(lat) || isNaN(lon)) {
      return;
    }
    
    if (mapRef) {
      mapRef.setView([lat, lon], 10);
    }
    
    setSearchQuery(result.display_name || 'Unknown location');
    setSearchResults([]);
    setSelectedDestination({
      id: 'search-result',
      name: result.display_name || 'Search Result',
      coordinates: [lat, lon],
      description: 'Search result location',
      price: 'Custom',
      duration: 'Flexible',
      rating: 'N/A'
    });
  };

  // Filter destinations based on search
  const filteredDestinations = destinations?.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="map-page">
      {/* Header Section */}
      <div className="map-header">
        <div className="header-content">
          <h1>🗺️ Interactive World Map</h1>
          <p>Discover amazing destinations around the globe</p>
          
          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search for any place in the world..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <div className="search-icon">🔍</div>
                {isSearching && <div className="search-loading">⏳</div>}
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults && searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="search-result-item"
                      onClick={() => handleSearchSelect(result)}
                    >
                      <div className="result-icon">📍</div>
                      <div className="result-text">
                        <div className="result-name">{result.display_name}</div>
                        <div className="result-type">{result.type || 'Location'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button className="reset-btn" onClick={resetView}>
            🌍 Reset View
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="map-main">
        <div className="map-container">
          <div className="map-wrapper">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
              className="leaflet-map"
              ref={setMapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredDestinations.map((destination) => (
                <Marker
                  key={destination.id}
                  position={destination.coordinates}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(destination)
                  }}
                >
                  <Popup>
                    <div className="popup-content">
                      <h3>{destination.name}</h3>
                      <p>{destination.description}</p>
                      <div className="popup-details">
                        <span className="price">{destination.price}</span>
                        <span className="duration">{destination.duration}</span>
                        <span className="rating">⭐ {destination.rating}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Search Result Marker */}
              {selectedDestination && selectedDestination.id === 'search-result' && (
                <Marker
                  position={selectedDestination.coordinates}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="popup-content">
                      <h3>📍 Search Result</h3>
                      <p>{selectedDestination.name}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        <div className="sidebar">
          {selectedDestination ? (
            <div className="destination-details">
              {selectedDestination.image && (
                <div className="destination-image">
                  <img src={selectedDestination.image} alt={selectedDestination.name} />
                </div>
              )}
              <div className="destination-info">
                <h2>{selectedDestination.name}</h2>
                <p className="description">{selectedDestination.description}</p>
                
                {selectedDestination.highlights && (
                  <div className="highlights-section">
                    <h3>🌟 Highlights</h3>
                    <ul className="highlights-list">
                      {selectedDestination.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pricing-section">
                  <div className="price-item">
                    <span className="label">Price</span>
                    <span className="value price">{selectedDestination.price}</span>
                  </div>
                  <div className="price-item">
                    <span className="label">Duration</span>
                    <span className="value">{selectedDestination.duration}</span>
                  </div>
                  <div className="price-item">
                    <span className="label">Rating</span>
                    <span className="value rating">⭐ {selectedDestination.rating}</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="book-btn" onClick={() => window.location.href = '/packages'}>
                    📋 Book Now
                  </button>
                  <button className="details-btn" onClick={() => window.location.href = '/packages'}>
                    ℹ️ View Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="guide-panel">
              <div className="guide-header">
                <div className="guide-icon">🧭</div>
                <h2>Explore Destinations</h2>
                <p>Click on any marker to discover amazing places</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Destinations</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">4.8★</div>
                  <div className="stat-label">Avg Rating</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">₹35K+</div>
                  <div className="stat-label">Starting From</div>
                </div>
              </div>

              <div className="popular-section">
                <h3>🔥 Popular Destinations</h3>
                <div className="popular-list">
                  {destinations?.slice(0, 3).map((destination) => (
                    <div 
                      key={destination.id}
                      className="popular-item"
                      onClick={() => handleMarkerClick(destination)}
                    >
                      <div className="popular-info">
                        <span className="popular-name">{destination.name}</span>
                        <span className="popular-price">{destination.price}</span>
                      </div>
                      <span className="popular-rating">⭐ {destination.rating}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tips-section">
                <h3>💡 Tips</h3>
                <div className="tips-list">
                  <div className="tip-item">
                    <span className="tip-icon">🎯</span>
                    <span>Click markers for details</span>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">🔍</span>
                    <span>Zoom to explore regions</span>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">📱</span>
                    <span>Mobile friendly interface</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tour Places Showcase */}
      <div className="tour-places-section">
        <div className="places-header">
          <h2>🌍 Discover Amazing Places</h2>
          <p>Explore breathtaking landscapes and iconic destinations around the world</p>
        </div>
        <div className="places-grid">
          <div className="place-card">
            <div className="place-image">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" alt="Maldives" />
              <div className="place-overlay">
                <div className="place-badge">🏝️ Tropical Paradise</div>
              </div>
            </div>
            <div className="place-info">
              <h3>Maldives Islands</h3>
              <p className="place-description">Crystal clear waters, overwater bungalows, and pristine white sand beaches make this a perfect romantic getaway destination.</p>
              <div className="place-features">
                <span className="feature">🏖️ Private Beaches</span>
                <span className="feature">🐠 Coral Reefs</span>
                <span className="feature">🌅 Sunset Views</span>
              </div>
              <div className="place-stats">
                <div className="stat">26°C</div>
                <div className="stat">1,192 Islands</div>
                <div className="stat">Best: Nov-Apr</div>
              </div>
            </div>
          </div>

          <div className="place-card">
            <div className="place-image">
              <img src="https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800" alt="Paris" />
              <div className="place-overlay">
                <div className="place-badge">🗼 City of Love</div>
              </div>
            </div>
            <div className="place-info">
              <h3>Paris, France</h3>
              <p className="place-description">The romantic capital with iconic landmarks, world-class museums, charming cafes, and rich cultural heritage spanning centuries.</p>
              <div className="place-features">
                <span className="feature">🗼 Eiffel Tower</span>
                <span className="feature">🎨 Louvre Museum</span>
                <span className="feature">☕ Café Culture</span>
              </div>
              <div className="place-stats">
                <div className="stat">15°C</div>
                <div className="stat">2.1M Population</div>
                <div className="stat">Best: Apr-Jun</div>
              </div>
            </div>
          </div>

          <div className="place-card">
            <div className="place-image">
              <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800" alt="Tokyo" />
              <div className="place-overlay">
                <div className="place-badge">🏙️ Modern Metropolis</div>
              </div>
            </div>
            <div className="place-info">
              <h3>Tokyo, Japan</h3>
              <p className="place-description">A fascinating blend of ultra-modern technology and traditional culture, featuring ancient temples alongside futuristic skyscrapers.</p>
              <div className="place-features">
                <span className="feature">🏯 Ancient Temples</span>
                <span className="feature">🍣 Authentic Cuisine</span>
                <span className="feature">🌸 Cherry Blossoms</span>
              </div>
              <div className="place-stats">
                <div className="stat">16°C</div>
                <div className="stat">14M Population</div>
                <div className="stat">Best: Mar-May</div>
              </div>
            </div>
          </div>

          <div className="place-card">
            <div className="place-image">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" alt="Swiss Alps" />
              <div className="place-overlay">
                <div className="place-badge">⛰️ Alpine Adventure</div>
              </div>
            </div>
            <div className="place-info">
              <h3>Swiss Alps</h3>
              <p className="place-description">Majestic mountain peaks, pristine lakes, charming villages, and world-class skiing resorts offer breathtaking alpine experiences.</p>
              <div className="place-features">
                <span className="feature">🎿 Skiing</span>
                <span className="feature">🚠 Cable Cars</span>
                <span className="feature">🏔️ Matterhorn</span>
              </div>
              <div className="place-stats">
                <div className="stat">8°C</div>
                <div className="stat">4,478m Peak</div>
                <div className="stat">Best: Dec-Mar</div>
              </div>
            </div>
          </div>

          <div className="place-card">
            <div className="place-image">
              <img src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800" alt="Bali" />
              <div className="place-overlay">
                <div className="place-badge">🌺 Island Paradise</div>
              </div>
            </div>
            <div className="place-info">
              <h3>Bali, Indonesia</h3>
              <p className="place-description">Tropical paradise with lush rice terraces, ancient Hindu temples, vibrant culture, and stunning volcanic landscapes.</p>
              <div className="place-features">
                <span className="feature">🌾 Rice Terraces</span>
                <span className="feature">🛕 Hindu Temples</span>
                <span className="feature">🌋 Volcanoes</span>
              </div>
              <div className="place-stats">
                <div className="stat">28°C</div>
                <div className="stat">4.3M Population</div>
                <div className="stat">Best: Apr-Oct</div>
              </div>
            </div>
          </div>

          <div className="place-card">
            <div className="place-image">
              <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800" alt="Santorini" />
              <div className="place-overlay">
                <div className="place-badge">🌅 Sunset Paradise</div>
              </div>
            </div>
            <div className="place-info">
              <h3>Santorini, Greece</h3>
              <p className="place-description">Iconic white-washed buildings, dramatic cliff views, world-famous sunsets, and rich volcanic history create magical experiences.</p>
              <div className="place-features">
                <span className="feature">🏛️ Ancient Ruins</span>
                <span className="feature">🍷 Wine Tasting</span>
                <span className="feature">🌊 Volcanic Beaches</span>
              </div>
              <div className="place-stats">
                <div className="stat">22°C</div>
                <div className="stat">15,550 Population</div>
                <div className="stat">Best: Apr-Nov</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;