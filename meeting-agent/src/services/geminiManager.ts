/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { MODEL_NAME } from '../config/constants';

let genAI: GoogleGenAI;

export const updateApiKey = (key: string) => {
  genAI = new GoogleGenAI({ apiKey: key });
};

const generateContent = async (contents: any[], config?: any): Promise<string | null> => {
  if (!genAI) {
    throw new Error('API key not set.');
  }
  try {
    const response: GenerateContentResponse = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: config,
    });
    const text = response.text;
    return text && text.trim() !== '' ? text : null;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

const cleanJsonString = (jsonStr: string): string => {
  let cleaned = jsonStr.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleaned.match(fenceRegex);
  if (match && match[2]) {
    cleaned = match[2].trim();
  }
  return cleaned;
};

export const generateTranscription = async (base64Audio: string, mimeType: string, promptTemplate: string): Promise<string | null> => {
  const contents = [
    { text: promptTemplate },
    { inlineData: { mimeType: mimeType, data: base64Audio } },
  ];
  return generateContent(contents);
};

export const generateSummary = async (transcriptionText: string, promptTemplate: string): Promise<string | null> => {
  const prompt = promptTemplate.replace('${transcriptionText}', transcriptionText);
  const contents = [{ text: prompt }];
  return generateContent(contents);
};

export const generateActionItems = async (transcriptionText: string, promptTemplate: string): Promise<string | null> => {
  const prompt = promptTemplate.replace('${transcriptionText}', transcriptionText);
  const contents = [{ text: prompt }];
  const responseText = await generateContent(contents, { responseMimeType: "application/json" });
  return responseText ? cleanJsonString(responseText) : null;
};

export const generateSentimentAnalysis = async (transcriptionText: string, promptTemplate: string): Promise<string | null> => {
  const prompt = promptTemplate.replace('${transcriptionText}', transcriptionText);
  const contents = [{ text: prompt }];
  return generateContent(contents);
};

export const createChatSession = (systemInstructionText: string, initialModelResponseText: string): Chat => {
  if (!genAI) {
    throw new Error('API key not set.');
  }
  const history = [
    { role: "user", parts: [{ text: systemInstructionText }] },
    { role: "model", parts: [{ text: initialModelResponseText }] }
  ];
  return genAI.chats.create({
    model: MODEL_NAME,
    config: {},
    history: history,
  });
};

export async function* sendChatMessageStream(chat: Chat, message: string): AsyncGenerator<string, void, undefined> {
  try {
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      const chunkText = chunk.text || '';
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error('Error sending chat message stream:', error);
    throw error;
  }
}
