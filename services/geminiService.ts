
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDeviceAssistantResponse(value: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user just selected the value ${value} on an industrial-style controller. Briefly explain what this value might represent in different contexts (like frequency, power, scale, or speed). Keep it very short, 1-2 sentences.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Assistant error:", error);
    return null;
  }
}
