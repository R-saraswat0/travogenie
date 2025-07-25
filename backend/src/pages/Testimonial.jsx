
import React, { useState, useMemo } from 'react';
import { FaStar } from 'react-icons/fa';
import TestimonialCard from '../components/TestimonialCard';

const testimonialData = [
  { name: 'Ananya Mehta', location: 'Mumbai, India', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', rating: 5, text: 'Travogenie made my family vacation magical! The Bali package was perfectly curated.' },
  { name: 'David Kim', location: 'Seoul, South Korea', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', rating: 4, text: 'The real-time flight tracking saved us when our connection was delayed. Excellent service!' },
  { name: 'Sana & Amir Qureshi', location: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e', rating: 5, text: 'Our honeymoon in the Maldives was beyond perfect! Every detail was taken care of.' },
  { name: 'Maria Gonzalez', location: 'Barcelona, Spain', image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4', rating: 5, text: 'The Rome cultural tour was incredibly insightful. Our guide was a true expert.' },
  { name: 'James Wilson', location: 'London, UK', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', rating: 4, text: 'Great value for money on our New York trip. The hotel recommendations were spot on.' },
  { name: 'Linh Nguyen', location: 'Hanoi, Vietnam', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', rating: 5, text: 'The Kyoto cherry blossom tour was a dream come true. Perfect timing and locations.' },
  { name: 'Olivia Brown', location: 'Toronto, Canada', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e', rating: 5, text: 'Our Patagonia trekking adventure was flawlessly organized. Breathtaking views!' },
  { name: 'Mohammed Al-Farsi', location: 'Muscat, Oman', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', rating: 4, text: 'Excellent customer service when we needed to modify our Paris itinerary last minute.' },
  { name: 'Sophie Martin', location: 'Geneva, Switzerland', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', rating: 5, text: 'The Amalfi Coast private boat tour was worth every penny. Bellissimo!' },
  { name: 'Carlos Mendez', location: 'Mexico City, Mexico', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef', rating: 5, text: 'Machu Picchu at sunrise was spiritual. The guides were knowledgeable and friendly.' },
  { name: 'Yuki Tanaka', location: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', rating: 4, text: 'Great recommendations for authentic local experiences in Bangkok.' },
  { name: 'Emma Johansson', location: 'Stockholm, Sweden', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d', rating: 5, text: 'Northern Lights package in Iceland was spectacular. The guides were so passionate.' },
  { name: 'Raj Patel', location: 'New Delhi, India', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', rating: 4, text: 'Dubai desert safari was the highlight of our trip. Well-organized and exciting.' },
  { name: 'Fatima Zahra', location: 'Casablanca, Morocco', image: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5', rating: 5, text: 'The Marrakech cooking class was the perfect cultural immersion. Delicious!' },
  { name: "Michael O'Connor", location: 'Dublin, Ireland', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', rating: 4, text: 'Great Barrier Reef diving experience was well-coordinated and safe.' },
  { name: 'Aisha Bello', location: 'Lagos, Nigeria', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e', rating: 5, text: 'Zanzibar beach resort was paradise. The sunset dhow cruise was magical.' },
  { name: 'Thomas Müller', location: 'Berlin, Germany', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', rating: 4, text: 'Ski package in Swiss Alps had perfect snow conditions. Will book again next year.' },
  { name: 'Isabella Rossi', location: 'Milan, Italy', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', rating: 5, text: 'Petra by night tour was unforgettable. The candlelit walk through the Siq was magical.' },
  { name: 'Chen Wei', location: 'Shanghai, China', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', rating: 5, text: 'Great Wall hiking tour was challenging but rewarding. Excellent local guides.' },
  { name: 'Alejandro Ruiz', location: 'Buenos Aires, Argentina', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef', rating: 4, text: 'Rio Carnival experience was vibrant and well-organized. The samba school visit was a highlight.' },
  { name: 'Natalia Ivanova', location: 'Moscow, Russia', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d', rating: 5, text: 'Trans-Siberian railway package was the journey of a lifetime. Everything was perfect.' },
];

function Testimonial() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  const filteredData = useMemo(() => {
	return testimonialData.filter((item) => {
	  if (filter === 'all') return true;
	  if (filter === '5') return item.rating === 5;
	  if (filter === '4') return item.rating === 4;
	  if (filter === '3') return item.rating === 3;
	  return false;
	});
  }, [filter]);

  const totalPages = Math.ceil(filteredData.length / cardsPerPage);
  const paginatedData = useMemo(() => filteredData.slice((page - 1) * cardsPerPage, page * cardsPerPage), [filteredData, page, cardsPerPage]);

  return (
  <section style={{
	minHeight: '100vh',
	width: '100vw',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	padding: '2.5rem 2% 1.5rem',
	background: '#fff',
  }}>
	  <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
		<h2
		  style={{
			fontSize: '2.2rem',
			fontWeight: '700',
			background: 'linear-gradient(135deg, #1E90FF, #2ECC71)',
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			backgroundClip: 'text',
			color: 'transparent',
			marginBottom: '0.7rem',
		  }}
		>
		  Traveler Experiences
		</h2>
		<p
		  style={{
			color: 'transparent',
			fontSize: '1.08rem',
			background: 'linear-gradient(135deg, #1E90FF, #2ECC71)',
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			backgroundClip: 'text',
			marginBottom: '0.7rem',
		  }}
		>
		  Hear what our global community says about their journeys
		</p>
	  </div>

  <div
	style={{
	  display: 'flex',
	  justifyContent: 'center',
	  alignItems: 'center',
	  gap: '32px',
	  flexWrap: 'wrap',
	  marginBottom: '2.5rem',
	  marginTop: '1.5rem',
	}}
  >
	{/* Search bar placeholder with horizontal gap */}
	<input
	  type="text"
	  placeholder="Search testimonials..."
	  style={{
		padding: '10px 18px',
		borderRadius: '22px',
		border: '1.5px solid #b5c6e0',
		fontSize: '1.08rem',
		marginRight: '24px',
		outline: 'none',
		minWidth: 220,
		background: '#fafdff',
		color: '#2a4365',
		boxShadow: '0 2px 8px #1E90FF11',
		transition: 'box-shadow 0.2s',
	  }}
	  // onChange handler can be added for search functionality
	/>
		<button
		  className={`testimonial-filter-btn${filter === 'all' ? ' active' : ''}`}
		  onClick={() => { setFilter('all'); setPage(1); }}
		>
		  All Reviews
		</button>
		<button
		  className={`testimonial-filter-btn${filter === '5' ? ' active' : ''}`}
		  onClick={() => { setFilter('5'); setPage(1); }}
		>
		  5 <FaStar style={{ color: '#FFD700', marginLeft: 2, marginBottom: 2 }} />
		</button>
		<button
		  className={`testimonial-filter-btn${filter === '4' ? ' active' : ''}`}
		  onClick={() => { setFilter('4'); setPage(1); }}
		>
		  4 <FaStar style={{ color: '#FFD700', marginLeft: 2, marginBottom: 2 }} />
		</button>
		<button
		  className={`testimonial-filter-btn${filter === '3' ? ' active' : ''}`}
		  onClick={() => { setFilter('3'); setPage(1); }}
		>
		  3 <FaStar style={{ color: '#FFD700', marginLeft: 2, marginBottom: 2 }} />
		</button>
	  </div>

	  <div
	style={{
	  display: 'grid',
	  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
	  gap: '1.2rem',
	  maxWidth: '1100px',
	  margin: '0 auto',
	}}
  >
	{paginatedData.map((item, i) => (
	  <TestimonialCard
		key={(page-1)*cardsPerPage+i}
		{...item}
	  />
	))}
  </div>
	</section>
  );
}

export default Testimonial;