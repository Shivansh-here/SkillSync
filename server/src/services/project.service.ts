import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({});

export const generateMicroProjects = async (targetRole: string, gapAnalysis: any[]) => {
  try {
    // 1. Identify the top gaps (where market demand is high, but demonstrated is low)
    const criticalGaps = gapAnalysis
      .filter(g => g.market > g.demonstrated + 20) // Only look at gaps
      .sort((a, b) => (b.market - b.demonstrated) - (a.market - a.demonstrated))
      .slice(0, 3); // Take top 3 gaps

    if (criticalGaps.length === 0) {
      return []; // No major gaps!
    }

    const gapDetails = criticalGaps.map(g => `${g.subject} (Market Weight: ${g.market}, Current: ${g.demonstrated})`).join('\n');

    // 2. Ask LLM to generate targeted micro-projects
    const prompt = `
You are an expert AI career coach and senior software engineer.
A student wants to become a "${targetRole}". 
Based on our analysis, they have critical skill gaps in the following areas:
${gapDetails}

Generate ${criticalGaps.length} highly specific, bite-sized "micro-projects" (one for each gap) that the student can build in a weekend to learn and prove that specific skill.

For each project provide:
- title: A catchy, action-oriented title.
- targetSkill: The specific skill from the gap list this addresses.
- description: 2-3 sentences explaining what to build and why it proves the skill.
- difficulty: "Beginner", "Intermediate", or "Advanced".
    `;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  targetSkill: { type: Type.STRING },
                  description: { type: Type.STRING },
                  difficulty: { type: Type.STRING }
                },
                required: ['title', 'targetSkill', 'description', 'difficulty']
              }
            },
            temperature: 0.7
          }
        });

        if (response.text) {
          const projects = JSON.parse(response.text);
          // Add default status
          return projects.map((p: any) => ({ ...p, status: 'NOT_STARTED' }));
        }
        return [];
      } catch (err: any) {
        if (err.status === 503 && attempt < 3) {
          await new Promise(r => setTimeout(r, 2000));
        } else if (err.status === 429) {
          throw new Error('Your Google Gemini API key has exhausted its free daily quota (20 requests/day). Please upgrade your API key in Google AI Studio or try again tomorrow.');
        } else {
          throw err;
        }
      }
    }
  } catch (error: any) {
    console.error('Project generation error:', error);
    if (error.message?.includes('daily quota') || error.message?.includes('Rate Limit')) throw error;
    throw new Error('Failed to generate projects');
  }
};
