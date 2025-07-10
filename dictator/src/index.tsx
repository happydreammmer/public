/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/* tslint:disable */

import { Note, AudioProcessingResult, LiveDisplayElements, UserSettings } from './types';
import {
  RAW_TRANSCRIPTION_PLACEHOLDER,
  PROMPT_OUTPUT_PLACEHOLDER,
  EDITOR_TITLE_PLACEHOLDER,
} from './utils/constants';
import { GeminiService } from './services/geminiService';
import { AudioManager } from './services/audioManager';
import { LiveDisplayManager } from './services/liveDisplay';
import { updateElementText, downloadFile } from './utils/uiUtils';
import { StorageService } from './services/storageService';
import { marked } from 'marked';
import { getApiKey, saveApiKey } from './utils/apiKey';
import './styles/index.css';

class VoiceNotesApp {
  private recordButton!: HTMLButtonElement;
  private newButton!: HTMLButtonElement;
  private uploadButton!: HTMLButtonElement;
  private audioFileInput!: HTMLInputElement;
  private settingsButton!: HTMLButtonElement;
  private historyToggleButton!: HTMLButtonElement;
  private themeToggleBtn!: HTMLButtonElement;
  private downloadRawBtn!: HTMLButtonElement;
  private downloadPromptBtn!: HTMLButtonElement;
  private downloadBothBtn!: HTMLButtonElement;
  private copyRawBtn!: HTMLButtonElement;
  private copyPromptBtn!: HTMLButtonElement;


  private recordingStatusEl!: HTMLDivElement;
  private rawTranscriptionEl!: HTMLDivElement;
  private promptOutputEl!: HTMLDivElement;
  private editorTitleEl!: HTMLDivElement;
  private recordingInterfaceEl!: HTMLDivElement;
  private liveRecordingTitleEl!: HTMLDivElement;
  private liveWaveformCanvasEl!: HTMLCanvasElement;
  private liveRecordingTimerDisplayEl!: HTMLDivElement;
  private statusIndicatorDivEl!: HTMLDivElement | null;
  private rawTranscriptionCardEl!: HTMLDivElement;
  private promptResponseCardEl!: HTMLDivElement;
  private themeIcon!: HTMLElement;


  // History Sidebar
  private historySidebarEl!: HTMLElement;
  private historyListEl!: HTMLUListElement;

  // Settings Modal
  private settingsModalEl!: HTMLDivElement;
  private closeSettingsBtn!: HTMLButtonElement;
  private saveSettingsBtn!: HTMLButtonElement;
  private customSystemInstructionTextarea!: HTMLTextAreaElement;

  // Audio Player
  private audioPlayerContainerEl!: HTMLDivElement;
  private audioPlaybackEl!: HTMLAudioElement;

  private geminiService!: GeminiService;
  private audioManager!: AudioManager;
  private liveDisplayManager!: LiveDisplayManager;
  private storageService!: StorageService;

  private currentNote: Note | null = null;
  private userSettings: UserSettings = {};
  private isProcessingAudio: boolean = false;
  private currentTheme: 'dark' | 'light' = 'dark';


  constructor(apiKey: string) {
    if (!apiKey) {
      this.handleFatalError("API_KEY is not set. Please ensure the API_KEY environment variable is configured.");
      return; // Stop initialization
    }
    this.geminiService = new GeminiService(apiKey);
    this.storageService = new StorageService();

    this.loadDOMElements();
    this.loadUserSettings();
    this.loadThemePreference();


    this.audioManager = new AudioManager(
      this.updateRecordingStatus.bind(this),
      this.handleAudioAvailable.bind(this),
      this.handleRecordingProcessed.bind(this),
      this.handleAudioManagerError.bind(this),
    );

    const liveDisplayElements: LiveDisplayElements = {
      liveRecordingTitle: this.liveRecordingTitleEl,
      liveWaveformCanvas: this.liveWaveformCanvasEl,
      liveRecordingTimerDisplay: this.liveRecordingTimerDisplayEl,
      recordButton: this.recordButton,
      editorTitle: this.editorTitleEl,
      statusIndicatorDiv: this.statusIndicatorDivEl,
      recordingInterface: this.recordingInterfaceEl,
    };
    this.liveDisplayManager = new LiveDisplayManager(liveDisplayElements);

    this.bindEventListeners();
    this.createNewNote(); // Initializes currentNote and UI
    this.updateButtonStates();
    this.updateRecordingStatus('Ready to record or upload audio');
    this.renderHistoryList();
    this.updateAudioPlayerVisibility();
    this.initializeSidebarState(); 
  }

  private handleFatalError(message: string): void {
    console.error(message);
    const statusEl = document.getElementById('recordingStatus') as HTMLDivElement | null;
    if (statusEl) {
        statusEl.textContent = `Configuration error: ${message}. App cannot function.`;
        statusEl.style.color = "red";
    }
    const buttonIds = ['recordButton', 'newButton', 'uploadButton', 'settingsButton', 'historyToggleBtn', 'downloadRawBtn', 'downloadPromptBtn', 'downloadBothBtn', 'copyRawBtn', 'copyPromptBtn', 'themeToggleBtn'];
    buttonIds.forEach(id => {
        const btn = document.getElementById(id) as HTMLButtonElement | null;
        if (btn) btn.disabled = true;
    });
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.innerHTML = `<div style="color: red; text-align: center; padding: 20px; font-size: 1.2em;">
            Critical error: ${message}. Please check console and environment configuration.
            </div>`;
    }
  }


  private loadDOMElements(): void {
    this.recordButton = document.getElementById('recordButton') as HTMLButtonElement;
    this.newButton = document.getElementById('newButton') as HTMLButtonElement;
    this.uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
    this.audioFileInput = document.getElementById('audioFileInput') as HTMLInputElement;
    this.settingsButton = document.getElementById('settingsButton') as HTMLButtonElement;
    this.historyToggleButton = document.getElementById('historyToggleBtn') as HTMLButtonElement;
    this.themeToggleBtn = document.getElementById('themeToggleBtn') as HTMLButtonElement;
    this.themeIcon = this.themeToggleBtn.querySelector('i') as HTMLElement;
    this.downloadRawBtn = document.getElementById('downloadRawBtn') as HTMLButtonElement;
    this.downloadPromptBtn = document.getElementById('downloadPromptBtn') as HTMLButtonElement;
    this.downloadBothBtn = document.getElementById('downloadBothBtn') as HTMLButtonElement;
    this.copyRawBtn = document.getElementById('copyRawBtn') as HTMLButtonElement;
    this.copyPromptBtn = document.getElementById('copyPromptBtn') as HTMLButtonElement;


    this.recordingStatusEl = document.getElementById('recordingStatus') as HTMLDivElement;
    this.rawTranscriptionEl = document.getElementById('rawTranscription') as HTMLDivElement;
    this.promptOutputEl = document.getElementById('promptOutput') as HTMLDivElement;
    this.rawTranscriptionCardEl = document.getElementById('rawTranscriptionCard') as HTMLDivElement;
    this.promptResponseCardEl = document.getElementById('promptResponseCard') as HTMLDivElement;
    this.editorTitleEl = document.querySelector('.editor-title') as HTMLDivElement;
    this.recordingInterfaceEl = document.querySelector('.recording-interface') as HTMLDivElement;
    this.liveRecordingTitleEl = document.getElementById('liveRecordingTitle') as HTMLDivElement;
    this.liveWaveformCanvasEl = document.getElementById('liveWaveformCanvas') as HTMLCanvasElement;
    this.liveRecordingTimerDisplayEl = document.getElementById('liveRecordingTimerDisplay') as HTMLDivElement;
    this.statusIndicatorDivEl = this.recordingInterfaceEl.querySelector('.status-indicator') as HTMLDivElement | null;

    this.historySidebarEl = document.getElementById('historySidebar') as HTMLElement;
    this.historyListEl = document.getElementById('historyList') as HTMLUListElement;

    this.settingsModalEl = document.getElementById('settingsModal') as HTMLDivElement;
    this.closeSettingsBtn = document.getElementById('closeSettingsBtn') as HTMLButtonElement;
    this.saveSettingsBtn = document.getElementById('saveSettingsBtn') as HTMLButtonElement;
    this.customSystemInstructionTextarea = document.getElementById('customSystemInstruction') as HTMLTextAreaElement;

    this.audioPlayerContainerEl = document.getElementById('audioPlayerContainer') as HTMLDivElement;
    this.audioPlaybackEl = document.getElementById('audioPlaybackElement') as HTMLAudioElement;

    if (!this.recordButton || !this.newButton || !this.uploadButton || !this.settingsButton || !this.historyToggleButton || !this.themeToggleBtn ||
        !this.downloadRawBtn || !this.downloadPromptBtn || !this.downloadBothBtn || !this.copyRawBtn || !this.copyPromptBtn ||
        !this.recordingStatusEl || !this.rawTranscriptionEl || !this.promptOutputEl || !this.editorTitleEl || !this.historySidebarEl || 
        !this.settingsModalEl || !this.audioPlayerContainerEl || !this.rawTranscriptionCardEl || !this.promptResponseCardEl) {
        this.handleFatalError("One or more critical UI elements could not be found. The application cannot start.");
    }
  }

  private bindEventListeners(): void {
    this.recordButton.addEventListener('click', () => this.toggleRecording());
    this.newButton.addEventListener('click', () => this.createNewNote());
    this.uploadButton.addEventListener('click', () => this.audioFileInput.click());
    this.audioFileInput.addEventListener('change', (event) => this.handleFileUpload(event));
    
    this.editorTitleEl.addEventListener('blur', () => this.handleTitleChange());
    this.rawTranscriptionEl.addEventListener('blur', () => this.handleContentEditableBlur(this.rawTranscriptionEl, 'rawTranscription'));
    this.promptOutputEl.addEventListener('blur', () => this.handleContentEditableBlur(this.promptOutputEl, 'promptResponse'));


    // History
    this.historyToggleButton.addEventListener('click', () => this.toggleHistorySidebar());

    // Settings
    this.settingsButton.addEventListener('click', () => this.openSettingsModal());
    this.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Downloads & Copy
    this.downloadRawBtn.addEventListener('click', () => this.downloadRawTranscription());
    this.downloadPromptBtn.addEventListener('click', () => this.downloadPromptResponse());
    this.downloadBothBtn.addEventListener('click', () => this.downloadBoth());
    this.copyRawBtn.addEventListener('click', () => this.copyCardContent(this.rawTranscriptionEl, this.copyRawBtn, 'Transcription'));
    this.copyPromptBtn.addEventListener('click', () => this.copyCardContent(this.promptOutputEl, this.copyPromptBtn, 'Response'));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this));
  }

  private updateButtonStates(): void {
    const R = this.recordButton; const N = this.newButton; const U = this.uploadButton;
    const SetB = this.settingsButton; const HistB = this.historyToggleButton; const ThemeB = this.themeToggleBtn;
    const DlR = this.downloadRawBtn; const DlP = this.downloadPromptBtn; const DlBoth = this.downloadBothBtn;
    const CR = this.copyRawBtn; const CP = this.copyPromptBtn;


    if (!R || !N || !U || !SetB || !HistB || !ThemeB || !DlR || !DlP || !DlBoth || !CR || !CP) return;

    const disableAllInteractions = this.isProcessingAudio;
    const disableDuringRecording = this.audioManager.isRecording;

    R.disabled = disableAllInteractions;
    N.disabled = disableAllInteractions || disableDuringRecording;
    U.disabled = disableAllInteractions || disableDuringRecording;
    SetB.disabled = disableAllInteractions || disableDuringRecording; 
    // HistB and ThemeB can remain active

    const hasRaw = this.currentNote && this.rawTranscriptionEl.innerText.trim() !== '' && !this.rawTranscriptionEl.classList.contains('placeholder-active');
    const hasPrompt = this.currentNote && this.promptOutputEl.innerText.trim() !== '' && !this.promptOutputEl.classList.contains('placeholder-active');


    DlR.disabled = disableAllInteractions || disableDuringRecording || !hasRaw;
    DlP.disabled = disableAllInteractions || disableDuringRecording || !hasPrompt;
    DlBoth.disabled = disableAllInteractions || disableDuringRecording || (!hasRaw && !hasPrompt);
    CR.disabled = disableAllInteractions || disableDuringRecording || !hasRaw;
    CP.disabled = disableAllInteractions || disableDuringRecording || !hasPrompt;
  }

  private updateRecordingStatus(status: string): void {
    this.recordingStatusEl.textContent = status;
  }

  private async toggleRecording(): Promise<void> {
    if (this.audioManager.isRecording) {
      await this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording(): Promise<void> {
    if (this.audioManager.isRecording || this.isProcessingAudio) return;

    this.isProcessingAudio = true;
    this.updateButtonStates();
    this.updateRecordingStatus('Initializing recorder...');
    this.clearPreviousOutputs();
    if(this.currentNote) { 
        this.currentNote.title = this.editorTitleEl.textContent || '';
    }


    const stream = await this.audioManager.start();
    if (stream && this.audioManager.isRecording) {
      this.isProcessingAudio = false; 
      this.updateButtonStates();
      this.liveDisplayManager.start(stream);
      this.updateRecordingStatus('Recording...');
    } else {
      if (this.isProcessingAudio) {
        this.isProcessingAudio = false;
        this.updateButtonStates();
      }
      this.liveDisplayManager.stop();
    }
  }

  private async stopRecording(): Promise<void> {
    if (!this.audioManager.isRecording || this.isProcessingAudio) return;

    this.isProcessingAudio = true;
    this.updateButtonStates();
    this.updateRecordingStatus('Stopping recording...');
    this.liveDisplayManager.stop();
    this.audioManager.stop();
  }
  
  private clearPreviousOutputs(): void {
    updateElementText(this.rawTranscriptionEl, null, RAW_TRANSCRIPTION_PLACEHOLDER, true);
    updateElementText(this.promptOutputEl, null, PROMPT_OUTPUT_PLACEHOLDER, true);
    this.rawTranscriptionCardEl.classList.remove('is-processing');
    this.promptResponseCardEl.classList.remove('is-processing');
    if (this.currentNote) {
      this.currentNote.rawTranscription = '';
      this.currentNote.promptResponse = '';
      this.currentNote.audioBase64 = undefined;
      this.currentNote.audioMimeType = undefined;
    }
    this.updateAudioPlayerVisibility();
    this.updateButtonStates();
  }

  private async handleAudioAvailable({ base64Audio, mimeType }: AudioProcessingResult): Promise<void> {
    this.updateRecordingStatus('Getting transcription...');
    this.rawTranscriptionCardEl.classList.add('is-processing');
    if (this.currentNote) {
        this.currentNote.audioBase64 = base64Audio;
        this.currentNote.audioMimeType = mimeType;
    }

    try {
      const transcriptionText = await this.geminiService.getTranscription(
        base64Audio,
        mimeType,
      );
      updateElementText(this.rawTranscriptionEl, transcriptionText, RAW_TRANSCRIPTION_PLACEHOLDER);
      if (this.currentNote) this.currentNote.rawTranscription = transcriptionText;
      this.rawTranscriptionCardEl.classList.remove('is-processing');

      if (transcriptionText && transcriptionText.trim() !== '') {
        await this.handleTranscriptionComplete(transcriptionText);
      } else {
        this.updateRecordingStatus('Transcription empty. No prompt to send.');
        updateElementText(this.promptOutputEl, '<em>Could not transcribe audio or transcription was empty.</em>', PROMPT_OUTPUT_PLACEHOLDER, true);
         if (this.currentNote) this.currentNote.promptResponse = "Transcription empty.";
      }
    } catch (error) {
      console.error('Error during transcription or AI response phase:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.updateRecordingStatus(`Error: ${errorMessage}`);
      updateElementText(this.rawTranscriptionEl, `<em>Processing error: ${errorMessage}</em>`, RAW_TRANSCRIPTION_PLACEHOLDER, true);
      updateElementText(this.promptOutputEl, '<em>AI response cannot be generated due to error.</em>', PROMPT_OUTPUT_PLACEHOLDER, true);
      this.rawTranscriptionCardEl.classList.remove('is-processing');
      this.promptResponseCardEl.classList.remove('is-processing');
      if (this.currentNote) {
        this.currentNote.rawTranscription = `Error: ${errorMessage}`;
        this.currentNote.promptResponse = "Error during processing.";
      }
    } finally {
      this.isProcessingAudio = false;
      this.finalizeNoteProcessing(); 
      this.updateButtonStates();
      if (!this.audioManager.isRecording) {
          this.updateRecordingStatus('Processing complete. Ready.');
      }
      this.updateAudioPlayerVisibility();
    }
  }

  private async handleTranscriptionComplete(transcription: string): Promise<void> {
    this.updateRecordingStatus('Getting AI response...');
    this.promptResponseCardEl.classList.add('is-processing');
    try {
      const {text: aiResponseText, html: htmlContent} = await this.geminiService.getAIResponse(transcription, this.userSettings.customSystemInstruction);
      updateElementText(this.promptOutputEl, htmlContent, PROMPT_OUTPUT_PLACEHOLDER, true);
      
      if (this.currentNote) this.currentNote.promptResponse = aiResponseText; // Store raw text
      this.trySetTitleFromAIResponse(aiResponseText); 
      this.updateRecordingStatus('AI Response received.');
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.updateRecordingStatus(`AI response error: ${errorMsg}`);
      updateElementText(this.promptOutputEl, `<em>Error generating AI response: ${errorMsg}</em>`, PROMPT_OUTPUT_PLACEHOLDER, true);
      if (this.currentNote) this.currentNote.promptResponse = `AI Error: ${errorMsg}`;
    } finally {
        this.promptResponseCardEl.classList.remove('is-processing');
        this.updateButtonStates();
    }
  }
  
  private handleTitleChange(): void {
    if (!this.currentNote || this.audioManager.isRecording || this.isProcessingAudio) return;

    const newTitleText = this.editorTitleEl.textContent?.trim() || '';
    // Stored title is either the actual title or EDITOR_TITLE_PLACEHOLDER if it was set that way
    // For comparison, treat stored EDITOR_TITLE_PLACEHOLDER as empty string if it's the default
    const currentStoredTitleComparable = (this.currentNote.title === EDITOR_TITLE_PLACEHOLDER && newTitleText === '') ? '' : this.currentNote.title;


    if (currentStoredTitleComparable !== newTitleText) {
        this.currentNote.title = newTitleText === '' ? EDITOR_TITLE_PLACEHOLDER : newTitleText;
        this.storageService.saveNote(this.currentNote);
        this.renderHistoryList(); // Re-render to reflect potential title change in list
        console.log("Title updated and saved.");
    }
  }

  private handleContentEditableBlur(element: HTMLDivElement, noteProperty: 'rawTranscription' | 'promptResponse'): void {
    if (!this.currentNote || this.audioManager.isRecording || this.isProcessingAudio) return;

    let newActualContent: string;
    // If placeholder is active, it means the content is effectively empty.
    // uiUtils should ensure placeholder text itself isn't submitted.
    if (element.classList.contains('placeholder-active')) {
        newActualContent = ''; 
    } else {
        newActualContent = element.innerText; // Get the pure text content
    }

    if (this.currentNote[noteProperty] !== newActualContent) {
        this.currentNote[noteProperty] = newActualContent;
        this.storageService.saveNote(this.currentNote);
        console.log(`${noteProperty} updated and saved.`);
        this.updateButtonStates(); // Content might have changed affecting download/copy buttons
    }
  }


  private trySetTitleFromAIResponse(aiResponseText: string): void {
    if (!aiResponseText || !this.editorTitleEl) return;

    const currentEditorTitle = this.editorTitleEl.textContent?.trim();
    if (currentEditorTitle && currentEditorTitle !== EDITOR_TITLE_PLACEHOLDER) {
        if(this.currentNote && this.currentNote.title !== currentEditorTitle) this.currentNote.title = currentEditorTitle;
        return;
    }

    const lines = aiResponseText.split('\n').map(l => l.trim());
    let newTitle = '';

    for (const line of lines) { 
      if (line.startsWith('# ')) {
        newTitle = line.replace(/^#+\s+/, '').trim();
        if (newTitle) break;
      }
    }

    if (!newTitle) { 
      for (const line of lines) {
        if (line.length > 0 && !line.startsWith('#')) {
          let potentialTitle = line.replace(/^[\*_\`\->\s\[\]\(.\d)]+/, ''); 
          potentialTitle = potentialTitle.replace(/[\*_\`#]+$/, '').trim(); 
          if (potentialTitle.length > 3) {
            const maxLength = 70;
            newTitle = potentialTitle.substring(0, maxLength) + (potentialTitle.length > maxLength ? '...' : '');
            break;
          }
        }
      }
    }
    
    if (newTitle) {
        updateElementText(this.editorTitleEl, newTitle, EDITOR_TITLE_PLACEHOLDER);
        if(this.currentNote) this.currentNote.title = newTitle;
    } else if (this.currentNote && (!this.currentNote.title || this.currentNote.title === EDITOR_TITLE_PLACEHOLDER)) {
        const genericTitle = `Session ${new Date(this.currentNote.timestamp).toLocaleTimeString()}`;
        updateElementText(this.editorTitleEl, genericTitle, EDITOR_TITLE_PLACEHOLDER);
        this.currentNote.title = genericTitle;
    }
  }

  private finalizeNoteProcessing(): void {
    if (!this.currentNote) return;

    if (!this.currentNote.title || this.currentNote.title === EDITOR_TITLE_PLACEHOLDER) {
        let title = this.editorTitleEl.textContent?.trim();
        if (!title || title === EDITOR_TITLE_PLACEHOLDER) {
            title = `Voice Note ${new Date(this.currentNote.timestamp).toLocaleDateString()}`;
        }
        this.currentNote.title = title;
        updateElementText(this.editorTitleEl, title, EDITOR_TITLE_PLACEHOLDER);
    }

    this.storageService.saveNote(this.currentNote);
    this.renderHistoryList();
    this.updateButtonStates();
  }


  private handleRecordingProcessed(): void {
    console.log("AudioManager recording cycle complete.");
    if (!this.isProcessingAudio && !this.audioManager.isRecording) {
        this.updateButtonStates();
        this.updateRecordingStatus('Ready.');
    }
  }

  private handleAudioManagerError(message: string): void {
    this.updateRecordingStatus(message);
    this.liveDisplayManager.stop();
    if (this.audioManager.isRecording) {
        this.audioManager.fullCleanup();
    }
    this.isProcessingAudio = false;
    this.rawTranscriptionCardEl.classList.remove('is-processing');
    this.promptResponseCardEl.classList.remove('is-processing');
    this.updateButtonStates();
  }

  public createNewNote(): void {
    if (this.audioManager.isRecording) {
      this.updateRecordingStatus("Please stop recording before creating a new session.");
      return;
    }
    if (this.isProcessingAudio) {
      this.updateRecordingStatus("Please wait for current processing to finish.");
      return;
    }
    this.liveDisplayManager.stop();
    this.resetNoteState();
    this.updateButtonStates();
    this.updateAudioPlayerVisibility();
    this.renderHistoryList(); 
    this.rawTranscriptionCardEl.classList.remove('is-processing');
    this.promptResponseCardEl.classList.remove('is-processing');
  }

  private async resetNoteState(noteToLoad?: Note): Promise<void> {
    if (noteToLoad) {
        this.currentNote = { ...noteToLoad }; 
        updateElementText(this.editorTitleEl, this.currentNote.title || EDITOR_TITLE_PLACEHOLDER, EDITOR_TITLE_PLACEHOLDER);
        updateElementText(this.rawTranscriptionEl, this.currentNote.rawTranscription, RAW_TRANSCRIPTION_PLACEHOLDER, false); // raw transcription is not HTML
        
        let displayHtml = '';
        if (this.currentNote.promptResponse) {
            try {
                // If promptResponse is already HTML (e.g. from a buggy save) or if it's plain text from edit.
                // We should ideally always store raw text and parse.
                const isLikelyHtml = /<[a-z][\s\S]*>/i.test(this.currentNote.promptResponse);
                if (isLikelyHtml && this.currentNote.promptResponse.includes("<p>")) { // simple check
                    displayHtml = this.currentNote.promptResponse;
                } else {
                    displayHtml = typeof marked.parse === 'function' ? await marked.parse(this.currentNote.promptResponse) : this.currentNote.promptResponse;
                }
            } catch (e) {
                console.error("Error parsing markdown from stored note:", e);
                displayHtml = `<p><em>Error displaying content: ${e instanceof Error ? e.message : String(e)}</em></p><pre>${this.currentNote.promptResponse}</pre>`;
            }
        }
        updateElementText(this.promptOutputEl, displayHtml, PROMPT_OUTPUT_PLACEHOLDER, true);
        this.updateRecordingStatus(`Loaded: ${this.currentNote.title}`);

    } else {
        this.currentNote = {
          id: `note_${Date.now()}`,
          title: EDITOR_TITLE_PLACEHOLDER,
          rawTranscription: '',
          promptResponse: '', 
          timestamp: Date.now(),
          audioBase64: undefined,
          audioMimeType: undefined,
        };
        updateElementText(this.editorTitleEl, null, EDITOR_TITLE_PLACEHOLDER);
        updateElementText(this.rawTranscriptionEl, null, RAW_TRANSCRIPTION_PLACEHOLDER, true); // Placeholder can be HTML
        updateElementText(this.promptOutputEl, null, PROMPT_OUTPUT_PLACEHOLDER, true); // Placeholder can be HTML
        this.updateRecordingStatus('Ready to record or upload audio');
    }
    this.updateAudioPlayerVisibility();
    this.updateButtonStates();
  }

  private async handleFileUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    if (this.audioManager.isRecording || this.isProcessingAudio) {
        this.updateRecordingStatus("Busy. Please wait for current task to finish.");
        input.value = ''; return;
    }

    this.isProcessingAudio = true;
    this.updateButtonStates();
    this.updateRecordingStatus(`Processing uploaded file: ${file.name}...`);
    
    if (!this.currentNote || this.currentNote.audioBase64 || this.currentNote.rawTranscription) {
        this.resetNoteState(); 
    }
    this.clearPreviousOutputs(); 

    const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.') || file.name;
    updateElementText(this.editorTitleEl, fileNameWithoutExtension, EDITOR_TITLE_PLACEHOLDER);
    if (this.currentNote) {
        this.currentNote.title = fileNameWithoutExtension;
        this.currentNote.id = `note_file_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }

    try {
        const base64Audio = await this.readFileAsBase64(file);
        const mimeType = file.type || this.determineMimeTypeFromName(file.name) || 'application/octet-stream';
        
        await this.handleAudioAvailable({ base64Audio, mimeType }); 
    } catch (error) {
        console.error('Error processing uploaded file:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.updateRecordingStatus(`Error processing file: ${errorMessage}`);
        updateElementText(this.rawTranscriptionEl, `<em>File processing error: ${errorMessage}</em>`, RAW_TRANSCRIPTION_PLACEHOLDER, true);
        this.rawTranscriptionCardEl.classList.remove('is-processing');
        this.promptResponseCardEl.classList.remove('is-processing');
        if (this.isProcessingAudio) {
            this.isProcessingAudio = false;
            this.updateButtonStates();
        }
        if (this.currentNote) {
            this.currentNote.rawTranscription = `File Error: ${errorMessage}`;
            this.currentNote.promptResponse = "Could not process file.";
            this.finalizeNoteProcessing(); 
        }
    } finally {
        input.value = '';
    }
  }

  private readFileAsBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const result = reader.result as string;
              const base64Data = result.split(',')[1];
              if (base64Data) resolve(base64Data);
              else reject(new Error('Failed to extract base64 data from file.'));
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
      });
  }

  private determineMimeTypeFromName(fileName: string): string | null {
      const extension = fileName.split('.').pop()?.toLowerCase();
      if (!extension) return null;
      const mimeMap: Record<string, string> = {
          'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg', 'oga': 'audio/ogg',
          'm4a': 'audio/mp4', 'aac': 'audio/aac', 'webm': 'audio/webm', 'opus': 'audio/opus',
          'mp4': 'video/mp4', 'mov': 'video/quicktime', 'avi': 'video/x-msvideo',
          'wmv': 'video/x-ms-wmv', 'flv': 'video/x-flv', 'mkv': 'video/x-matroska'
      };
      return mimeMap[extension] || null;
  }

  // History Sidebar Logic
  private initializeSidebarState(): void {
    const isCollapsed = this.historySidebarEl.classList.contains('collapsed');
    this.historyToggleButton.setAttribute('aria-expanded', String(!isCollapsed));
    this.historySidebarEl.setAttribute('aria-hidden', String(isCollapsed));
  }

  private toggleHistorySidebar(): void {
    const isCollapsing = !this.historySidebarEl.classList.contains('collapsed');
    this.historySidebarEl.classList.toggle('collapsed');
    this.historyToggleButton.setAttribute('aria-expanded', String(isCollapsing));
    this.historySidebarEl.setAttribute('aria-hidden', String(!isCollapsing));
    // Add aria-label change for better accessibility
    this.historyToggleButton.setAttribute('aria-label', isCollapsing ? 'Open history sidebar' : 'Close history sidebar');
    this.historyToggleButton.title = isCollapsing ? 'Open History Sidebar' : 'Close History Sidebar';
  }

  private renderHistoryList(): void {
    const notes = this.storageService.getAllNotes().sort((a,b) => b.timestamp - a.timestamp);
    this.historyListEl.innerHTML = ''; 
    if (notes.length === 0) {
        this.historyListEl.innerHTML = '<li class="history-item-empty">No saved sessions.</li>';
        return;
    }

    notes.forEach(note => {
      const listItem = document.createElement('li');
      listItem.classList.add('history-item');
      listItem.dataset.noteId = note.id;
      if (this.currentNote && note.id === this.currentNote.id) {
        listItem.classList.add('active');
      }

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('history-item-title');
      titleSpan.textContent = note.title && note.title !== EDITOR_TITLE_PLACEHOLDER ? note.title : 'Untitled Session';
      listItem.appendChild(titleSpan);
      
      listItem.addEventListener('click', () => this.loadNoteFromHistory(note.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('history-item-delete');
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.setAttribute('aria-label', `Delete note ${note.title || 'Untitled Session'}`);
      deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation(); 
          this.deleteNoteFromHistory(note.id);
      });
      listItem.appendChild(deleteBtn);

      this.historyListEl.appendChild(listItem);
    });
  }

  private async loadNoteFromHistory(noteId: string): Promise<void> {
    if (this.isProcessingAudio || this.audioManager.isRecording) {
        this.updateRecordingStatus("Cannot load note while busy. Please wait or stop current task.");
        return;
    }
    const note = this.storageService.getNoteById(noteId);
    if (note) {
      this.liveDisplayManager.stop(); 
      this.rawTranscriptionCardEl.classList.remove('is-processing');
      this.promptResponseCardEl.classList.remove('is-processing');
      await this.resetNoteState(note); 
      this.updateButtonStates();
      this.renderHistoryList(); 
    }
  }

  private deleteNoteFromHistory(noteId: string): void {
    this.storageService.deleteNote(noteId);
    if (this.currentNote && this.currentNote.id === noteId) {
        this.createNewNote(); 
    }
    this.renderHistoryList(); 
    this.updateRecordingStatus("Note deleted from history.");
  }

  // Settings Modal Logic
  private loadUserSettings(): void {
    this.userSettings = this.storageService.loadUserSettings();
    this.customSystemInstructionTextarea.value = this.userSettings.customSystemInstruction || '';
  }

  private openSettingsModal(): void {
    this.customSystemInstructionTextarea.value = this.userSettings.customSystemInstruction || '';
    this.settingsModalEl.style.display = 'flex';
    this.settingsModalEl.classList.add('active');
    this.customSystemInstructionTextarea.focus();
  }

  private closeSettingsModal(): void {
    this.settingsModalEl.style.display = 'none';
    this.settingsModalEl.classList.remove('active');
  }

  private saveSettings(): void {
    this.userSettings.customSystemInstruction = this.customSystemInstructionTextarea.value.trim();
    this.storageService.saveUserSettings(this.userSettings);
    this.updateRecordingStatus("Settings saved.");
    this.closeSettingsModal();
  }

  // Audio Player Logic
  private updateAudioPlayerVisibility(): void {
    if (this.currentNote && this.currentNote.audioBase64 && this.currentNote.audioMimeType) {
      this.audioPlaybackEl.src = `data:${this.currentNote.audioMimeType};base64,${this.currentNote.audioBase64}`;
      this.audioPlayerContainerEl.style.display = 'block';
    } else {
      this.audioPlaybackEl.removeAttribute('src');
      this.audioPlayerContainerEl.style.display = 'none';
    }
  }

  // Download & Copy Logic
  private downloadRawTranscription(): void {
    if (this.currentNote && this.currentNote.rawTranscription) {
      const filename = `${(this.currentNote.title && this.currentNote.title !== EDITOR_TITLE_PLACEHOLDER ? this.currentNote.title : 'raw_transcription').replace(/[<>:"/\\|?*]/g, '_')}.txt`;
      downloadFile(filename, this.currentNote.rawTranscription);
    }
  }

  private downloadPromptResponse(): void {
    if (this.currentNote && this.currentNote.promptResponse) {
      const filename = `${(this.currentNote.title && this.currentNote.title !== EDITOR_TITLE_PLACEHOLDER ? this.currentNote.title : 'prompt_response').replace(/[<>:"/\\|?*]/g, '_')}.md`;
      downloadFile(filename, this.currentNote.promptResponse, 'text/markdown');
    }
  }
  
  private downloadBoth(): void {
    this.downloadRawTranscription();
    setTimeout(() => {
        this.downloadPromptResponse();
    }, 200);
  }

  private copyCardContent(contentElement: HTMLElement, buttonElement: HTMLButtonElement, contentType: string): void {
    if (contentElement.classList.contains('placeholder-active')) {
        this.updateRecordingStatus(`No ${contentType.toLowerCase()} to copy.`);
        return;
    }
    const textToCopy = contentElement.innerText;
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            this.updateRecordingStatus(`${contentType} copied to clipboard!`);
            const icon = buttonElement.querySelector('i');
            if (icon) {
                const originalClass = icon.className;
                icon.className = 'fas fa-check'; // Checkmark icon
                buttonElement.disabled = true; // Briefly disable
                setTimeout(() => {
                    icon.className = originalClass;
                    buttonElement.disabled = false;
                    this.updateButtonStates(); // Re-evaluate general disabled state
                }, 1500);
            }
        })
        .catch(err => {
            console.error(`Failed to copy ${contentType.toLowerCase()}:`, err);
            this.updateRecordingStatus(`Failed to copy ${contentType.toLowerCase()}.`);
        });
  }

  // Theme Toggle Logic
  private loadThemePreference(): void {
    const savedTheme = this.storageService.loadThemePreference() as 'light' | 'dark' | null;
    let initialTheme: 'light' | 'dark';
    if (savedTheme) {
        initialTheme = savedTheme;
    } else {
        // Default to dark if no system preference or if system preference is dark
        initialTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    this.applyTheme(initialTheme, true);
  }

  private applyTheme(theme: 'dark' | 'light', isInitialLoad: boolean = false): void {
    if (!isInitialLoad && this.currentTheme === theme) return;

    if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
    this.currentTheme = theme;

    if (this.themeIcon) {
        this.themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    if (this.themeToggleBtn) {
       this.themeToggleBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
       this.themeToggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark color theme' : 'Switch to light color theme');
    }
    this.storageService.saveThemePreference(theme);
  }

  private toggleTheme(): void {
    this.applyTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  // Keyboard Shortcuts
  private handleGlobalKeyDown(event: KeyboardEvent): void {
    if (!(event.ctrlKey || event.metaKey)) return;

    const target = event.target as HTMLElement;
    const key = event.key.toLowerCase();

    // Special handling for Ctrl+A in the custom instruction textarea within the active settings modal
    if (this.settingsModalEl.classList.contains('active') &&
        target === this.customSystemInstructionTextarea &&
        key === 'a') {
      // Allow default Ctrl+A (select all) behavior by not preventing default and returning early.
      return;
    }

    // Handling for Ctrl+S in settings modal
    if (key === 's' && this.settingsModalEl.classList.contains('active')) {
      event.preventDefault();
      this.saveSettingsBtn.click(); // Simulate click to trigger save
      return;
    }

    // For other general shortcuts, don't interfere if actively editing content
    const isEditingContent = target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    if (isEditingContent) return; 

    switch (key) {
        case 'r':
            event.preventDefault();
            this.recordButton.click(); 
            break;
        case 'n':
        case 'e': 
            event.preventDefault();
            this.newButton.click();
            break;
        case 'h':
            event.preventDefault();
            this.historyToggleButton.click();
            break;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const apiKey = getApiKey();
  const appContainer = document.getElementById('app-container');
  const apiKeyContainer = document.getElementById('api-key-container');

  if (apiKey) {
    if (appContainer) appContainer.style.display = 'block';
    if (apiKeyContainer) apiKeyContainer.style.display = 'none';
    new VoiceNotesApp(apiKey);
  } else {
    if (appContainer) appContainer.style.display = 'none';
    if (apiKeyContainer) apiKeyContainer.style.display = 'flex';

    const saveButton = document.getElementById('save-api-key');
    const apiKeyInput = document.getElementById('api-key-input') as HTMLInputElement;

    if (saveButton && apiKeyInput) {
      saveButton.onclick = () => {
        const key = apiKeyInput.value.trim();
        if (key) {
          saveApiKey(key);
          if (appContainer) appContainer.style.display = 'block';
          if (apiKeyContainer) apiKeyContainer.style.display = 'none';
          new VoiceNotesApp(key);
        }
      };
    }
  }
});

export {};
