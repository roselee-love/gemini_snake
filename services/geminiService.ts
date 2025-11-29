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
      I just finished playing a game of Whack-a-Mole (fairytale themed).
      My Score: ${score}.
      My previous High Score: ${highScore}.
      ${isNewHighScore ? "I beat my high score!" : "I did not beat my high score."}

      Please give me a very short, witty, 1-sentence commentary on my reflexes and performance.
      Adopt a cute, playful, or slightly mischievous persona.
      If the score is low (under 10), be gently teasing about my slow reaction time.
      If the score is high (over 30), be amazed at my speed.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });

    return response.text || "Time's up! The moles are safe... for now.";
  } catch (error) {
    console.error("Error fetching Gemini commentary:", error);
    return "Time's up! (AI is currently napping in a burrow)";
  }
};
