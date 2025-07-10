/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fast/Simplified versions of prompts - optimized for speed over comprehensiveness
 */
import { LanguageCode } from './i18n';

export const TRANSCRIPTION_PROMPT_TEMPLATE = `Transcribe this audio recording accurately. Label each speaker as 'Speaker 1:', 'Speaker 2:', etc. Keep the original language and note any unclear parts as [unclear].`;

export const SUMMARY_PROMPT_TEMPLATE = `Summarize this meeting transcript. Use the same language as the transcript. Include:

## Key Points
- Main topics discussed

## Decisions
- What was decided

## Next Steps
- Follow-up actions needed

Transcription:
\${transcriptionText}`;

export const ACTION_ITEMS_PROMPT_TEMPLATE = `Extract action items from this transcript. Return JSON format only. Use the same language as the transcript.

Find tasks with clear owners when mentioned. Format:
[
  { "task": "task description", "assignee": "person name" },
  { "task": "task without owner" }
]

Transcription:
\${transcriptionText}`;

export const SENTIMENT_ANALYSIS_PROMPT_TEMPLATE = `Analyze the sentiment of this meeting. Use the same language as the transcript.

## Overall Sentiment
[Positive/Negative/Neutral/Mixed]

## Key Observations
- General mood
- Any concerns raised
- Team dynamics

Transcription:
\${transcriptionText}`;

export const QA_CHAT_SYSTEM_INSTRUCTION_TEMPLATE = `You have access to a meeting transcript. Answer questions about the meeting content.

Rules:
- Answer in the same language as the user's question
- Base answers only on the transcript content
- Say "not mentioned" if information isn't in the transcript
- Use simple formatting

TRANSCRIPT:
\${transcriptionText}`;

export const QA_CHAT_INITIAL_MODEL_RESPONSES: Record<LanguageCode, string> = {
  en: `I have your meeting transcript. Ask me anything about what was discussed, decided, or who said what. I'll answer in your preferred language.`,
  ar: `لدي نص اجتماعك. اسألني أي شيء عما تمت مناقشته أو تقريره أو من قال ماذا. سأجيب بلغتك المفضلة.`,
  fa: `من رونویسی جلسه شما را دارم. هر چیزی در مورد آنچه بحث شد، تصمیم گرفته شد، یا چه کسی چه گفت را از من بپرسید. من به زبان دلخواه شما پاسخ خواهم داد.`
};
