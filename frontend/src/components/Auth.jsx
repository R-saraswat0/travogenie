
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';


function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false });
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({ login: false, signup: false, confirm: false });

  const handleToggle = (login) => {
    setIsLogin(login);
    setLoginError('');
    setSignupError('');
    setSuccess('');
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleSignupChange = (e) => {
    const { id, value, type, checked } = e.target;
    setSignupData({ ...signupData, [id]: type === 'checkbox' ? checked : value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setSuccess('');
    if (!loginData.email || !loginData.password) {
      setLoginError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Login successful! Redirecting...');
      localStorage.setItem('isLoggedIn', 'true');
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 2000);
    }, 1500);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupError('');
    setSuccess('');
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setSignupError('Please fill in all fields');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    if (!signupData.terms) {
      setSignupError('Please agree to the Terms & Conditions');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Account created successfully! Redirecting...');
      localStorage.setItem('isLoggedIn', 'true');
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="toggle-container">
        <div className="toggle">
          <div className={isLogin ? 'active' : ''} onClick={() => handleToggle(true)}>Login</div>
          <div className={!isLogin ? 'active' : ''} onClick={() => handleToggle(false)}>Sign Up</div>
        </div>
        <h3>Welcome to Our Platform</h3>
        <p>Access your account with just a few clicks</p>
      </div>
      <div className="form-container">
        {isLogin ? (
          <form className="login-form" onSubmit={handleLogin} autoComplete="off">
            <h2>Login to Your Account</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={loginData.email} onChange={handleLoginChange} placeholder="Enter your email" />
              <i className="fas fa-envelope"></i>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type={showPassword.login ? 'text' : 'password'} id="password" value={loginData.password} onChange={handleLoginChange} placeholder="Enter your password" />
              <i className="fas fa-lock"></i>
              <span className="password-toggle" onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}>
                <i className={showPassword.login ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
              {loginError && <div className="form-error">{loginError}</div>}
            </div>
            <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label htmlFor="remember-me" style={{ fontSize: 12, color: 'var(--light-text)', margin: 0 }}>Remember me</label>
                <input type="checkbox" id="remember-me" style={{ margin: 0 }} />
              </div>
              <a href="#" style={{ color: 'var(--primary-color)', fontSize: 12, textDecoration: 'none' }}>Forgot Password?</a>
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
            <h2>Create an Account</h2>
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
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type={showPassword.signup ? 'text' : 'password'} id="password" value={signupData.password} onChange={handleSignupChange} placeholder="Create a password" />
              <i className="fas fa-lock"></i>
              <span className="password-toggle" onClick={() => setShowPassword({ ...showPassword, signup: !showPassword.signup })}>
                <i className={showPassword.signup ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type={showPassword.confirm ? 'text' : 'password'} id="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} placeholder="Confirm your password" />
              <i className="fas fa-lock"></i>
              <span className="password-toggle" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
                <i className={showPassword.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
              {signupError && <div className="form-error">{signupError}</div>}
            </div>
            <div className="form-group">
              <input type="checkbox" id="terms" checked={signupData.terms} onChange={handleSignupChange} style={{ marginRight: 5 }} />
              <label htmlFor="terms" style={{ fontSize: 12, color: 'var(--light-text)' }}>I agree to the <a href="#" style={{ color: 'var(--primary-color)' }}>Terms & Conditions</a></label>
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
