import { Router } from 'express';
import User from '../models/User';
import { fetchUserReposAndReadmes } from '../services/github.service';
import { extractSkillsFromData } from '../services/ai.service';

const router = Router();

// Middleware to extract user ID (same as user.routes.ts, should be extracted to a shared file later)
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  import('jsonwebtoken').then(jwt => {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'supersecret') as any;
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  });
};

router.post('/extract', authenticate, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 1. Fetch GitHub Data
    let githubData = [];
    if (user.username) {
      console.log(`Fetching repos for ${user.username}...`);
      githubData = await fetchUserReposAndReadmes(user.username);
    }

    // 2. Pass to AI for Capability Extraction
    console.log('Sending data to Gemini API for extraction...');
    const demonstratedSkills = await extractSkillsFromData(user.resumeText || '', githubData);

    // 3. Save to User Profile
    user.demonstratedSkills = demonstratedSkills;
    await user.save();

    res.json({ message: 'Capability extraction complete', skills: demonstratedSkills });
  } catch (error: any) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: error.message || 'Failed to process extraction' });
  }
});

export default router;
