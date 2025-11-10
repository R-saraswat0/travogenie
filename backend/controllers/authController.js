const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email transporter setup
const createEmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 EMAIL DEMO MODE - Credentials not configured');
    return null;
  }
  
  return nodemailer.createTransport({

    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email verification
const sendVerificationEmail = async (user, token) => {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.log('📧 EMAIL DEMO - Would send verification email to:', user.email);
      return;
    }
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: user.email,
      subject: 'Verify Your Email - TravOgenie',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E90FF;">Welcome to TravOgenie!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for registering with TravOgenie. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #1E90FF, #2ECC71); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Verify Email</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">TravOgenie - Your Travel Companion</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, token) => {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.log('📧 EMAIL DEMO - Would send reset email to:', user.email);
      return;
    }
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: user.email,
      subject: 'Password Reset - TravOgenie',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E90FF;">Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #1E90FF, #2ECC71); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">TravOgenie - Your Travel Companion</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create user
    const user = new User({ name, email, password });
    
    // Generate email verification token
    const verificationToken = user.createEmailVerificationToken();
    await user.save();
    
    // Send verification email
    await sendVerificationEmail(user, verificationToken);
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 },
        $set: { lastLogin: new Date() }
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }
    
    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Email verified successfully!'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }
    
    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();
    
    // Send reset email
    await sendPasswordResetEmail(user, resetToken);
    
    res.json({
      success: true,
      message: 'Password reset email sent! Please check your inbox.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    });
  }
};

// Logout (client-side token removal)
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  logout
};