import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroImages = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200'
  ];

  const destinations = [
    { 
      name: 'Bali Paradise', 
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400', 
      price: '₹35,999',
      duration: '7 Days',
      rating: '4.8',
      description: 'Tropical beaches, ancient temples & rice terraces'
    },
    { 
      name: 'Paris Romance', 
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400', 
      price: '₹39,999',
      duration: '4 Days',
      rating: '4.9',
      description: 'City of love with iconic landmarks & cuisine'
    },
    { 
      name: 'Tokyo Culture', 
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', 
      price: '₹42,999',
      duration: '6 Days',
      rating: '4.7',
      description: 'Modern city meets traditional Japanese culture'
    },
    { 
      name: 'Maldives Luxury', 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 
      price: '₹47,999',
      duration: '5 Days',
      rating: '4.9',
      description: 'Overwater villas & crystal clear lagoons'
    },
    { 
      name: 'Swiss Alps', 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 
      price: '₹49,999',
      duration: '10 Days',
      rating: '4.8',
      description: 'Mountain adventures & breathtaking alpine views'
    },
    { 
      name: 'Greek Islands', 
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400', 
      price: '₹43,999',
      duration: '9 Days',
      rating: '4.6',
      description: 'Island hopping with stunning sunsets & history'
    }
  ];

  const features = [
    { icon: '🌍', title: 'Global Destinations', desc: 'Explore 100+ handpicked destinations across 6 continents with expert local guides' },
    { icon: '💰', title: 'Best Price Guarantee', desc: 'Unbeatable prices with transparent pricing - no hidden fees, ever!' },
    { icon: '🤖', title: 'AI Travel Assistant', desc: 'Smart chatbot with voice recognition to plan your perfect personalized trip' },
    { icon: '🛡️', title: 'Secure & Safe', desc: '100% secure bookings with instant confirmation and 24/7 emergency support' },
    { icon: '⭐', title: 'Premium Experience', desc: 'Luxury accommodations and exclusive experiences at affordable prices' },
    { icon: '📞', title: 'Expert Support', desc: 'Dedicated travel experts available round-the-clock for assistance' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-overlay" />
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">✈️ Your Dream Journey Starts Here</div>
          <h1 className="hero-title">
            Discover Amazing
            <span className="gradient-text"> Destinations</span>
          </h1>
          <p className="hero-subtitle">
            Experience the world like never before with our curated travel packages.
            From exotic beaches to mountain adventures - we've got it all!
          </p>
          <div className="hero-buttons">
            <Link to="/packages" className="btn-secondary">
              🌟 Explore Destinations
            </Link>
            <Link to="/packages" className="btn-secondary">
              📋 Plan My Trip
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Travelers</span>
            </div>
            <div className="stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Destinations</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #f8fafc, #e3eafc)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', background: 'linear-gradient(135deg, #1E90FF, #2ECC71)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>About TravoGenie</h2>
          <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 3rem' }}>
            TravoGenie is your trusted travel companion, offering curated travel experiences across the globe. 
            With our AI-powered platform and expert travel consultants, we make your dream vacation a reality 
            at unbeatable prices.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>50K+</div>
              <div style={{ fontSize: '1.1rem', color: '#1E90FF', fontWeight: '600' }}>Happy Travelers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>100+</div>
              <div style={{ fontSize: '1.1rem', color: '#1E90FF', fontWeight: '600' }}>Destinations</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>4.9★</div>
              <div style={{ fontSize: '1.1rem', color: '#1E90FF', fontWeight: '600' }}>Customer Rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>24/7</div>
              <div style={{ fontSize: '1.1rem', color: '#1E90FF', fontWeight: '600' }}>Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div style={{ padding: '4rem 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', background: 'linear-gradient(135deg, #1E90FF, #2ECC71)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Our Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(30,144,255,0.1), rgba(46,204,113,0.1))', padding: '2rem', borderRadius: '15px', textAlign: 'center', border: '2px solid rgba(30,144,255,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#1E90FF' }}>International Tours</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Explore amazing destinations worldwide with our carefully crafted tour packages</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(30,144,255,0.1), rgba(46,204,113,0.1))', padding: '2rem', borderRadius: '15px', textAlign: 'center', border: '2px solid rgba(30,144,255,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#1E90FF' }}>AI Travel Assistant</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Get personalized recommendations with our smart AI chatbot</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(30,144,255,0.1), rgba(46,204,113,0.1))', padding: '2rem', borderRadius: '15px', textAlign: 'center', border: '2px solid rgba(30,144,255,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#1E90FF' }}>Best Prices</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Guaranteed lowest prices with transparent booking and no hidden fees</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/packages" style={{ background: 'linear-gradient(135deg, #1E90FF, #2ECC71)', color: 'white', padding: '1rem 2rem', borderRadius: '25px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 8px 25px rgba(30,144,255,0.3)' }}>View All Packages</Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for Your Next Adventure?</h2>
            <p>Join thousands of travelers who trust TravoGenie for their dream vacations</p>
            <div className="cta-buttons">
              <Link to="/packages" className="btn-primary">Browse Packages</Link>
              <Link to="/auth" className="btn-outline">Sign Up Free</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;