
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';


function Auth() {
  const navigate = useNavigate();
  const { register, login, loading, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false });
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({ login: false, signup: false, confirm: false });

  const handleToggle = (login) => {
    setIsLogin(login);
    clearError();
    setSuccess('');
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleSignupChange = (e) => {
    const { id, value, type, checked } = e.target;
    setSignupData({ ...signupData, [id]: type === 'checkbox' ? checked : value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    setSuccess('');
    
    if (!loginData.email || !loginData.password) {
      return;
    }
    if (!validateEmail(loginData.email)) {
      return;
    }
    
    const result = await login(loginData);
    
    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();
    setSuccess('');
    
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      return;
    }
    if (!validateEmail(signupData.email)) {
      return;
    }
    if (signupData.password.length < 6) {
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      return;
    }
    if (!signupData.terms) {
      return;
    }
    
    const result = await register({
      name: signupData.name,
      email: signupData.email,
      password: signupData.password
    });
    
    if (result.success) {
      setSuccess('Account created! Check your email for verification.');
      setTimeout(() => navigate('/'), 3000);
    }
  };

  return (
    <div className="auth-container">
      <div className="toggle-container">
        <div className="toggle">
          <div className={isLogin ? 'active' : ''} onClick={() => handleToggle(true)}>Login</div>
          <div className={!isLogin ? 'active' : ''} onClick={() => handleToggle(false)}>Sign Up</div>
        </div>
        <h3 style={{ marginBottom: '10px', fontSize: '28px', fontWeight: '700' }}>TravoGenie</h3>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>Your AI-powered travel companion</p>
      </div>
      <div className="form-container">
        {isLogin ? (
          <form className="login-form" onSubmit={handleLogin} autoComplete="off">
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>Welcome Back</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={loginData.email} onChange={handleLoginChange} placeholder="Enter your email" />
              <i className="fas fa-envelope"></i>
            </div>
            <div className="form-group password-field">
              <label htmlFor="password">Password</label>
              <input type={showPassword.login ? 'text' : 'password'} id="password" value={loginData.password} onChange={handleLoginChange} placeholder="Enter your password" />
              <i className="fas fa-lock"></i>
              <span className="password-toggle" onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}>
                <i className={showPassword.login ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
              {error && isLogin && <div className="form-error">{error}</div>}
            </div>
            <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="remember-me" style={{ margin: 0, accentColor: '#1E90FF', width: '16px', height: '16px' }} />
                <label htmlFor="remember-me" style={{ fontSize: 14, color: '#6b7280', margin: 0, cursor: 'pointer' }}>Remember me</label>
              </div>
              <a href="#" style={{ color: '#1E90FF', fontSize: 14, textDecoration: 'none', fontWeight: '500' }}>Forgot Password?</a>
            </div>
            <button type="submit" className="btn" disabled={loading}>Login</button>
            <div className="social-login">
              <p>Or continue with</p>
              <div className="social-icons">
                <div className="social-icon google"><i className="fab fa-google"></i></div>
                <div className="social-icon facebook"><i className="fab fa-facebook-f"></i></div>
                <div className="social-icon twitter"><i className="fab fa-twitter"></i></div>
              </div>
            </div>
            {loading && <div className="loading"><div className="loading-spinner"></div></div>}
            {success && <div className="success-message">{success}</div>}
          </form>
        ) : (
          <form className="signup-form" onSubmit={handleSignup} autoComplete="off">
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>Create Account</h2>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" value={signupData.name} onChange={handleSignupChange} placeholder="Enter your full name" />
              <i className="fas fa-user"></i>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={signupData.email} onChange={handleSignupChange} placeholder="Enter your email" />
              <i className="fas fa-envelope"></i>
            </div>
            <div className="form-group password-field">
              <label htmlFor="password">Password</label>
              <input type={showPassword.signup ? 'text' : 'password'} id="password" value={signupData.password} onChange={handleSignupChange} placeholder="Create a password" />
              <i className="fas fa-lock"></i>
              <span className="password-toggle" onClick={() => setShowPassword({ ...showPassword, signup: !showPassword.signup })}>
                <i className={showPassword.signup ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
            </div>
            <div className="form-group password-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type={showPassword.confirm ? 'text' : 'password'} id="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} placeholder="Confirm your password" />
              <i className="fas fa-lock"></i>
              <span className="password-toggle" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
                <i className={showPassword.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
              {error && !isLogin && <div className="form-error">{error}</div>}
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: '15px' }}>
              <input type="checkbox" id="terms" checked={signupData.terms} onChange={handleSignupChange} style={{ margin: 0, marginTop: '2px', accentColor: '#1E90FF', width: '16px', height: '16px', flexShrink: 0 }} />
              <label htmlFor="terms" style={{ fontSize: 14, color: '#6b7280', cursor: 'pointer', margin: 0, lineHeight: '1.5' }}>I agree to the <a href="#" style={{ color: '#1E90FF', textDecoration: 'underline' }}>Terms & Conditions</a></label>
            </div>
            <button type="submit" className="btn" disabled={loading}>Sign Up</button>
            <div className="social-login">
              <p>Or sign up with</p>
              <div className="social-icons">
                <div className="social-icon google"><i className="fab fa-google"></i></div>
                <div className="social-icon facebook"><i className="fab fa-facebook-f"></i></div>
                <div className="social-icon twitter"><i className="fab fa-twitter"></i></div>
              </div>
            </div>
            {loading && <div className="loading"><div className="loading-spinner"></div></div>}
            {success && <div className="success-message">{success}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;
