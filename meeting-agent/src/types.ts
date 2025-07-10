/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface MeetingRecord {
  id: string;
  rawTranscription: string; 
  summary: string; // Stores Markdown string
  actionItems: string; // Stores HTML string of action items <ul>...</ul>
  sentiment: string; // Stores Markdown string
  timestamp: number;
  title: string;
}

export type StatusType = 'info' | 'processing' | 'success' | 'error';

export type PromptMode = 'fast' | 'smart';
