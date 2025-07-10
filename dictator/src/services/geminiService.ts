import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { MODEL_NAME } from '../utils/constants';
import { marked } from 'marked';

export class GeminiService {
  private genAI: GoogleGenAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({apiKey});
  }

  async getTranscription(base64Audio: string, mimeType: string): Promise<string> {
    if (!base64Audio || !mimeType) {
      console.error("GeminiService.getTranscription: base64Audio and mimeType are required.");
      throw new Error("Audio data or mimeType missing for transcription.");
    }

    const contents = [
      { text: 'Generate a complete, detailed transcript of this audio.' },
      { inlineData: { mimeType: mimeType, data: base64Audio } },
    ];

    try {
      const response: GenerateContentResponse = await this.genAI.models.generateContent({
        model: MODEL_NAME,
        contents: contents as any,
      });
      return response.text || '';
    } catch (error) {
      console.error('Error in GeminiService.getTranscription:', error);
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getAIResponse(prompt: string, customSystemInstruction?: string): Promise<{text: string, html: string}> {
    if (!prompt || prompt.trim() === '') {
      console.warn("GeminiService.getAIResponse: Prompt is empty.");
      return {text: "", html: "<p><em>Prompt was empty.</em></p>"};
    }
    
    const systemInstructionToUse = customSystemInstruction ||
      "You are a multilingual AI assistant. The user will provide a prompt that was transcribed from their voice. Respond directly to the user's query in the same language they used. Treat the input as a direct question or command.";

    const contents = [{ text: prompt }];
    try {
      const response: GenerateContentResponse = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstructionToUse
        }
      });
      const textResponse = response.text || '';
      const htmlResponse = typeof marked.parse === 'function' ? await marked.parse(textResponse) : textResponse;
      return { text: textResponse, html: htmlResponse };
    } catch (error) {
      console.error('Error in GeminiService.getAIResponse:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`AI response generation failed: ${errorMessage}`);
    }
  }
}
