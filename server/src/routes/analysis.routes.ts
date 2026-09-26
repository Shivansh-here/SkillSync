import { Router } from 'express';
import User from '../models/User';
import { analyzeMarketDemand } from '../services/market.service';
import { calculateJobFitAndGaps } from '../services/analysis.service';
import { generateMicroProjects } from '../services/project.service';

const router = Router();

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

router.post('/market-fit', authenticate, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.demonstratedSkills || user.demonstratedSkills.length === 0) {
      return res.status(400).json({ error: 'Please run Capability Extraction first.' });
    }

    // 1. Get Market Demand via AI
    console.log(`Analyzing market demand for role: ${user.targetRole}`);
    const marketDemand = await analyzeMarketDemand(user.targetRole || 'Software Engineer');
    user.marketDemand = marketDemand;

    // 2. Calculate Job-Fit Score and Radar Gap Data
    console.log('Calculating gaps and job fit score...');
    const analysis = calculateJobFitAndGaps(user.demonstratedSkills, marketDemand, user.selfRatedSkills || []);
    
    user.jobFitScore = analysis.jobFitScore;
    await user.save();

    res.json({
      message: 'Market Analysis complete',
      jobFitScore: analysis.jobFitScore,
      radarData: analysis.radarData,
      marketDemand: marketDemand
    });
  } catch (error: any) {
    console.error('Market analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to process market analysis' });
  }
});

router.post('/generate-projects', authenticate, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.marketDemand || !user.demonstratedSkills) {
      return res.status(400).json({ error: 'Run market analysis first.' });
    }

    const gapAnalysis = calculateJobFitAndGaps(user.demonstratedSkills, user.marketDemand, user.selfRatedSkills || []).radarData;
    
    console.log('Generating micro-projects...');
    const projects = await generateMicroProjects(user.targetRole || 'Software Engineer', gapAnalysis);
    
    user.microProjects = projects;
    await user.save();

    res.json({
      message: 'Projects generated successfully',
      projects
    });
  } catch (error: any) {
    console.error('Project generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate projects' });
  }
});

router.post('/complete-project', authenticate, async (req: any, res: any) => {
  try {
    const { projectTitle } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.microProjects) return res.status(400).json({ error: 'No projects found' });

    let updated = false;
    const updatedProjects = user.microProjects.map((p: any) => {
      if (p.title === projectTitle) {
        updated = true;
        return { ...p, status: 'COMPLETED' };
      }
      return p;
    });

    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    user.microProjects = updatedProjects;
    
    // Bonus Polish: Slightly bump the job fit score when a project is completed
    if (user.jobFitScore && user.jobFitScore < 100) {
      user.jobFitScore = Math.min(100, user.jobFitScore + 3);
    }
    
    await user.save();

    res.json({ message: 'Project completed!', projects: user.microProjects, jobFitScore: user.jobFitScore });
  } catch (error: any) {
    console.error('Complete project error:', error);
    res.status(500).json({ error: error.message || 'Failed to complete project' });
  }
});

export default router;
