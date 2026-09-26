import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({});

export const analyzeMarketDemand = async (targetRole: string) => {
  try {
    // 1. Load curated job descriptions
    const jobsFilePath = path.join(__dirname, '../data/jobs.json');
    const jobsData = JSON.parse(fs.readFileSync(jobsFilePath, 'utf8'));

    // Find descriptions that match the target role (or closest match)
    const matchingRole = jobsData.find((j: any) => 
      targetRole.toLowerCase().includes(j.title.toLowerCase().split(' ')[0])
    ) || jobsData[0]; // Fallback to first if no exact match for hackathon MVP

    const descriptions = matchingRole.descriptions.join('\n\n---\n\n');

    // 2. Ask LLM to extract and weight skills
    const prompt = `
You are an expert tech recruiter and data analyst.
Analyze the following batch of job descriptions for a "${matchingRole.title}" role.
Extract the top 6 most demanded skills across these descriptions.
For each skill, assign a "marketWeight" from 0 to 100 based on how frequently and strongly it is required. (e.g. Core language/framework = 90-100, secondary tool = 50-70).

Job Descriptions:
${descriptions}
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
                  skillName: { type: Type.STRING },
                  marketWeight: { type: Type.INTEGER }
                },
                required: ['skillName', 'marketWeight']
              }
            },
            temperature: 0.1
          }
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
        return [];
      } catch (err: any) {
        if (err.status === 503 && attempt < 3) {
          console.warn(`Attempt ${attempt} failed with 503. Retrying...`);
          await new Promise(r => setTimeout(r, 2000));
        } else if (err.status === 429) {
          throw new Error('Your Google Gemini API key has exhausted its free daily quota (20 requests/day). Please upgrade your API key in Google AI Studio or try again tomorrow.');
        } else {
          throw err;
        }
      }
    }
  } catch (error: any) {
    console.error('Market analysis error:', error);
    if (error.message?.includes('daily quota') || error.message?.includes('Rate Limit')) throw error;
    throw new Error('Failed to analyze market demand');
  }
};
