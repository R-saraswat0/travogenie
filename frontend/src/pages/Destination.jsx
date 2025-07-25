import { useEffect, useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const mockDestinations = [
  // Indian destinations (featured at top)
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Goa, India',
    desc: 'India | Goa | Beach Paradise',
    price: '₹18,000',
    duration: 5,
    rating: 4.7,
    details: 'Goa is India’s premier beach destination, famous for its golden sands, vibrant nightlife, and Portuguese heritage. Top attractions include Baga Beach, Anjuna Flea Market, Fort Aguada, Basilica of Bom Jesus, and Dudhsagar Falls. Enjoy water sports, seafood, and the laid-back charm of coastal villages.'
  },
  {
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    title: 'Leh-Ladakh, India',
    desc: 'India | Jammu & Kashmir | Himalayan Adventure',
    price: '₹25,000',
    duration: 7,
    rating: 4.8,
    details: 'Leh-Ladakh offers breathtaking mountain landscapes, ancient monasteries, and thrilling adventure activities. Must-see spots include Pangong Lake, Nubra Valley, Magnetic Hill, Thiksey Monastery, and Khardung La Pass. Experience the unique culture of the high Himalayas.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    title: 'Kerala Backwaters, India',
    desc: 'India | Kerala | Tranquil Waterways',
    price: '₹16,500',
    duration: 6,
    rating: 4.6,
    details: 'Kerala’s backwaters are a network of serene lagoons and rivers, best explored by houseboat. Highlights include Alleppey, Kumarakom, Vembanad Lake, and the tranquil village life. Enjoy lush greenery, traditional Kathakali performances, and the unique flavors of Kerala cuisine.'
  },
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    title: 'Agra, India',
    desc: 'India | Uttar Pradesh | Taj Mahal City',
    price: '₹12,000',
    duration: 3,
    rating: 4.9,
    details: 'Agra is home to the iconic Taj Mahal, a UNESCO World Heritage site. Other top attractions include Agra Fort, Fatehpur Sikri, Mehtab Bagh, and the Tomb of Itimad-ud-Daulah (Baby Taj). Discover Mughal history and enjoy the city’s rich architectural legacy.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465378553266-2c1f7b37a6a6',
    title: 'Udaipur, India',
    desc: 'India | Rajasthan',
    price: '₹14,500',
    duration: 4,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92',
    title: 'Darjeeling, India',
    desc: 'India | West Bengal',
    price: '₹13,000',
    duration: 5,
    rating: 4.6
  },
  {
    image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1',
    title: 'Mysore, India',
    desc: 'India | Karnataka',
    price: '₹11,000',
    duration: 3,
    rating: 4.5
  },
  {
    image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
    title: 'Rishikesh, India',
    desc: 'India | Uttarakhand',
    price: '₹10,500',
    duration: 4,
    rating: 4.6
  },
  {
    image: 'https://images.unsplash.com/photo-1465378553266-2c1f7b37a6a6',
    title: 'Jaipur, India',
    desc: 'India | Rajasthan',
    price: '₹13,500',
    duration: 4,
    rating: 4.7
  },
  // ...existing code...
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    title: 'Santorini, Greece',
    desc: 'Europe | Fira | Whitewashed Paradise',
    price: '₹1800',
    duration: 5,
    rating: 4.9,
    details: 'Santorini is famous for its stunning sunsets, whitewashed buildings, and blue-domed churches perched above the Aegean Sea. Enjoy romantic walks in Oia, volcanic beaches, and world-class Mediterranean cuisine.'
  },
  {
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    title: 'Kyoto, Japan',
    desc: 'Asia | Kyoto | Ancient Temples',
    price: '₹2100',
    duration: 8,
    rating: 4.7,
    details: 'Kyoto is the heart of traditional Japan, home to centuries-old temples, tranquil gardens, and vibrant geisha districts. Experience cherry blossoms, tea ceremonies, and the beauty of Arashiyama Bamboo Grove.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101178521-c1a4c5267f7b?auto=format&fit=crop&w=800&q=80',
    title: 'Paris, France',
    desc: 'Europe | Paris | City of Lights',
    price: '₹1500',
    duration: 6,
    rating: 4.6,
    details: 'Paris enchants with its iconic Eiffel Tower, world-class museums, and charming cafes. Stroll along the Seine, visit the Louvre, and savor French pastries in Montmartre.'
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Maldives',
    desc: 'Asia | Malé | Tropical Bliss',
    price: '₹2500',
    duration: 7,
    rating: 4.9,
    details: 'The Maldives is a paradise of turquoise waters, coral reefs, and luxurious overwater villas. Perfect for snorkeling, diving, and romantic escapes on private islands.'
  },
  {
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
    title: 'New York, USA',
    desc: 'North America | NYC | The Big Apple',
    price: '₹1700',
    duration: 5,
    rating: 4.5,
    details: 'New York City dazzles with its skyscrapers, Broadway shows, and world-famous landmarks. Explore Central Park, Times Square, and the vibrant neighborhoods of Manhattan.'
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Rome, Italy',
    desc: 'Europe | Rome',
    price: '₹1600',
    duration: 6,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
    title: 'Sydney, Australia',
    desc: 'Oceania | Sydney',
    price: '₹2200',
    duration: 9,
    rating: 4.6
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Cape Town, South Africa',
    desc: 'Africa | Cape Town',
    price: '₹1900',
    duration: 8,
    rating: 4.8
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Rio de Janeiro, Brazil',
    desc: 'South America | Rio',
    price: '₹1400',
    duration: 7,
    rating: 4.5
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Dubai, UAE',
    desc: 'Middle East | Dubai',
    price: '₹2300',
    duration: 5,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Barcelona, Spain',
    desc: 'Europe | Barcelona',
    price: '₹1350',
    duration: 5,
    rating: 4.6
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Bangkok, Thailand',
    desc: 'Asia | Bangkok',
    price: '₹950',
    duration: 6,
    rating: 4.4
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Venice, Italy',
    desc: 'Europe | Venice',
    price: '₹1750',
    duration: 4,
    rating: 4.8
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Machu Picchu, Peru',
    desc: 'South America | Cusco',
    price: '₹1650',
    duration: 8,
    rating: 4.9
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Istanbul, Turkey',
    desc: 'Eurasia | Istanbul',
    price: '₹1250',
    duration: 5,
    rating: 4.6
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Queenstown, New Zealand',
    desc: 'Oceania | Queenstown',
    price: '₹2400',
    duration: 10,
    rating: 4.8
  },
  {
  image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
  title: 'Amalfi Coast, Italy',
  desc: 'Europe | Campania',
  price: '₹1950',
  duration: 7,
  rating: 4.9
},
{
  image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
  title: 'Phuket, Thailand',
  desc: 'Asia | Phuket',
  price: '₹1100',
  duration: 6,
  rating: 4.5
},
{
  image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
  title: 'Prague, Czech Republic',
  desc: 'Europe | Prague',
  price: '₹1250',
  duration: 5,
  rating: 4.7
},
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Swiss Alps, Switzerland',
    desc: 'Europe | Alps',
    price: '₹2800',
    duration: 7,
    rating: 4.9
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Bali, Indonesia',
    desc: 'Indonesia | Bali | Paradise Island',
    price: '₹1200',
    duration: 7,
    rating: 4.8,
    details: 'Bali is renowned for its lush landscapes, vibrant culture, and stunning beaches. Experience the magic of Ubud’s rice terraces, the spiritual serenity of ancient temples, and the lively beach clubs of Seminyak. Perfect for relaxation, adventure, and cultural immersion.'
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Vancouver, Canada',
    desc: 'North America | BC',
    price: '₹1850',
    duration: 6,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Siem Reap, Cambodia',
    desc: 'Asia | Angkor',
    price: '₹950',
    duration: 5,
    rating: 4.5
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Edinburgh, Scotland',
    desc: 'Europe | Scotland',
    price: '₹1550',
    duration: 5,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Zermatt, Switzerland',
    desc: 'Europe | Matterhorn',
    price: '₹2600',
    duration: 6,
    rating: 4.9
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Hawaii, USA',
    desc: 'Oceania | Pacific',
    price: '₹2300',
    duration: 8,
    rating: 4.8
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Petra, Jordan',
    desc: 'Middle East | Ma\'an',
    price: '₹1650',
    duration: 7,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Lisbon, Portugal',
    desc: 'Europe | Lisbon',
    price: '₹1400',
    duration: 5,
    rating: 4.6
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Great Barrier Reef, Australia',
    desc: 'Oceania | Queensland',
    price: '₹2450',
    duration: 9,
    rating: 4.8
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Budapest, Hungary',
    desc: 'Europe | Budapest',
    price: '₹1200',
    duration: 4,
    rating: 4.5
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Galápagos Islands, Ecuador',
    desc: 'South America | Pacific',
    price: '₹2900',
    duration: 10,
    rating: 4.9
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Cairo, Egypt',
    desc: 'Africa | Cairo',
    price: '₹1350',
    duration: 6,
    rating: 4.5
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Reykjavik, Iceland',
    desc: 'Europe | Iceland',
    price: '₹2100',
    duration: 7,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Banff, Canada',
    desc: 'North America | Alberta',
    price: '₹1950',
    duration: 7,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    title: 'Zanzibar, Tanzania',
    desc: 'Africa | Zanzibar',
    price: '₹2100',
    duration: 8,
    rating: 4.7
  },
  {
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4',
    title: 'Hanoi, Vietnam',
    desc: 'Asia | Hanoi',
    price: '₹1100',
    duration: 6,
    rating: 4.5
  }
];

