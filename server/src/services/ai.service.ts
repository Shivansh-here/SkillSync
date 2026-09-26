import { GoogleGenAI, Type } from '@google/genai';

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from process.env
const ai = new GoogleGenAI({});

export const extractSkillsFromData = async (resumeText: string, githubData: any[]) => {
  const prompt = `
You are an expert technical recruiter and AI capability analyzer.
I am providing you with a candidate's resume text and their top GitHub repositories (including README snippets).
Analyze this data to extract their "Demonstrated Skills".

For each skill you identify, provide:
1. The name of the skill (e.g., "React", "Node.js", "Python", "Data Analysis")
2. The proficiency level (Beginner, Intermediate, Advanced) based on the context.
3. A brief "evidence snippet" explaining *why* you assigned this skill based on the provided text.

GitHub Data:
${JSON.stringify(githubData, null, 2)}

Resume Text:
${resumeText ? resumeText.substring(0, 10000) : 'No resume provided.'}
  `;

  try {
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
                  proficiency: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                  evidence: { type: Type.STRING }
                },
                required: ['skillName', 'proficiency', 'evidence']
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
          console.warn(`Extraction attempt ${attempt} failed with 503. Retrying...`);
          await new Promise(r => setTimeout(r, 2000));
        } else if (err.status === 429) {
          throw new Error('Your Google Gemini API key has exhausted its free daily quota (20 requests/day). Please upgrade your API key in Google AI Studio or try again tomorrow.');
        } else {
          throw err;
        }
      }
    }
  } catch (error: any) {
    console.error('Extraction error:', error);
    if (error.message.includes('daily quota') || error.message.includes('Rate Limit')) throw error;
    throw new Error('Failed to extract skills via AI');
  }
};
