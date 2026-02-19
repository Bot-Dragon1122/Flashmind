import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard } from "../types/flashcard";

// Initialize AI client lazily to avoid errors when API key is not yet set
let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Gemini API key not found. Make sure VITE_GEMINI_API_KEY is set in your .env file."
      );
    }

    ai = new GoogleGenAI({ apiKey });
  }

  return ai;
};



export const generateFlashcardsFromPDF = async (
  base64Data: string,
  fileName: string
): Promise<Flashcard[]> => {
  const client = getAIClient();
  const model = "gemini-3-flash-preview";
  
  const response = await client.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data,
            },
          },
          {
            text: "Analyze this document and extract the most important concepts to create a high-quality set of flashcards. Each flashcard must consist of a concise question and a comprehensive but brief answer. Focus on key terms, definitions, and important facts. Return a JSON array of objects with 'question' and 'answer' fields. Generate between 10 to 20 cards if the content allows.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The question part of the flashcard.",
            },
            answer: {
              type: Type.STRING,
              description: "The answer part of the flashcard.",
            },
          },
          required: ["question", "answer"],
        },
      },
    },
  });

  try {
    const rawText = response.text;
    if (!rawText) throw new Error("No response text from Gemini");
    
    const cards: Omit<Flashcard, 'id'>[] = JSON.parse(rawText);
    return cards.map((card, index) => ({
      ...card,
      id: `${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error("Failed to parse flashcards:", error);
    throw new Error("Failed to process the generated flashcards.");
  }
};
