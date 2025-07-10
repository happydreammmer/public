
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { getApiKey } from "../lib/apiKey";

// This assumes process.env.API_KEY is available in the execution environment.
// For pure client-side applications, embedding API keys is a security risk.
// This implementation follows the guideline to use process.env.API_KEY directly.
let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = getApiKey();
    if (!apiKey) {
      // Log to console for developer, UI should show a user-friendly message from where this is called
      console.error("API key is not set.");
      throw new Error("Gemini API key is not configured. Please enter your API key.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const resetAiClient = () => {
  ai = null;
};

export const extractTextFromData = async (
  base64Data: string,
  mimeType: string
): Promise<string> => {
  const client = getAiClient();

  const dataPart: Part = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const textInstructionPart: Part = {
    text: `Perform Optical Character Recognition (OCR) on the provided document or image. 
Extract all textual content visible. 
If the document is multi-page (e.g., PDF), ensure text from all pages is extracted and presented sequentially. 
Maintain the original structure and formatting as much as possible in the extracted text.
Focus on accuracy and completeness of the text extraction.`,
  };

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ parts: [dataPart, textInstructionPart] }],
      // safetySettings can be adjusted if needed, but default should be fine for OCR.
      // e.g. [{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }]
    });
    
    // Use the .text accessor for the full text response
    return response.text ?? "";

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Attempt to provide a more specific error message if available
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("The Gemini API key is invalid or has expired. Please check your configuration.");
    }
    if (error instanceof Error) {
        throw new Error(`Failed to extract text using Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
