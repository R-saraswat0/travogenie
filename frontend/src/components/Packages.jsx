import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Packages.css';

const Packages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    destination: '',
    minPrice: '',
    maxPrice: '',
    duration: '',
    category: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [filters, packages]);

  const filterPackages = () => {
    let filtered = packages;
    
    if (filters.search) {
      filtered = filtered.filter(pkg => 
        pkg.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        pkg.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(pkg => pkg.category === filters.category);
    }
    
    if (filters.destination) {
      filtered = filtered.filter(pkg => 
        pkg.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(pkg => (pkg.pricing?.adult || pkg.price?.basePrice) >= parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(pkg => (pkg.pricing?.adult || pkg.price?.basePrice) <= parseInt(filters.maxPrice));
    }
    
    setFilteredPackages(filtered);
  };

  const fetchPackages = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:5001/api/packages`);
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages || []);
        setFilteredPackages(data.packages || []);
      } else {
        setPackages([]);
        setFilteredPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
      setFilteredPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  if (loading) return <div className="loading">Loading packages...</div>;

  return (
    <div className="packages-container">
      <h1>Travel Packages</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search packages..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        <input
          type="text"
          placeholder="Destination"
          value={filters.destination}
          onChange={(e) => setFilters({...filters, destination: e.target.value})}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="Adventure">Adventure</option>
          <option value="Cultural">Cultural</option>
          <option value="Beach">Beach</option>
          <option value="Wildlife">Wildlife</option>
          <option value="Honeymoon">Honeymoon</option>
          <option value="Family">Family</option>
        </select>
      </div>

      <div className="packages-grid">
        {filteredPackages.map(pkg => (
          <div key={pkg._id} className="package-card">
            <img src={pkg.images[0]?.url || '/placeholder.jpg'} alt={pkg.title} />
            <div className="package-info">
              <h3>{pkg.title}</h3>
              <p className="destination">{pkg.destination}</p>
              <p className="description">{pkg.description}</p>
              <div className="package-details">
                <span className="duration">{pkg.duration?.days || pkg.duration} days</span>
                <span className="price">₹{(pkg.pricing?.adult || pkg.price?.basePrice || pkg.basePrice).toLocaleString('en-IN')}</span>
              </div>
              <div className="package-features">
                {pkg.inclusions.slice(0, 3).map((inclusion, idx) => (
                  <span key={idx} className="feature">✓ {inclusion}</span>
                ))}
              </div>
              <button 
                className="book-btn"
                onClick={() => handleViewDetails(pkg._id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;