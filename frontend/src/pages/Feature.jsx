import './Feature.css';

function Feature() {
  const features = [
    { icon: "fas fa-route", title: "Personalized Itineraries", desc: "Tailored plans to match your travel style and interests" },
    { icon: "fas fa-wallet", title: "Smart Budget Planner", desc: "Control expenses and travel within your budget" },
    { icon: "fas fa-plane-departure", title: "Real-time Flight Tracking", desc: "Track flights and get live updates on your trips" },
    { icon: "fas fa-language", title: "Multi-language Support", desc: "Travel-friendly interface in multiple global languages" },
    { icon: "fas fa-headset", title: "24/7 Customer Support", desc: "We're here for you anytime, anywhere" },
    { icon: "fas fa-gift", title: "Exclusive Deals & Offers", desc: "Access special discounts and travel packages" },
    { icon: "fas fa-map-marked-alt", title: "Interactive Map Integration", desc: "Explore destinations visually with our smart maps" },
    { icon: "fas fa-lock", title: "Secure Payment Gateway", desc: "Pay safely and swiftly with trusted partners" }
  ];

  return (
    <section className="feature-section" style={{
      minHeight: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      padding: 0,
      paddingTop: '90px', // Add space for navbar
      background: '#fff',
    }}>
      <div className="feature-heading">
        <h2>Why Choose Travogenie?</h2>
        <p>Your one-stop destination for seamless, smart, and stress-free travel.</p>
      </div>

      <div className="feature-grid">
        {features.map((item, i) => (
          <div key={i} className={`feature-card ${i % 2 === 0 ? 'left' : 'right'}`}>
            <div className="feature-icon">
              <i className={item.icon}></i>
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Feature;
