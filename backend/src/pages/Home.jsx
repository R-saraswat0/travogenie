
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #e3eafc 0%, #f8fafc 100%)', minHeight: '100vh', width: '100vw', padding: '0', margin: '0', boxSizing: 'border-box' }}>
      {/* Hero Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '60px 0 0 0', position: 'relative' }}>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 900, color: '#1E90FF', marginBottom: '18px', letterSpacing: '1px', textShadow: '0 2px 12px #1e90ff22' }}>
          TravoGenie
        </h1>
        <p style={{ fontSize: '1.35rem', color: '#2a4365', marginBottom: '32px', maxWidth: '650px', textAlign: 'center', fontWeight: 500 }}>
          Your AI-powered gateway to the world. Discover, compare, and book the best destinations for your next adventure.
        </p>
        <a href="/destination" style={{ padding: '16px 44px', background: 'linear-gradient(90deg, #1E90FF 0%, #2ECC71 100%)', color: 'white', borderRadius: '30px', fontWeight: 700, fontSize: '1.18rem', textDecoration: 'none', boxShadow: '0 4px 16px #1e90ff22', transition: 'background 0.3s', marginBottom: '40px', letterSpacing: '0.5px' }}>
          Explore Destinations
        </a>
      </div>

      {/* Featured Destinations */}
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2a4365', marginBottom: '28px', textAlign: 'center', letterSpacing: '0.5px' }}>
          Featured Destinations
        </h2>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Featured destinations mapping */}
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', marginBottom: '60px', textAlign: 'center', background: 'linear-gradient(90deg, #1E90FF 0%, #2ECC71 100%)', borderRadius: '18px', padding: '38px 0', color: 'white', boxShadow: '0 4px 16px #1e90ff22' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '18px', letterSpacing: '0.5px' }}>Ready to start your journey?</h2>
        <p style={{ fontSize: '1.15rem', fontWeight: 500, marginBottom: '28px' }}>Sign up now and get exclusive deals on top destinations!</p>
        <a href="/auth" style={{ padding: '14px 38px', background: 'white', color: '#1E90FF', borderRadius: '30px', fontWeight: 700, fontSize: '1.15rem', textDecoration: 'none', boxShadow: '0 4px 16px #1e90ff22', transition: 'background 0.3s', letterSpacing: '0.5px' }}>Get Started</a>
      </div>

      {/* Footer */}
      <div style={{ width: '100%', textAlign: 'center', color: '#4a5568', fontSize: '0.98rem', padding: '18px 0 10px 0', background: 'transparent' }}>
        &copy; {new Date().getFullYear()} TravoGenie. All rights reserved.
      </div>
    </div>
  );
}

export default Home;
