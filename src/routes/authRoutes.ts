import * as express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Customer from '../models/Customer';

const router = express.Router();

// Admin login
router.post('/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check credentials against environment variables
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'DanielMech@2025!Secure';


  if (username === adminUsername && password === adminPassword) {
    // In a production app, you'd generate a JWT token here
    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      // For now, just return a simple token
      token: 'admin-authenticated'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

// Customer login
router.post('/customer/login', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;

    // Find customer by phone number
    const customer = await Customer.findOne({ phoneNumber });
    if (!customer) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid phone number or password' 
      });
    }

    // Check if customer has a password set
    if (!customer.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please contact support to set up your password' 
      });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid phone number or password' 
      });
    }

    // In a production app, you'd generate a JWT token here
    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      token: `customer-${customer._id}`,
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Request password reset
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Find customer by phone number
    const customer = await Customer.findOne({ phoneNumber });
    if (!customer) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with this phone number exists, a reset code has been generated.'
      });
    }

    // Generate reset token (6-digit code)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the token before storing
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token and expiration (15 minutes)
    customer.resetPasswordToken = hashedToken;
    customer.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await customer.save();

    // In a real app, you would send this via SMS
    // For demo purposes, we'll return it in the response
    console.log(`Password reset code for ${phoneNumber}: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'Reset code generated. In a real app, this would be sent via SMS.',
      // Remove this in production - only for demo
      resetCode: resetToken
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reset password with token
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, resetCode, newPassword } = req.body;

    if (!phoneNumber || !resetCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, reset code, and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash the provided reset code
    const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');

    // Find customer with valid reset token
    const customer = await Customer.findOne({
      phoneNumber,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    customer.password = hashedPassword;
    customer.resetPasswordToken = undefined;
    customer.resetPasswordExpires = undefined;
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;