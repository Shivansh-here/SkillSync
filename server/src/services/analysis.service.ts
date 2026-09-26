export const calculateJobFitAndGaps = (demonstratedSkills: any[], marketDemand: any[], selfRatedSkills: string[]) => {
  // 1. Calculate Job-Fit Score (0-100)
  // We compare what the market wants against what the user has demonstrated.
  
  let totalMarketWeight = 0;
  let earnedWeight = 0;

  // Normalized map of demonstrated skills for easy lookup
  const userSkillsMap = new Map();
  demonstratedSkills.forEach(s => {
    userSkillsMap.set(s.skillName.toLowerCase(), s.proficiency);
  });

  const proficiencyMultiplier: Record<string, number> = {
    'Advanced': 1.0,
    'Intermediate': 0.7,
    'Beginner': 0.4
  };

  const gapAnalysis = [];

  marketDemand.forEach(marketSkill => {
    totalMarketWeight += marketSkill.marketWeight;
    
    const skillLower = marketSkill.skillName.toLowerCase();
    
    // Fuzzy match (very basic for MVP)
    let matchedProficiency = null;
    for (const [uSkill, prof] of userSkillsMap.entries()) {
      if (uSkill.includes(skillLower) || skillLower.includes(uSkill)) {
        matchedProficiency = prof;
        break;
      }
    }

    let score = 0;
    if (matchedProficiency) {
      score = marketSkill.marketWeight * (proficiencyMultiplier[matchedProficiency] || 0);
      earnedWeight += score;
    }

    // Build data for radar chart: Self vs Demonstrated vs Market
    // We try to find if the user self-rated this skill
    const isSelfRated = selfRatedSkills.some(s => s.toLowerCase().includes(skillLower) || skillLower.includes(s.toLowerCase()));

    gapAnalysis.push({
      subject: marketSkill.skillName,
      market: marketSkill.marketWeight,
      demonstrated: matchedProficiency ? (proficiencyMultiplier[matchedProficiency] * 100) : 0,
      self: isSelfRated ? 80 : 20 // Arbitrary values for UI visualization
    });
  });

  const jobFitScore = totalMarketWeight > 0 ? Math.round((earnedWeight / totalMarketWeight) * 100) : 0;

  // Also include skills the user has that AREN'T in the market top 6 (just for radar completion)
  demonstratedSkills.forEach(s => {
    const isAlreadyInRadar = gapAnalysis.some(g => g.subject.toLowerCase() === s.skillName.toLowerCase());
    if (!isAlreadyInRadar && gapAnalysis.length < 8) {
       const isSelfRated = selfRatedSkills.some(selfS => selfS.toLowerCase().includes(s.skillName.toLowerCase()));
       gapAnalysis.push({
         subject: s.skillName,
         market: 20, // Not explicitly demanded in top 6
         demonstrated: proficiencyMultiplier[s.proficiency as string] * 100 || 0,
         self: isSelfRated ? 80 : 20
       });
    }
  });

  return {
    jobFitScore,
    radarData: gapAnalysis
  };
};
