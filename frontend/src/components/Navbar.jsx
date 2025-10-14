


import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';


function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">Travogenie</div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={`btn nav-oval${location.pathname === '/' ? ' active-oval' : ''}`}>Home</Link>
        </li>
        <li>
          <Link to="/feature" className={`btn nav-oval${location.pathname === '/feature' ? ' active-oval' : ''}`}>Features</Link>
        </li>
        <li>
          <Link to="/packages" className={`btn nav-oval${location.pathname === '/packages' ? ' active-oval' : ''}`}>Packages</Link>
        </li>
        <li>
          <Link to="/testimonial" className={`btn nav-oval${location.pathname === '/testimonial' ? ' active-oval' : ''}`}>Testimonials</Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link to="/bookings" className={`btn nav-oval${location.pathname === '/bookings' ? ' active-oval' : ''}`}>My Bookings</Link>
          </li>
        )}
        {isAuthenticated && user?.role === 'admin' && (
          <li>
            <Link to="/admin" className={`btn nav-oval${location.pathname === '/admin' ? ' active-oval' : ''}`}>Admin</Link>
          </li>
        )}
        {isAuthenticated ? (
          <li className="auth-section">
            <span className="user-welcome">Hi, {user?.name}!</span>
            <button className={`btn nav-oval logout-btn`} onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li>
            <Link to="/auth" className={`btn nav-oval${location.pathname === '/auth' ? ' active-oval' : ''}`}>Login / Signup</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
