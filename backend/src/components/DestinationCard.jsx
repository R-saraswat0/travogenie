import { FaStar, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import './DestinationCard.css';

function DestinationCard({ image, title, desc, price, duration, rating, className, id }) {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/destination/${id}`);
  };
  return (
    <div className={`destination-card ${className || ''}`}>
      <div className="destination-image-container">
        <img 
          src={image} 
          alt={title}
          className="destination-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Destination+Image';
          }}
        />
        <div className="destination-duration">
          <FaCalendarAlt /> {duration} days
        </div>
      </div>
      
      <div className="destination-content">
        <div className="destination-rating">
          <FaStar style={{ color: '#FFD700' }} />
          <span style={{ color: '#333', fontWeight: 'bold' }}>{rating.toFixed(1)}</span>
        </div>
        
        <h3
          className="destination-title"
          style={{
            color: '#fff',
            textShadow: '0 2px 8px #1e355e99, 0 1px 0 #222',
            fontWeight: 700
          }}
        >
          {title}
        </h3>
        
        <div className="destination-desc" style={{ color: '#e3eafc', fontWeight: 500, textShadow: '0 1px 4px #1e355e88' }}>
          <FaMapMarkerAlt style={{ color: '#FFD700', marginRight: 6 }} />
          <span>{desc}</span>
        </div>
        
        <div className="destination-footer">
          <div className="destination-price">
            <span style={{ fontSize: '0.8rem', color: '#e3eafc' }}>From</span>
            <strong style={{
              fontSize: '1.2rem',
              color: '#fff',
              textShadow: '0 1px 4px #1e355e88',
              fontWeight: 700
            }}>
              {price}
            </strong>
          </div>
          <button
            className="destination-btn"
            style={{
              background: 'linear-gradient(135deg, #1E90FF, #2ECC71)',
              color: 'white'
            }}
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;