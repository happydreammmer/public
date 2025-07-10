/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import { GoogleGenerativeAI, ChatSession, Content } from '@google/generative-ai';
import { MODEL_NAME } from '../config/constants';

let genAI: GoogleGenerativeAI;

export const updateApiKey = (key: string) => {
  genAI = new GoogleGenerativeAI(key);
};

const generateContent = async (contents: Content[], config?: any): Promise<string | null> => {
  if (!genAI) {
    throw new Error('API key not set.');
  }
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent({
      contents,
      generationConfig: config,
    });
    const response = await result.response;
    const text = response.text();
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
  const contents: Content[] = [
    {role: "user", parts: [
        {text: promptTemplate},
        {inlineData: {mimeType: mimeType, data: base64Audio}},
    ]},
  ];
  return generateContent(contents);
};

export const generateSummary = async (transcriptionText: string, promptTemplate: string): Promise<string | null> => {
  const prompt = promptTemplate.replace('${transcriptionText}', transcriptionText);
  const contents: Content[] = [{role: "user", parts: [{text: prompt}]}];
  return generateContent(contents);
};

export const generateActionItems = async (transcriptionText: string, promptTemplate: string): Promise<string | null> => {
  const prompt = promptTemplate.replace('${transcriptionText}', transcriptionText);
  const contents: Content[] = [{role: "user", parts: [{text: prompt}]}];
  const responseText = await generateContent(contents, { responseMimeType: "application/json" });
  return responseText ? cleanJsonString(responseText) : null;
};

export const generateSentimentAnalysis = async (transcriptionText: string, promptTemplate: string): Promise<string | null> => {
  const prompt = promptTemplate.replace('${transcriptionText}', transcriptionText);
  const contents: Content[] = [{role: "user", parts: [{text: prompt}]}];
  return generateContent(contents);
};

export const createChatSession = (systemInstructionText: string, initialModelResponseText: string): ChatSession => {
  if (!genAI) {
    throw new Error('API key not set.');
  }
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const history: Content[] = [
    { role: "user", parts: [{ text: systemInstructionText }] },
    { role: "model", parts: [{ text: initialModelResponseText }] }
  ];
  return model.startChat({ history });
};

export async function* sendChatMessageStream(chat: ChatSession, message: string): AsyncGenerator<string, void, undefined> {
  try {
    const result = await chat.sendMessageStream(message);
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      yield chunkText;
    }
  } catch (error) {
    console.error('Error sending chat message stream:', error);
    throw error;
  }
}
