

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import mockDestinations from './mockDestinations';

function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const dest = mockDestinations[parseInt(id, 10)];
    setDestination(dest);
  }, [id]);

  // State for show more/less description
  const [showMore, setShowMore] = useState(false);
  // State for reserve form
  const [country, setCountry] = useState('+91');
  const [phone, setPhone] = useState('');
  // State for reserve modal
  const [showReserve, setShowReserve] = useState(false);

  if (!destination) return <div className="text-center p-8">Loading...</div>;

  // Images for gallery
  const images = [
    destination.image,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb'
  ];

  const shortDesc = destination.description?.slice(0, 180) + (destination.description?.length > 180 ? '...' : '');

  // State for reviews (mocked)
  const reviews = [
    {
      name: '1 month on Airbnb', date: '2 weeks ago', text: 'Had a great stay! Clean place, good location, and helpful host. Would recommend.'
    },
    {
      name: '2 years on Airbnb', date: 'August 2024', text: 'Staying at this Airbnb was an exceptional experience! The home was even better than the pictures—spacious, clean, and filled with natural light. The host was incredibly thoughtful, ...'
    }
  ];

  // Price calculation (mocked)
  const nights = 2;
  const pricePerNight = destination.price;
  const total = pricePerNight * nights;
  const taxes = Math.round(total * 0.1);
  const grandTotal = total + taxes;

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      marginTop: 80, // Add top margin to avoid navbar overlap
      padding: 32,
      color: '#183153',
      fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif',
      background: 'linear-gradient(120deg, #f7faff 0%, #e3f9f4 100%)',
      borderRadius: 24,
      boxShadow: '0 4px 24px #1e90ff22',
      border: '1.5px solid #1E90FF33',
    }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#183153', textShadow: '0 2px 8px #fff8' }}>{destination.name}</h1>
        <p className="subtitle" style={{ fontSize: 17, color: '#1E90FF', marginBottom: 18 }}>{destination.location}</p>
      </header>
      <div className="rating" style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
        <div className="stars" style={{ color: '#2ECC71', fontSize: 16, marginRight: 7 }}>★★★★★</div>
        <span className="review-count" style={{ fontSize: 15, textDecoration: 'underline', color: '#1E90FF', fontWeight: 500 }}>{destination.reviews} Reviews</span>
      </div>
      <div className="action-buttons" style={{ display: 'flex', gap: 18, marginBottom: 22 }}>
        <button style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', color: '#1E90FF' }}>Share</button>
        <button style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', color: '#1E90FF' }}>Save</button>
        <button style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', position: 'relative', color: '#1E90FF' }} onClick={() => toast.info('Showing all photos gallery')}>Show all photos</button>
      </div>
      {/* Image Gallery */}
      <div className="image-gallery" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10, height: 400, marginBottom: 24, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px #1e90ff22' }}>
        <div className="main-image" style={{ gridRow: 'span 2', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${images[0]}')` }}></div>
        <div className="secondary-image" style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${images[1]}')` }}></div>
        <div className="secondary-image" style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${images[2]}')` }}></div>
        <div className="secondary-image show-all-photos" style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${images[3]}')`, position: 'relative', cursor: 'pointer' }} onClick={() => toast.info('Showing all photos gallery')}>
          <span style={{ position: 'absolute', bottom: 15, right: 15, backgroundColor: 'white', padding: '8px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>Show all photos</span>
        </div>
        <div className="secondary-image" style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${images[4]}')` }}></div>
      </div>
      <div className="rare-find" style={{ fontWeight: 700, color: '#1E90FF', margin: '20px 0', fontSize: 16, letterSpacing: 0.5 }}>Rare find! This place is usually booked</div>
      {/* Price Card */}
      <div className="price-card" style={{
        border: '1.5px solid #1E90FF33',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        maxWidth: 420,
        background: 'linear-gradient(90deg, #f7faff 60%, #e3f9f4 100%)',
        boxShadow: '0 2px 12px #1e90ff22',
      }}>
        <div className="price" style={{ fontSize: 23, fontWeight: 700, marginBottom: 16, color: '#183153' }}>
          <span className="original-price" style={{ textDecoration: 'line-through', color: '#b2dfdb', marginRight: 12 }}>₹{destination.originalPrice || (destination.price + 2000)}</span>
          <span className="discounted-price" style={{ color: '#1E90FF' }}>₹{destination.price * 2} for 2 nights</span>
        </div>
        <div className="date-selector" style={{ marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ background: '#e3f9f4', fontWeight: 600, padding: 10, border: '1.5px solid #1E90FF33', color: '#1E90FF' }}>CHECK IN</th>
                <th style={{ background: '#e3f9f4', fontWeight: 600, padding: 10, border: '1.5px solid #1E90FF33', color: '#1E90FF' }}>CHECKOUT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 10, textAlign: 'center', border: '1.5px solid #1E90FF33', color: '#183153' }}>8/8/2025</td>
                <td style={{ padding: 10, textAlign: 'center', border: '1.5px solid #1E90FF33', color: '#183153' }}>8/10/2025</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="guest-selector" style={{ marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <th style={{ background: '#e3f9f4', fontWeight: 600, padding: 10, border: '1.5px solid #1E90FF33', color: '#1E90FF' }}>GUESTS</th>
                <td style={{ padding: 10, textAlign: 'center', border: '1.5px solid #1E90FF33', color: '#183153' }}>1 guest</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="reserve-btn" style={{ width: '100%', padding: 16, background: 'linear-gradient(90deg, #1E90FF 60%, #2ECC71 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 18, fontWeight: 700, cursor: 'pointer', marginBottom: 16, boxShadow: '0 2px 8px #1e90ff22' }} onClick={() => setShowReserve(true)}>Reserve</button>
        <p className="disclaimer" style={{ fontSize: 15, color: '#1E90FF', textAlign: 'center', marginBottom: 0 }}>You won't be charged yet</p>
      </div>
      {/* Host Info */}
      <div className="host-info" style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <div className="host-avatar" style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 15, backgroundColor: '#ddd', backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80')", backgroundSize: 'cover' }}></div>
        <div className="host-details">
          <h3 style={{ fontSize: 18, marginBottom: 5 }}>Hosted by {destination.host}</h3>
          <div className="host-badge" style={{ display: 'inline-block', backgroundColor: '#000', color: 'white', padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>Superhost · 3 years hosting</div>
          <p>9-min walk to the beach</p>
          <p>This home is by Varca Beach.</p>
          <p>Designed for staying cool</p>
          <p>Beat the heat with the A/C and ceiling fan.</p>
          <p>Free cancellation before 7 Aug</p>
          <p>Get a full refund if you change your mind.</p>
        </div>
      </div>
      {/* Description with Show More */}
      <div className="description" style={{ marginBottom: 20 }}>
        <h2>Welcome to</h2>
        <p>{showMore ? destination.description : shortDesc}</p>
        {destination.description?.length > 180 && (
          <p className="show-more" style={{ color: '#1E90FF', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setShowMore(!showMore)}>{showMore ? 'Show less' : 'Show more'}</p>
        )}
      </div>
      <div className="rare-find" style={{ fontWeight: 600, color: '#1E90FF', margin: '20px 0' }}>Rare find! This place is usually booked</div>
      {/* Amenities */}
      <div className="amenities" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, marginBottom: 15 }}>What this place offers</h2>
        <div className="amenities-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15 }}>
          {destination.amenities && destination.amenities.map((am, idx) => (
            <div key={idx} className="amenity-item" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="amenity-icon" style={{ marginRight: 10, fontSize: 18 }}>✔</span>
              <span>{am}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Calendar (static for now, modern and compact) */}
      <div className="calendar" style={{
        marginBottom: 20,
        maxWidth: 340,
        background: 'linear-gradient(120deg, #e3f9f4 0%, #f7faff 100%)',
        borderRadius: 16,
        boxShadow: '0 2px 12px #1e90ff22',
        padding: 18,
        border: '1.5px solid #1E90FF33',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ fontSize: 18, color: '#1E90FF', fontWeight: 700, margin: 0 }}>2 nights in Varca</h2>
          <span style={{ fontSize: 13, color: '#2ECC71', fontWeight: 600, background: '#e3f9f4', borderRadius: 6, padding: '2px 10px' }}>8–10 Aug</span>
        </div>
        <div className="month-selector" style={{ display: 'flex', gap: 10, margin: '8px 0 12px 0', fontSize: 14, color: '#183153', fontWeight: 500 }}>
          <span style={{ background: '#1E90FF11', borderRadius: 6, padding: '2px 8px' }}>August 2025</span>
          <span style={{ background: '#1E90FF11', borderRadius: 6, padding: '2px 8px' }}>September 2025</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 0, fontSize: 13, background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px #1e90ff11' }}>
          <thead>
            <tr style={{ background: '#e3f9f4', color: '#1E90FF', fontWeight: 700 }}>
              <th style={{ padding: 6 }}>M</th><th style={{ padding: 6 }}>T</th><th style={{ padding: 6 }}>W</th><th style={{ padding: 6 }}>T</th><th style={{ padding: 6 }}>F</th><th style={{ padding: 6 }}>S</th><th style={{ padding: 6 }}>S</th>
            </tr>
          </thead>
          <tbody>
            <tr><td></td><td></td><td style={{ color: '#1E90FF', fontWeight: 700 }}>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>
            <tr><td>6</td><td>7</td><td style={{ background: '#2ECC7111', borderRadius: 4, color: '#2ECC71', fontWeight: 700 }}>8</td><td style={{ background: '#2ECC7111', borderRadius: 4, color: '#2ECC71', fontWeight: 700 }}>9</td><td style={{ background: '#2ECC7111', borderRadius: 4, color: '#2ECC71', fontWeight: 700 }}>10</td><td>11</td><td>12</td></tr>
            <tr><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td></tr>
            <tr><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td></tr>
            <tr><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td></td><td></td></tr>
          </tbody>
        </table>
      </div>
      <div className="rare-find" style={{ fontWeight: 600, color: '#FF385C', margin: '20px 0' }}>Rare find! This place is usually booked</div>
      {/* Reviews */}
      <div className="reviews" style={{ marginBottom: 30 }}>
        <h2 style={{ fontSize: 22, marginBottom: 15 }}>Guest favourite</h2>
        <p>This home is a guest favourite based on ratings, reviews and reliability.</p>
        <div className="rating-breakdown" style={{ margin: '15px 0' }}>
          <h3>Overall rating</h3>
          <p>Cleanliness 4.8</p>
          <p>Accuracy 4.8</p>
          <p>Communication 4.8</p>
          <p>Location 4.7</p>
          <p>Value 4.8</p>
        </div>
        {reviews.map((r, idx) => (
          <div key={idx} className="review-item" style={{ marginBottom: 20 }}>
            <div className="review-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <span className="reviewer-name" style={{ fontWeight: 600, marginRight: 10 }}>{r.name}</span>
              <span className="review-date" style={{ color: '#717171', fontSize: 14 }}>{r.date}</span>
            </div>
            <p className="review-text" style={{ fontSize: 16 }}>{r.text}</p>
            <p className="show-more" style={{ color: '#1E90FF', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }} onClick={() => toast.info(r.text)}>Show more</p>
          </div>
        ))}
      </div>
      {/* Reserve Section Modal (from reserve.html) */}
      {showReserve && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(120deg, rgba(30,144,255,0.18) 0%, rgba(46,204,113,0.18) 100%)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
        }}>
          <div className="reserve-section" style={{
            maxWidth: 600,
            width: '100%',
            background: 'linear-gradient(120deg, #f7faff 0%, #e3f9f4 100%)',
            borderRadius: 20,
            boxShadow: '0 8px 32px #1e90ff33',
            padding: 36,
            position: 'relative',
            margin: '40px 0',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1.5px solid #1E90FF33',
          }}>
            <button onClick={() => setShowReserve(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#1E90FF', zIndex: 10 }} aria-label="Close">&times;</button>
            <div className="price-alert" style={{ background: 'linear-gradient(90deg, #e3f9f4 60%, #f7faff 100%)', padding: 15, borderRadius: 10, marginBottom: 22, fontSize: 16, color: '#1E90FF', fontWeight: 600 }}>
              Lower price. Your dates are ₹840 less than the avg. nightly rate of the last 60 days.
            </div>
            <h1 style={{ fontSize: 24, marginBottom: 22, color: '#183153', fontWeight: 700 }}>Confirm and pay</h1>
            <div className="trip-details" style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, marginBottom: 15, color: '#183153', fontWeight: 600 }}>Your trip</h2>
              <div className="detail-item" style={{ marginBottom: 10 }}>
                <span className="detail-label" style={{ fontWeight: 500, color: '#1E90FF' }}>Dates</span> <span style={{ color: '#183153' }}>8–10 Aug</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 10 }}>
                <span className="detail-label" style={{ fontWeight: 500, color: '#1E90FF' }}>Guests</span> <span style={{ color: '#183153' }}>1 guest</span>
              </div>
            </div>
            <div className="login-form" style={{ marginBottom: 32 }}>
              <h2 style={{ color: '#183153', fontWeight: 600 }}>Log in or sign up to book</h2>
              <div className="form-group" style={{ marginBottom: 15 }}>
                <label htmlFor="country" style={{ color: '#1E90FF', fontWeight: 500 }}>Country/Region</label>
                <select id="country" value={country} onChange={e => setCountry(e.target.value)} style={{ width: '100%', padding: 12, border: '1.5px solid #1E90FF33', borderRadius: 8, fontSize: 16, background: '#fff' }}>
                  <option value="+91">India (+91)</option>
                  <option value="+1">United States (+1)</option>
                  <option value="+44">United Kingdom (+44)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 15 }}>
                <label htmlFor="phone" style={{ color: '#1E90FF', fontWeight: 500 }}>Phone number</label>
                <input type="tel" id="phone" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: 12, border: '1.5px solid #1E90FF33', borderRadius: 8, fontSize: 16, background: '#fff' }} />
              </div>
            </div>
            <p className="disclaimer" style={{ fontSize: 14, color: '#1E90FF', marginBottom: 20, textAlign: 'center' }}>
              We'll call or text you to confirm your number. Standard message and data rates apply. Privacy Policy
            </p>
            <div className="property-info" style={{ display: 'flex', marginBottom: 20 }}>
              <div className="property-image" style={{ width: 100, height: 80, borderRadius: 10, backgroundColor: '#e3f9f4', marginRight: 15, backgroundImage: `url('${images[0]}')`, backgroundSize: 'cover', border: '1.5px solid #1E90FF33' }}></div>
              <div className="property-details">
                <h3 style={{ fontSize: 16, marginBottom: 5, color: '#183153', fontWeight: 600 }}>{destination.name}</h3>
                <p className="property-type" style={{ fontSize: 14, color: '#1E90FF', marginBottom: 5 }}>{destination.type}</p>
                <p className="rating" style={{ fontSize: 14, color: '#2ECC71' }}>★ {destination.rating} ({destination.reviews} reviews) · Superhost</p>
              </div>
            </div>
            <div className="price-summary" style={{ borderTop: '1.5px solid #1E90FF33', paddingTop: 20, marginBottom: 30 }}>
              <h2 style={{ color: '#183153', fontWeight: 600 }}>Your total</h2>
              <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: '#1E90FF' }}>Price details</span>
                <span></span>
              </div>
              <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: '#183153' }}>₹{pricePerNight} x {nights} nights</span>
                <span style={{ color: '#183153' }}>₹{total}</span>
              </div>
              <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: '#183153' }}>Taxes</span>
                <span style={{ color: '#183153' }}>₹{taxes}</span>
              </div>
              <div className="price-row total-row" style={{ fontWeight: 700, fontSize: 18, paddingTop: 10, borderTop: '1.5px solid #1E90FF33', color: '#1E90FF' }}>
                <span>Total (INR)</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
            <button className="continue-btn" style={{ width: '100%', padding: 16, background: 'linear-gradient(90deg, #1E90FF 60%, #2ECC71 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 18, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
              onClick={() => {
                if (phone) {
                  toast.success('Booking confirmation will be sent to ' + phone);
                } else {
                  toast.error('Please enter your phone number');
                }
              }}
            >Continue</button>
          </div>
        </div>
      )}
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default DestinationDetail;
