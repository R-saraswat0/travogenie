


import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';


function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug logging
  console.log('Navbar - isAuthenticated:', isAuthenticated);
  console.log('Navbar - user:', user);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">Travogenie</Link>
      </div>
      
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="nav-links">
        <li>
          <Link to="/" className={`btn nav-oval${location.pathname === '/' ? ' active-oval' : ''}`} onClick={closeMobileMenu}>Home</Link>
        </li>
        <li>
          <Link to="/feature" className={`btn nav-oval${location.pathname === '/feature' ? ' active-oval' : ''}`} onClick={closeMobileMenu}>Features</Link>
        </li>
        <li>
          <Link to="/packages" className={`btn nav-oval${location.pathname === '/packages' ? ' active-oval' : ''}`} onClick={closeMobileMenu}>Packages</Link>
        </li>
        <li>
          <Link to="/map" className={`btn nav-oval${location.pathname === '/map' ? ' active-oval' : ''}`} onClick={closeMobileMenu}>Map</Link>
        </li>
        <li>
          <Link to="/testimonial" className={`btn nav-oval${location.pathname === '/testimonial' ? ' active-oval' : ''}`} onClick={closeMobileMenu}>Testimonials</Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link to="/bookings" className={`btn nav-oval${location.pathname === '/bookings' ? ' active-oval' : ''}`} onClick={closeMobileMenu}>My Bookings</Link>
          </li>
        )}
        {isAuthenticated && user?.role === 'admin' && (
          <li>
            <Link to="/admin" className={`btn nav-oval${location.pathname === '/admin' ? ' active-oval' : ''}`} onClick={closeMobileMenu}>Admin</Link>
          </li>
        )}
        {isAuthenticated ? (
          <>
            <li>
              <span className="user-welcome">Hi, {user?.name || 'User'}!</span>
            </li>
            <li>
              <button className={`btn nav-oval logout-btn`} onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/auth" className={`btn nav-oval${location.pathname === '/auth' ? ' active-oval' : ''}`} onClick={closeMobileMenu}>Login / Signup</Link>
          </li>
        )}
        </ul>
      </div>
      
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
    </nav>
  );
}

export default Navbar;
