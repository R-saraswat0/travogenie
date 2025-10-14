import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Bookings.css';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings...');
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:5001/api/bookings/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Bookings data:', data);
      
      if (data.success) {
        setBookings(data.bookings || []);
        console.log('Set bookings:', data.bookings?.length || 0, 'items');
      } else {
        setBookings([]);
        console.log('No bookings found or error');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/bookings/cancel/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        fetchBookings();
      } else {
        const error = await response.json();
        alert(error.message || 'Cancellation failed');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      alert('Cancellation failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#2ECC71';
      case 'pending': return '#F39C12';
      case 'cancelled': return '#E74C3C';
      case 'completed': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  const canCancel = (booking) => {
    const startDate = new Date(booking.dates?.startDate);
    const now = new Date();
    const daysDiff = (startDate - now) / (1000 * 60 * 60 * 24);
    return booking.status === 'Confirmed' && daysDiff > 1;
  };

  if (!user) {
    return (
      <div className="bookings-container">
        <h2>Please login to view your bookings</h2>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-container">
      <h1>My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet. Browse our packages to start your journey!</p>
          <button onClick={() => window.location.href = '/packages'} className="browse-btn">
            Browse Packages
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.package?.title || 'Package'}</h3>
                <span 
                  className="status"
                  style={{ backgroundColor: getStatusColor(booking.status) }}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>
              
              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Destination:</span>
                  <span>{booking.package?.destination}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Start Date:</span>
                  <span>{new Date(booking.dates?.startDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Duration:</span>
                  <span>{booking.package?.duration?.days || booking.package?.duration} days</span>
                </div>
                <div className="detail-row">
                  <span className="label">Travelers:</span>
                  <span>{(booking.travelers?.adults || 0) + (booking.travelers?.children || 0) + (booking.travelers?.infants || 0) || 1}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Amount:</span>
                  <span className="amount">₹{booking.pricing?.totalAmount?.toLocaleString('en-IN') || '0'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Booking Date:</span>
                  <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {booking.cancellation && (
                <div className="cancellation-info">
                  <h4>Cancellation Details</h4>
                  <p>Cancelled on: {new Date(booking.cancellation.cancelledAt).toLocaleDateString()}</p>
                  <p>Refund Amount: ₹{booking.cancellation.refundAmount?.toLocaleString('en-IN') || '0'}</p>
                  <p>Reason: {booking.cancellation.reason}</p>
                </div>
              )}

              <div className="booking-actions">
                {canCancel(booking) && (
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
                <button className="view-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;