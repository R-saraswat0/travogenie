import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './PackageDetail.css';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchPackage();
    loadRazorpayScript();
  }, [id]);

  useEffect(() => {
    calculatePrice();
  }, [guests, nights, packageData]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/packages/${id}`);
      const data = await response.json();
      if (data.success) {
        setPackageData(data.package);
      }
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!packageData) return;
    const packageNights = packageData.duration?.nights || 1;
    const nightMultiplier = nights / packageNights;
    
    const basePrice = (packageData.pricing?.adult || 0) * guests.adults * nightMultiplier;
    const childPrice = (packageData.pricing?.child || 0) * guests.children * nightMultiplier;
    const infantPrice = (packageData.pricing?.infant || 0) * guests.infants * nightMultiplier;
    
    setTotalPrice(Math.round(basePrice + childPrice + infantPrice));
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to book this package');
      return;
    }

    if (!selectedDate) {
      alert('Please select a travel date');
      return;
    }

    try {
      // Step 1: Create booking
      const bookingData = {
        packageId: id,
        travelers: guests.adults + guests.children + guests.infants,
        startDate: selectedDate,
        pricing: {
          totalAmount: totalPrice,
          breakdown: {
            adults: guests.adults,
            children: guests.children,
            infants: guests.infants,
            nights: nights
          }
        }
      };
      
      const bookingResponse = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      const bookingResult = await bookingResponse.json();
      
      if (!bookingResult.success) {
        alert(bookingResult.message || 'Booking failed');
        return;
      }

      const bookingId = bookingResult.booking._id;

      // Step 2: Create payment order
      const paymentResponse = await fetch('http://localhost:5001/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: bookingId,
          amount: totalPrice
        })
      });

      const paymentResult = await paymentResponse.json();
      console.log('Payment response:', paymentResult);
      
      if (!paymentResult.success) {
        alert(`Payment initialization failed: ${paymentResult.message || 'Unknown error'}`);
        return;
      }

      // Step 3: Initialize Payment (Demo or Razorpay)
      if (paymentResult.key === 'rzp_test_demo') {
        // Demo mode - simulate payment success
        const confirmPayment = window.confirm(`Demo Payment: ₹${totalPrice.toLocaleString('en-IN')}\n\nClick OK to simulate successful payment`);
        
        if (confirmPayment) {
          try {
            const verifyResponse = await fetch('http://localhost:5001/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResult.orderId,
                razorpay_payment_id: 'demo_payment_123',
                razorpay_signature: 'demo_signature',
                bookingId: bookingId
              })
            });

            const verifyResult = await verifyResponse.json();
            
            if (verifyResult.success) {
              alert('Payment successful! Your booking is confirmed.');
              navigate('/bookings');
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed');
          }
        }
      } else {
        // Real Razorpay mode
        const options = {
          key: paymentResult.key,
          amount: paymentResult.amount,
          currency: paymentResult.currency,
          name: 'TravOgenie',
          description: `Booking for ${packageData.title}`,
          order_id: paymentResult.orderId,
          handler: async function (response) {
            try {
              const verifyResponse = await fetch('http://localhost:5001/api/payment/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId: bookingId
                })
              });

              const verifyResult = await verifyResponse.json();
              
              if (verifyResult.success) {
                alert('Payment successful! Your booking is confirmed.');
                navigate('/bookings');
              } else {
                alert('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email
          },
          theme: {
            color: '#1E90FF'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading package details...</div>;
  if (!packageData) return <div className="error">Package not found</div>;

  return (
    <div className="package-detail">
      <button className="back-btn" onClick={() => navigate('/packages')}>
        ← Back to Packages
      </button>

      <div className="package-header">
        <div className="package-images">
          <img src={packageData.images[0]?.url} alt={packageData.title} className="main-image" />
          <div className="image-gallery">
            {packageData.images.slice(1, 4).map((img, idx) => (
              <img key={idx} src={img.url} alt={img.caption} />
            ))}
          </div>
        </div>
        
        <div className="package-info">
          <h1>{packageData.title}</h1>
          <p className="destination">📍 {packageData.destination}</p>
          <p className="description">{packageData.description}</p>
          
          <div className="package-highlights">
            <div className="highlight">
              <span className="label">Duration:</span>
              <span>{packageData.duration?.days} days, {packageData.duration?.nights} nights</span>
            </div>
            <div className="highlight">
              <span className="label">Category:</span>
              <span>{packageData.category}</span>
            </div>
            <div className="highlight">
              <span className="label">Group Size:</span>
              <span>{packageData.groupSize?.min}-{packageData.groupSize?.max} people</span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-section">
        <div className="booking-form">
          <h3>Book Your Trip</h3>
          
          <div className="form-group">
            <label>Travel Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Number of Nights</label>
            <select value={nights} onChange={(e) => setNights(parseInt(e.target.value))}>
              {Array.from({ length: 14 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} night{i > 0 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="guests-section">
            <h4>Guests</h4>
            <div className="guest-controls">
              <div className="guest-type">
                <span>Adults (12+ years)</span>
                <div className="counter">
                  <button onClick={() => setGuests({...guests, adults: Math.max(1, guests.adults - 1)})}>-</button>
                  <span>{guests.adults}</span>
                  <button onClick={() => setGuests({...guests, adults: guests.adults + 1})}>+</button>
                </div>
              </div>
              
              <div className="guest-type">
                <span>Children (2-11 years)</span>
                <div className="counter">
                  <button onClick={() => setGuests({...guests, children: Math.max(0, guests.children - 1)})}>-</button>
                  <span>{guests.children}</span>
                  <button onClick={() => setGuests({...guests, children: guests.children + 1})}>+</button>
                </div>
              </div>
              
              <div className="guest-type">
                <span>Infants (0-2 years)</span>
                <div className="counter">
                  <button onClick={() => setGuests({...guests, infants: Math.max(0, guests.infants - 1)})}>-</button>
                  <span>{guests.infants}</span>
                  <button onClick={() => setGuests({...guests, infants: guests.infants + 1})}>+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="price-summary">
            <div className="price-breakdown">
              <div className="price-item">
                <span>Adults ({guests.adults}) × {nights} nights</span>
                <span>${Math.round((packageData.pricing?.adult || 0) * guests.adults * (nights / (packageData.duration?.nights || 1)))}</span>
              </div>
              {guests.children > 0 && (
                <div className="price-item">
                  <span>Children ({guests.children}) × {nights} nights</span>
                  <span>${Math.round((packageData.pricing?.child || 0) * guests.children * (nights / (packageData.duration?.nights || 1)))}</span>
                </div>
              )}
              {guests.infants > 0 && (
                <div className="price-item">
                  <span>Infants ({guests.infants}) × {nights} nights</span>
                  <span>${Math.round((packageData.pricing?.infant || 0) * guests.infants * (nights / (packageData.duration?.nights || 1)))}</span>
                </div>
              )}
              {nights !== (packageData.duration?.nights || 1) && (
                <div className="price-item" style={{color: '#1E90FF', fontWeight: '600'}}>
                  <span>Night adjustment ({nights} vs {packageData.duration?.nights} nights)</span>
                  <span>{nights > (packageData.duration?.nights || 1) ? '+' : '-'}{Math.abs(Math.round(((nights / (packageData.duration?.nights || 1)) - 1) * 100))}%</span>
                </div>
              )}
              <div className="price-total">
                <span>Total for {nights} nights</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <button className="book-now-btn" onClick={handleBooking}>
            Pay Now - ₹{totalPrice.toLocaleString('en-IN')}
          </button>
        </div>

        <div className="package-details">
          <div className="detail-section">
            <h4>What's Included</h4>
            <ul>
              {packageData.inclusions?.map((item, idx) => (
                <li key={idx}>✓ {item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h4>What's Not Included</h4>
            <ul>
              {packageData.exclusions?.map((item, idx) => (
                <li key={idx}>✗ {item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h4>Itinerary</h4>
            <div className="itinerary">
              {packageData.itinerary?.map((day, idx) => (
                <div key={idx} className="day-item">
                  <div className="day-number">Day {day.day}</div>
                  <div className="day-content">
                    <h5>{day.title}</h5>
                    <p>{day.description}</p>
                    <div className="activities">
                      {day.activities?.map((activity, i) => (
                        <span key={i} className="activity">{activity}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;