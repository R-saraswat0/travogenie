import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { fetchDestinationById } from '../services/travelApi';

function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showReserve, setShowReserve] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const loadDestination = async () => {
      try {
        const response = await fetchDestinationById(id);
        if (response.success) {
          setDestination(response.data);
        } else {
          console.error('Destination not found');
        }
      } catch (error) {
        console.error('Error loading destination:', error);
      }
    };
    loadDestination();
  }, [id]);

  if (!destination) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  const pricePerNight = parseInt(destination.price || '5000');
  
  // Calculate nights based on selected dates
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };
  
  const nights = calculateNights();
  const total = pricePerNight * nights * guests;
  const taxes = Math.round(total * 0.12);
  const grandTotal = total + taxes;

  return (
    <div style={{
      maxWidth: 1200,
      margin: '80px auto 0',
      padding: 32,
      color: '#183153',
      background: 'linear-gradient(120deg, #f7faff 0%, #e3f9f4 100%)',
      borderRadius: 24,
      boxShadow: '0 4px 24px #1e90ff22',
      border: '1.5px solid #1E90FF33'
    }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#183153' }}>
        {destination.name || destination.title}
      </h1>
      <p style={{ fontSize: 17, color: '#1E90FF', marginBottom: 18 }}>
        {destination.location || destination.desc}
      </p>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ color: '#2ECC71', fontSize: 16, marginRight: 7 }}>★★★★★</div>
        <span style={{ fontSize: 15, color: '#1E90FF', fontWeight: 500 }}>
          {destination.rating} ({destination.reviews || 150} Reviews)
        </span>
      </div>

      {/* Image Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 10,
        height: 400,
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden'
      }}>
        <div style={{
          gridRow: 'span 2',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('${destination.image}')`
        }}></div>
        <div style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b')`
        }}></div>
        <div style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945')`
        }}></div>
        <div style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f')`
        }}></div>
        <div style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('https://images.unsplash.com/photo-1493809842364-78817add7ffb')`
        }}></div>
      </div>

      {/* Price Card */}
      <div style={{
        border: '1.5px solid #1E90FF33',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        maxWidth: 420,
        background: 'linear-gradient(90deg, #f7faff 60%, #e3f9f4 100%)',
        boxShadow: '0 2px 12px #1e90ff22'
      }}>
        <div style={{ fontSize: 23, fontWeight: 700, marginBottom: 16, color: '#183153' }}>
          ₹{pricePerNight.toLocaleString()} per night per guest
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 10 }}>
            <div style={{ border: '1px solid #ddd', padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#1E90FF' }}>CHECK-IN</div>
              <input 
                type="date" 
                value={checkIn} 
                onChange={(e) => setCheckIn(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: 14 }}
              />
            </div>
            <div style={{ border: '1px solid #ddd', padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#1E90FF' }}>CHECKOUT</div>
              <input 
                type="date" 
                value={checkOut} 
                onChange={(e) => setCheckOut(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: 14 }}
              />
            </div>
          </div>
          
          <div style={{ border: '1px solid #ddd', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#1E90FF' }}>GUESTS</div>
              <div>{guests} guest{guests > 1 ? 's' : ''}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => setGuests(Math.max(1, guests - 1))}
                style={{ width: 24, height: 24, border: '1px solid #1E90FF', borderRadius: '50%', background: 'white' }}
              >-</button>
              <button 
                onClick={() => setGuests(Math.min(8, guests + 1))}
                style={{ width: 24, height: 24, border: '1px solid #1E90FF', borderRadius: '50%', background: 'white' }}
              >+</button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowReserve(true)}
          style={{
            width: '100%',
            padding: 16,
            background: 'linear-gradient(90deg, #1E90FF 60%, #2ECC71 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Reserve ₹{grandTotal.toLocaleString()}
        </button>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 20 }}>
        <h2>About this place</h2>
        <p>{showMore ? destination.description : (destination.description?.slice(0, 200) + '...')}</p>
        {destination.description?.length > 200 && (
          <button 
            onClick={() => setShowMore(!showMore)}
            style={{ color: '#1E90FF', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {showMore ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Amenities */}
      {destination.amenities && (
        <div style={{ marginBottom: 20 }}>
          <h2>What this place offers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15 }}>
            {destination.amenities.map((amenity, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: 10 }}>✓</span>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reserve Modal */}
      {showReserve && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: 32,
            borderRadius: 16,
            maxWidth: 500,
            width: '90%',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowReserve(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}
            >×</button>
            
            <h2>Confirm and pay</h2>
            
            <div style={{ marginBottom: 20 }}>
              <label>Phone number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, marginTop: 8 }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3>Price breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>₹{pricePerNight.toLocaleString()} x {nights} nights x {guests} guests</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Taxes</span>
                <span>₹{taxes.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: 8 }}>
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (!phone) {
                  toast.error('Please enter your phone number');
                  return;
                }
                toast.success(`Booking confirmed! Total: ₹${grandTotal.toLocaleString()}`);
                setTimeout(() => setShowReserve(false), 2000);
              }}
              style={{
                width: '100%',
                padding: 16,
                background: 'linear-gradient(90deg, #1E90FF 60%, #2ECC71 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Confirm and Pay ₹{grandTotal.toLocaleString()}
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default DestinationDetail;