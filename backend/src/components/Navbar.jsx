


import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    const handleStorage = () => setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
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
          <Link to="/destination" className={`btn nav-oval${location.pathname === '/destination' ? ' active-oval' : ''}`}>Destinations</Link>
        </li>
        <li>
          <Link to="/testimonial" className={`btn nav-oval${location.pathname === '/testimonial' ? ' active-oval' : ''}`}>Testimonials</Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button className={`btn nav-oval`} onClick={handleLogout}>Logout</button>
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
