
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuizForVideo = async (videoTitle: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um questionário de 3 perguntas de múltipla escolha para um vídeo educativo com o título "${videoTitle}" e descrição "${description}". O formato deve ser JSON em português brasileiro.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.INTEGER, description: "Índice da resposta correta (0-3)" }
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao gerar quiz:", error);
    return null;
  }
};
