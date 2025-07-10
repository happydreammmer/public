/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import {
  GenerateContentConfig,
  GoogleGenAI,
  Part,
  GenerateContentResponse, // Updated import
} from '@google/genai';
import { getApiKey } from './apiKey';

// API key must be obtained exclusively from the environment variable process.env.API_KEY
// Assume this variable is pre-configured, valid, and accessible in the execution context.
// const API_KEY = process.env.API_KEY;

interface StreamTextOptions {
  modelName: string; 
  prompt: string;
  videoUrl?: string;
  temperature?: number;
  // SafetySetting can be part of GenerateContentConfig if needed at top level
}

/**
 * Generate text content using the Gemini API, returning a stream of responses.
 *
 * @param options - Configuration options for the generation request.
 * @returns An async iterable iterator of GenerateContentResponse chunks.
 */
export async function streamText( // Renamed and updated return type
  options: StreamTextOptions,
): Promise<AsyncIterableIterator<GenerateContentResponse>> {
  const {
    modelName = 'gemini-2.5-flash', 
    prompt,
    videoUrl,
    temperature = 0.7, 
  } = options;

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      'API key is missing. Ensure it is set in the application.',
    );
  }

  const ai = new GoogleGenAI({apiKey});

  const contentParts: Part[] = [{text: prompt}];

  if (videoUrl) {
    // Keeping the user's existing logic for video part.
    // Note: Client-side fileUri for remote URLs like YouTube is generally not supported
    // for direct video processing by Gemini client SDKs. This might not work as expected
    // for actual video content analysis without a backend or different data provision method.
    contentParts.unshift({ 
      fileData: {
        mimeType: 'video/mp4',
        fileUri: videoUrl,
      },
    });
  }

  const generationConfig: GenerateContentConfig = {
    temperature,
    // topK, topP, etc. can be added here if needed
  };

  const requestParams = {
    model: modelName,
    contents: [{role: 'user', parts: contentParts}],
    generationConfig: generationConfig,
    // safetySettings: options.safetySettings, // safetySettings can be added here
  };

  try {
    // ai.models.generateContentStream returns the stream directly
    const stream = ai.models.generateContentStream(requestParams);
    return stream;
  } catch (error) {
    console.error(
      'An error occurred when trying to start the Gemini API stream:',
      error,
    );
    // Re-throw the error to be caught by the caller
    throw error;
  }
}
