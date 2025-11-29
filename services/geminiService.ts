import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    // Accessing process.env.API_KEY directly allows Vite to replace it with the string literal at build time.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const getGameOverCommentary = async (score: number, highScore: number): Promise<string> => {
  try {
    const client = getAiClient();
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

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });

    return response.text || "Game Over! Better luck next time.";
  } catch (error) {
    console.error("Error fetching Gemini commentary:", error);
    return "Game Over! (AI currently sleeping)";
  }
};