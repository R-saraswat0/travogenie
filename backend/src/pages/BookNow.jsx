
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaUser, FaEnvelope, FaPhone, FaUsers, FaCalendarAlt, FaRegCheckCircle } from 'react-icons/fa';

function BookNow() {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.destination;
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    people: 1,
    date: '',
    card: '',
    expiry: '',
    cvv: ''
  });
  const [success, setSuccess] = useState(false);

  if (!destination) return <div className="text-center p-8">No destination selected.</div>;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('${destination.image}')` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/70 to-green-700/80 backdrop-blur-lg z-0" />
      <div className="relative z-10 w-full max-w-lg mx-auto p-8 rounded-3xl shadow-2xl glass-card flex flex-col items-center animate-fadeIn">
        <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-4 border-2 border-blue-200">
          <img src={destination.image} alt={destination.title} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
          <FaCreditCard className="text-green-300" /> Reserve Your Trip
        </h2>
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-white">{destination.title}</h3>
          <div className="flex flex-wrap gap-2 text-blue-100 text-sm justify-center">
            <span><FaUsers className="inline mr-1 text-blue-200" /> {form.people} People</span>
            <span><FaCalendarAlt className="inline mr-1 text-green-200" /> {destination.duration} days</span>
            <span className="font-semibold">{destination.price}</span>
          </div>
        </div>
        {success ? (
          <div className="text-green-200 text-lg font-semibold text-center py-8 flex flex-col items-center gap-2">
            <FaRegCheckCircle className="text-4xl mb-2" />
            Reservation Successful! Thank you for choosing us.<br />
            <span className="text-sm text-blue-100">A confirmation email will be sent to you soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative col-span-2">
              <FaUser className="absolute left-3 top-3 text-blue-200" />
              <input name="name" required placeholder="Full Name" className="border pl-10 p-2 rounded w-full bg-white/80" value={form.name} onChange={handleChange} />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-blue-200" />
              <input name="email" required type="email" placeholder="Email" className="border pl-10 p-2 rounded w-full bg-white/80" value={form.email} onChange={handleChange} />
            </div>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-blue-200" />
              <input name="contact" required placeholder="Contact No" className="border pl-10 p-2 rounded w-full bg-white/80" value={form.contact} onChange={handleChange} />
            </div>
            <div className="relative">
              <FaUsers className="absolute left-3 top-3 text-blue-200" />
              <input name="people" required type="number" min="1" placeholder="No. of People" className="border pl-10 p-2 rounded w-full bg-white/80" value={form.people} onChange={handleChange} />
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-green-300" />
              <input name="date" required type="date" placeholder="Travel Date" className="border pl-10 p-2 rounded w-full bg-white/80" value={form.date} onChange={handleChange} />
            </div>
            <div className="relative col-span-2">
              <FaCreditCard className="absolute left-3 top-3 text-green-300" />
              <input name="card" required placeholder="Card Number" className="border pl-10 p-2 rounded w-full bg-white/80" value={form.card} onChange={handleChange} />
            </div>
            <div className="relative">
              <input name="expiry" required placeholder="Expiry (MM/YY)" className="border p-2 rounded w-full bg-white/80" value={form.expiry} onChange={handleChange} />
            </div>
            <div className="relative">
              <input name="cvv" required placeholder="CVV" className="border p-2 rounded w-full bg-white/80" value={form.cvv} onChange={handleChange} />
            </div>
            <button type="submit" className="col-span-2 w-full py-3 mt-2 rounded-2xl font-bold text-lg bg-gradient-to-r from-pink-500 via-blue-500 to-green-400 text-white shadow-xl hover:scale-105 hover:from-blue-600 hover:to-green-500 transition-all duration-200 border-0">Reserve</button>
          </form>
        )}
      </div>
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.18);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.18);
        }
        .animate-fadeIn { animation: fadeIn .5s; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

export default BookNow;
