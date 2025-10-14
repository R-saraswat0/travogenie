import { useEffect, useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { fetchDestinations, searchDestinations } from '../services/travelApi';
import { useNavigate } from 'react-router-dom';

function Destination() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();
  const cardsPerPage = 12;

  // Load destinations on component mount
  useEffect(() => {
    loadDestinations();
  }, []);

  // Handle URL search params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearch(searchParam);
    }
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        handleSearch();
      } else {
        loadDestinations();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const response = await fetchDestinations();
      if (response.success) {
        setDestinations(response.data);
      }
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const response = await searchDestinations(search);
      if (response.success) {
        setDestinations(response.data);
        setPage(1); // Reset to first page
      }
    } catch (error) {
      console.error('Error searching destinations:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Filter and sort destinations
  const filteredDestinations = destinations
    .filter(d => {
      let matchesFilter = false;
      if (filter === 'all') {
        matchesFilter = true;
      } else if (filter === 'budget') {
        matchesFilter = d.price < 30000;
      } else if (filter === 'luxury') {
        matchesFilter = d.price >= 50000;
      }
      return matchesFilter;
    })
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'duration') return a.duration - b.duration;
      return 0;
    });

  const totalPages = Math.ceil(filteredDestinations.length / cardsPerPage);
  const paginatedDestinations = filteredDestinations.slice((page - 1) * cardsPerPage, page * cardsPerPage);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        padding: '80px 5% 40px',
        maxWidth: '100vw',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        background: 'none',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #1E90FF, #2ECC71)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Explore Destinations
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #1E90FF, #2ECC71)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Discover your perfect getaway from our curated collection
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '30px',
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: '12px',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: '0 0 320px',
            maxWidth: '320px',
            minWidth: '180px',
            marginRight: '64px',
            marginBottom: 0,
            alignSelf: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '14px 24px 14px 44px',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1.05rem',
              background: 'linear-gradient(90deg, #e3eafc 0%, #f8fafc 100%)',
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              color: '#2a4365',
              fontWeight: 500,
              outline: 'none',
              transition: 'box-shadow 0.3s, background 0.3s',
            }}
            onFocus={e => e.target.style.boxShadow = '0 0 0 3px #2a436580'}
            onBlur={e => e.target.style.boxShadow = '0 2px 8px rgba(44,62,80,0.10)'}
          />
          <FaSearch style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#2a4365',
            fontSize: '1.2rem',
            opacity: 0.7,
            pointerEvents: 'none'
          }} />
          {searchLoading && (
            <FaSpinner style={{
              position: 'absolute',
              right: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#2a4365',
              fontSize: '1.2rem',
              animation: 'spin 1s linear infinite'
            }} />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          {['all', 'budget', 'luxury'].map(type => {
            const colors = {
              all: '#2a4365',
              budget: '#38b2ac',
              luxury: '#d69e2e'
            };
            const isActive = filter === type;
            return (
              <button
                key={type}
                style={{
                  padding: '10px 28px',
                  border: 'none',
                  borderRadius: '26px',
                  background: isActive
                    ? colors[type]
                    : 'linear-gradient(90deg, #e3eafc 0%, #f8fafc 100%)',
                  color: isActive ? 'white' : colors[type],
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  letterSpacing: '0.5px',
                  boxShadow: isActive
                    ? `0 6px 20px ${colors[type]}40`
                    : '0 4px 16px rgba(44,62,80,0.10)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(.25,.8,.25,1)',
                  outline: 'none',
                  marginRight: type !== 'luxury' ? '0px' : '0',
                  filter: isActive ? 'brightness(1.05)' : 'none',
                }}
                onClick={() => setFilter(type)}
                onMouseEnter={e => {
                  e.target.style.transform = 'scale(1.10)';
                  e.target.style.boxShadow = `0 12px 32px ${colors[type]}60`;
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = isActive
                    ? `0 6px 20px ${colors[type]}40`
                    : '0 4px 16px rgba(44,62,80,0.10)';
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '30px',
            background: 'linear-gradient(90deg, #e3eafc 0%, #f8fafc 100%)',
            color: '#2a4365',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
            outline: 'none',
            cursor: 'pointer',
            transition: 'box-shadow 0.3s, background 0.3s',
            alignSelf: 'center',
          }}
          onFocus={e => e.target.style.boxShadow = '0 0 0 3px #2a436580'}
          onBlur={e => e.target.style.boxShadow = '0 2px 8px rgba(44,62,80,0.10)'}
          onMouseEnter={e => e.target.style.background = 'linear-gradient(90deg, #dbeafe 0%, #e3eafc 100%)'}
          onMouseLeave={e => e.target.style.background = 'linear-gradient(90deg, #e3eafc 0%, #f8fafc 100%)'}
        >
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rating</option>
          <option value="duration">Shortest Duration</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ 
                height: '200px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }}></div>
              <div style={{ padding: '20px' }}>
                <div style={{ height: '24px', width: '70%', marginBottom: '15px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                <div style={{ height: '16px', width: '90%', marginBottom: '20px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                <div style={{ height: '20px', width: '50%', background: '#f0f0f0', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div style={{ 
            width: '300px', 
            height: '200px', 
            background: '#f5f5f5', 
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px'
          }}>
            <FaMapMarkerAlt style={{ fontSize: '3rem', color: '#ccc' }} />
          </div>
          <h3 style={{ color: '#2a4365', marginBottom: '20px' }}>No destinations match your search</h3>
          <button 
            onClick={() => {
              setSearch('');
              setFilter('all');
              setSort('');
            }}
            style={{
              padding: '10px 25px',
              background: '#2a4365',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {paginatedDestinations.map((dest, i) => {
              const globalIndex = (page - 1) * cardsPerPage + i;
              return (
                <div
                  key={dest.id}
                  style={{
                    position: 'relative',
                    background: '#fff',
                    borderRadius: '14px',
                    boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.25s, transform 0.25s',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '340px',
                    border: '1px solid #e3eafc',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 8px 32px #1e90ff22';
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(44,62,80,0.08)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '14px', borderTopRightRadius: '14px', borderBottom: '1px solid #e3eafc' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: '100%',
                      height: '40%',
                      background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.2) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      padding: '0 12px',
                    }}>
                      <h3 style={{ color: '#fff', fontSize: '1.18rem', fontWeight: 700, margin: 0, textAlign: 'center', textShadow: '0 2px 8px #000' }}>{dest.name}</h3>
                      <div style={{ color: '#e3eafc', fontSize: '0.98rem', fontWeight: 500, marginTop: '4px', textAlign: 'center', textShadow: '0 1px 4px #000' }}>{dest.location}</div>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.08rem', marginTop: '6px', textShadow: '0 1px 4px #000' }}>₹{dest.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ padding: '18px 20px 12px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative' }}>
                    <button style={{
                        marginTop: '10px',
                        marginBottom: '18px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'block',
                        padding: '8px 22px',
                        background: 'rgba(30,144,255,0.85)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '22px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 2px 8px #1e90ff44',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        textAlign: 'center',
                        position: 'relative',
                        top: '10px',
                      }}
                      onClick={() => navigate(`/destination/${dest.id}`)}
                    >View Details</button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      <span style={{ fontWeight: 700, color: '#1E90FF', fontSize: '1.08rem' }}>₹{dest.price.toLocaleString()}</span>
                      <span style={{ fontSize: '0.98rem', color: '#718096', fontWeight: 500 }}>{dest.duration} days</span>
                      <span style={{ fontSize: '0.98rem', color: '#38b2ac', fontWeight: 700 }}>★ {dest.rating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{
                  padding: '10px 28px',
                  border: 'none',
                  borderRadius: '26px',
                  background: page === 1 ? '#e3eafc' : '#2a4365',
                  color: page === 1 ? '#aaa' : 'white',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.25s cubic-bezier(.25,.8,.25,1)',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  if (page !== 1) {
                    e.target.style.transform = 'scale(1.10)';
                    e.target.style.boxShadow = '0 12px 32px #2a436560';
                  }
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 16px rgba(44,62,80,0.10)';
                }}
              >
                Previous
              </button>
              <span style={{ 
                padding: '10px 20px', 
                color: '#2a4365', 
                fontWeight: 600,
                alignSelf: 'center'
              }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: '10px 28px',
                  border: 'none',
                  borderRadius: '26px',
                  background: page === totalPages ? '#e3eafc' : '#2a4365',
                  color: page === totalPages ? '#aaa' : 'white',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.25s cubic-bezier(.25,.8,.25,1)',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  if (page !== totalPages) {
                    e.target.style.transform = 'scale(1.10)';
                    e.target.style.boxShadow = '0 12px 32px #2a436560';
                  }
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 16px rgba(44,62,80,0.10)';
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Destination;