import * as express from 'express';
import { Request, Response } from 'express';

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

export default router;