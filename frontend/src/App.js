import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import axios from 'axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Feature from './pages/Feature';
import BookNow from './pages/BookNow';
import Testimonial from './pages/Testimonial';
import Auth from './components/Auth';
import Packages from './components/Packages';
import PackageDetail from './components/PackageDetail';
import Bookings from './components/Bookings';
import AdminPanel from './components/AdminPanel';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:5001';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  return (
    <AuthProvider>
      <ErrorBoundary>
        {!isAuthPage && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Feature />} />
          <Route path="/feature" element={<Feature />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/book-now" element={<BookNow />} />
          <Route path="/testimonials" element={<Testimonial />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        {!isAuthPage && <Footer />}
        {!isAuthPage && <Chatbot />}
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
