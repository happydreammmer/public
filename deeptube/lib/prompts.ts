/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

export const AI_PROMPTS = {
  ESSENTIALS: `Process this YouTube video content:
Extract the essentials:
1- Video's Main Purpose/Goal: (In one/two sentences)
2- Brief Summary: (one/two paragraphs)
3- Key Points (3-5): (Bulleted)
4- Primary Topics: (Listed)
5- General Flow/Map: (How the video is organized)
6- Quotes / Best Parts: (Parts worth remembering)

Respond with the extracted information clearly labeled for each section. For example:

MAIN PURPOSE/GOAL:
[Your answer here]

BRIEF SUMMARY:
[Your answer here]

KEY POINTS:
- [Point 1]
- [Point 2]
- [Point 3]

PRIMARY TOPICS:
- [Topic 1]
- [Topic 2]

GENERAL FLOW/MAP:
[Your answer here]

QUOTES / BEST PARTS:
- "[Quote 1]"
- "[Quote 2]"
`,

  QUICK_SUMMARY: `Create a quick, scannable summary of the provided video. Use the following structure and markdown:

- **Main Topic:** (A few words describing the main subject)
- **Purpose:** (A short sentence on what the video aims to do)
- **3 Key Takeaways:**
  - Takeaway 1
  - Takeaway 2
  - Takeaway 3
- **Who Should Watch:** (Describe the target audience)
- **Action Item:** (Suggest one concrete action the viewer can take after watching)`,

  TRANSCRIPTION: `Provide a clean and readable transcription of the provided video. Include timestamps in the format [ 0m8s ] (minutes and seconds only, no milliseconds). If possible, include speaker labels. For example:

[0m1s] Speaker 1: Hello and welcome to the video.
[0m5s] Speaker 2: Today we'll be discussing...
...
`,

  QUOTES_HIGHLIGHTS: `From the provided video, extract the most memorable quotes and highlights. Organize them under the following Markdown headings:

### **Memorable Quotes**
(List statements that are particularly insightful, witty, or representative of the video's message.)

### **Key Moments**
(Describe the most important segments or turning points in the video's narrative or argument.)

### **Actionable Advice**
(List any specific, practical tips or steps suggested in the video.)`,

  TOPICS_TIMELINE: `Based on the provided video, create a topic timeline. Break down the video into its major sections and list the sub-topics discussed within each. For example:

### **(0-2 minutes) Introduction & Setup**
-   Initial problem or question posed
-   Overview of what the video will cover

### **(2-5 minutes) Core Concept Explained**
-   Detailed breakdown of the main topic
-   Examples and illustrations provided

### **(5-8 minutes) Practical Application**
-   Demonstration of the concept in action
-   Discussion of real-world implications

*(Note: If timestamps aren't available, use conceptual sections instead of time-based ones.)*`,

  ACTION_ITEMS: `Analyze the provided video and extract all actionable insights. Present them in a clear, organized list using Markdown.

### **Specific Action Items**
(List concrete, step-by-step actions the viewer is encouraged to take.)

### **Tools & Resources Mentioned**
(List any software, websites, books, or other resources mentioned in the video.)

### **Next Steps for Viewers**
(Outline the recommended next steps or further learning paths for someone who has just watched the video.)`,

  RECORD_EVENTS: `Provide a detailed record of everything that happens in this video. Map all visual, audio, and content events to text. Include:

### **Visual Events & Design**
- Scene changes and visual transitions
- On-screen text, graphics, and animations  
- Camera movements and shot types
- Visual effects and editing techniques
- Color schemes and visual aesthetics

### **Audio Events & Production**
- Background music and sound effects
- Audio transitions and mixing
- Voice-over and dialogue patterns
- Audio quality and production notes

### **Content Flow & Structure**
- Topic transitions and content organization
- Pacing and timing of information delivery
- Introduction, body, and conclusion structure
- Key moments and emphasis points

### **Editing & Production Techniques**
- Cut types and editing style
- Graphics and overlay usage
- B-roll and supplementary footage
- Overall production quality and style

Create a comprehensive text-based record that captures the full audio-visual experience of the video.`,
};

// Ensure type safety for prompt keys
export type AiPromptKey = keyof typeof AI_PROMPTS;