function Destination() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const cardsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDestinations(mockDestinations);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Helper to parse price string (handles ₹ and $)
  function parsePrice(price) {
    if (!price) return 0;
    // Remove non-digit characters
    return parseInt(price.replace(/[^\d]/g, '')) || 0;
  }

  const filteredDestinations = destinations
    .filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
      let matchesFilter = false;
      if (filter === 'all') {
        matchesFilter = true;
      } else if (filter === 'budget') {
        matchesFilter = parsePrice(d.price) < 1500;
      } else if (filter === 'luxury') {
        matchesFilter = parsePrice(d.price) >= 2000;
      }
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === 'price-low') return parsePrice(a.price) - parsePrice(b.price);
      if (sort === 'price-high') return parsePrice(b.price) - parsePrice(a.price);
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
          className="destination-heading-animate"
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
          className="destination-subtitle-animate"
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
              setSort(null);
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
                  key={`${filter}-${search}-${globalIndex}`}
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
                    <img src={dest.image} alt={dest.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '14px', borderTopRightRadius: '14px', borderBottom: '1px solid #e3eafc' }} />
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
                      <h3 style={{ color: '#fff', fontSize: '1.18rem', fontWeight: 700, margin: 0, textAlign: 'center', textShadow: '0 2px 8px #000' }}>{dest.title}</h3>
                      <div style={{ color: '#e3eafc', fontSize: '0.98rem', fontWeight: 500, marginTop: '4px', textAlign: 'center', textShadow: '0 1px 4px #000' }}>{dest.desc}</div>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.08rem', marginTop: '6px', textShadow: '0 1px 4px #000' }}>{dest.price}</span>
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
                      onClick={() => window.location.href = `/destination/${globalIndex}`}
                    >View Details</button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      <span style={{ fontWeight: 700, color: '#1E90FF', fontSize: '1.08rem' }}>{dest.price}</span>
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
      `}</style>
    </div>
  );
}

export default Destination;