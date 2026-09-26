import { Router } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import User from '../models/User';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to extract user ID from headers (placeholder until proper middleware is built)
// In production, this would be a proper JWT verification middleware
const authenticate = (req: any, res: any, next: any) => {
  // We'll trust the user ID passed in a custom header for now in the MVP, 
  // or we can extract it from the JWT.
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

router.post('/onboarding', authenticate, upload.single('resume'), async (req: any, res: any) => {
  try {
    const { targetRole, selfRatedSkills } = req.body;
    let resumeText = '';

    if (req.file) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        targetRole,
        selfRatedSkills: JSON.parse(selfRatedSkills || '[]'),
        resumeText
      },
      { new: true }
    );

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
});

export default router;
