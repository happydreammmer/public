/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import {
  GoogleGenAI,
  Chat,
  GenerateContentResponse,
  GenerateContentConfig,
  // Part, // No longer directly used here for history assembly
} from '@google/genai';
import { AnalysisTypeId, ANALYSIS_TYPES_CONFIG } from '@/components/AnalysisResultsDisplay'; // Import for display names
import { getApiKey } from './apiKey';

// API key must be obtained exclusively from the environment variable process.env.API_KEY
// const API_KEY = process.env.API_KEY;

// if (!API_KEY) {
//   console.warn(
//     'API key is missing. Ensure process.env.API_KEY is set for chat features.',
//   );
// }

const DEFAULT_CHAT_MODEL = 'gemini-2.5-flash';
const DEFAULT_SYSTEM_INSTRUCTION =
  'You are a helpful assistant. Based on the provided video analysis content (which may include essentials, transcription, quotes, timelines, action items, etc.), answer the user\'s questions about the video. Be concise and directly answer the question referring to the provided video content segments.';

interface CompletedAnalysisData {
  title: string; // Video title, mostly for consistency, context comes from content
  content: string;
}

/**
 * Starts a new chat session with the Gemini API.
 * @param allAnalysesData A map of completed analysis data for the video.
 * @param modelName The model to use for the chat.
 *   This will be part of the initial history.
 * @param systemInstruction Optional system instruction for the chat model.
 * @returns A Chat instance.
 */
export function startVideoChatSession(
  allAnalysesData: Map<AnalysisTypeId, CompletedAnalysisData>,
  modelName: string = DEFAULT_CHAT_MODEL,
  systemInstruction: string = DEFAULT_SYSTEM_INSTRUCTION,
): Chat {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key is not configured for chat.');
  }
  const ai = new GoogleGenAI({apiKey});

  const config: GenerateContentConfig = {};
  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  let aggregatedContext = "Here is the content of a video I want to discuss, broken down by analysis type:\n\n";
  if (allAnalysesData.size === 0) {
    aggregatedContext += "No specific analysis content is available for this video yet.\n";
  } else {
    allAnalysesData.forEach((data, analysisId) => {
      const analysisConfig = ANALYSIS_TYPES_CONFIG[analysisId];
      const displayName = analysisConfig ? analysisConfig.displayName : analysisId;
      aggregatedContext += `--- ${displayName} ---\n`;
      aggregatedContext += `${data.content || 'No content generated for this section.'}\n\n`;
    });
  }
  aggregatedContext += "<END_OF_VIDEO_CONTENT>\n\nNow, I will ask you questions about it.";


  const chat = ai.chats.create({
    model: modelName,
    config,
    history: [
      {
        role: 'user',
        parts: [{ text: aggregatedContext }],
      },
      {
        role: 'model',
        parts: [{ text: "Understood. I have reviewed the video content. Ask me anything." }],
      }
    ],
  });
  return chat;
}

/**
 * Sends a message in an existing chat session.
 * @param chat The Chat instance.
 * @param message The user's message.
 * @returns A Promise that resolves to the GenerateContentResponse.
 */
export async function sendMessageInSession(
  chat: Chat,
  message: string,
): Promise<GenerateContentResponse> {
  try {
    const response = await chat.sendMessage({message});
    return response;
  } catch (error) {
    console.error('Error sending message in chat session:', error);
    throw error; // Re-throw to be handled by the caller
  }
}