import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-column">
          <h3>Travogenie</h3>
          <p>Creating unforgettable travel experiences since 2010.</p>
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-link"><i className="fab fa-pinterest"></i></a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/feature">Features</a></li>
            <li><a href="/destination">Destinations</a></li>
            <li><a href="/testimonial">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Destinations</h3>
          <ul className="footer-links">
            <li><a href="#">Bali, Indonesia</a></li>
            <li><a href="#">Santorini, Greece</a></li>
            <li><a href="#">Maldives</a></li>
            <li><a href="#">Paris, France</a></li>
            <li><a href="#">Tokyo, Japan</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul className="footer-links">
            <li><i className="fas fa-map-marker-alt"></i> 123 Travel Street, New York, NY</li>
            <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
            <li><i className="fas fa-envelope"></i> info@travogenie.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Travogenie. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
