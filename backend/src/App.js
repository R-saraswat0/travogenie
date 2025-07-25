import { Routes, Route } from 'react-router-dom';


import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Feature from './pages/Feature';
import Destination from './pages/Destination';
import DestinationDetail from './pages/DestinationDetail';
import BookNow from './pages/BookNow';
import Testimonial from './pages/Testimonial';
import Auth from './components/Auth';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feature" element={<Feature />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/book-now" element={<BookNow />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
