import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// Initiate GitHub Login
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'repo'] }));

// GitHub Callback
router.get('/github/callback', 
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed` }),
  (req, res) => {
    // Generate JWT
    const user: any = req.user;
    const payload = { id: user._id, githubId: user.githubId, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1d' });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
  }
);

// Get Current User
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
