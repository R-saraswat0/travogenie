import React, { useState } from 'react';
import { FaStar, FaTimes, FaUpload } from 'react-icons/fa';
import { testimonialService } from '../services/testimonialService';

const AddTestimonialModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    image: null,
    rating: 5,
    text: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await testimonialService.createTestimonial(formData);
      onSuccess();
      onClose();
      setFormData({ name: '', location: '', image: null, rating: 5, text: '' });
      setImagePreview('');
    } catch (err) {
      setError(err.message || 'Failed to submit testimonial');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <FaTimes />
        </button>

        <h2 style={{
          marginBottom: '1.5rem',
          color: '#333',
          textAlign: 'center'
        }}>
          Share Your Experience
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="City, Country"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Profile Image (optional)
            </label>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '6px',
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#1E90FF';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#ddd';
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith('image/')) {
                setFormData({ ...formData, image: file });
                setImagePreview(URL.createObjectURL(file));
              }
            }}
            onClick={() => document.getElementById('imageInput').click()}
            >
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, image: file });
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                style={{ display: 'none' }}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }} />
              ) : (
                <div>
                  <FaUpload style={{ fontSize: '2rem', color: '#666', marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, color: '#666' }}>Click or drag image here</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Rating *
            </label>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{
                    color: star <= formData.rating ? '#FFD700' : '#ddd',
                    cursor: 'pointer',
                    fontSize: '1.5rem'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Your Experience *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              rows="4"
              placeholder="Tell us about your travel experience..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #1E90FF, #2ECC71)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Testimonial'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTestimonialModal;