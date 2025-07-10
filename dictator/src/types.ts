export interface Note {
  id: string;
  title: string; // Added for explicit title storage
  rawTranscription: string;
  promptResponse: string;
  timestamp: number;
  audioBase64?: string; // For audio playback
  audioMimeType?: string; // For audio playback
}

export interface AudioProcessingResult {
  base64Audio: string;
  mimeType: string;
}

// Elements required by LiveDisplayManager
export interface LiveDisplayElements {
  liveRecordingTitle: HTMLDivElement;
  liveWaveformCanvas: HTMLCanvasElement;
  liveRecordingTimerDisplay: HTMLDivElement;
  recordButton: HTMLButtonElement; // For icon change and ARIA attributes
  editorTitle: HTMLDivElement; // For getting current title for live display
  statusIndicatorDiv: HTMLDivElement | null; // To hide/show general status
  recordingInterface: HTMLDivElement; // To add/remove 'is-live' class
}

export interface UserSettings {
  customSystemInstruction?: string;
}
