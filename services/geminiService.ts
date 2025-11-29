import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// NOTE: API Key is expected to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGameOverCommentary = async (score: number, highScore: number): Promise<string> => {
  try {
    const isNewHighScore = score > highScore;
    
    const prompt = `
      I just finished playing a game of Snake.
      My Score: ${score}.
      My previous High Score: ${highScore}.
      ${isNewHighScore ? "I beat my high score!" : "I did not beat my high score."}

      Please give me a very short, witty, 1-sentence commentary on my performance. 
      If the score is low (under 5), be sarcastically funny. 
      If the score is high (over 20), be impressed.
      Otherwise, be encouraging but casual.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 50,
        temperature: 0.9,
      }
    });

    return response.text || "Game Over! Better luck next time.";
  } catch (error) {
    console.error("Error fetching Gemini commentary:", error);
    return "Game Over! (AI currently sleeping)";
  }
};