import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('packages');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (activeTab === 'packages') {
        const response = await fetch('http://localhost:5000/api/packages', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setPackages(data.packages || []);
      } else if (activeTab === 'bookings') {
        const response = await fetch('http://localhost:5000/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setBookings(data.bookings || []);
      } else if (activeTab === 'stats') {
        const response = await fetch('http://localhost:5000/api/bookings/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStats(data || {});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const togglePackageStatus = async (packageId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-panel">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'packages' ? 'active' : ''}
          onClick={() => setActiveTab('packages')}
        >
          Packages
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button 
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'packages' && (
        <div className="packages-admin">
          <h2>Manage Packages</h2>
          <div className="admin-table">
            {packages.map(pkg => (
              <div key={pkg._id} className="admin-card">
                <h3>{pkg.title}</h3>
                <p>{pkg.destination} - {pkg.duration} days</p>
                <p>Price: ${pkg.basePrice}</p>
                <p>Status: {pkg.isActive ? 'Active' : 'Inactive'}</p>
                <button 
                  onClick={() => togglePackageStatus(pkg._id, pkg.isActive)}
                  className={pkg.isActive ? 'deactivate-btn' : 'activate-btn'}
                >
                  {pkg.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-admin">
          <h2>Manage Bookings</h2>
          <div className="admin-table">
            {bookings.map(booking => (
              <div key={booking._id} className="admin-card">
                <h3>{booking.packageId?.title}</h3>
                <p>User: {booking.userId?.name}</p>
                <p>Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                <p>Amount: ${booking.totalAmount}</p>
                <p>Status: {booking.status}</p>
                <select 
                  value={booking.status}
                  onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="stats-admin">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p>{stats.totalBookings || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p>${stats.totalRevenue || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Active Packages</h3>
              <p>{stats.activePackages || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Bookings</h3>
              <p>{stats.pendingBookings || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;