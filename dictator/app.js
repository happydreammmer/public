import { GoogleGenerativeAI } from '@google/genai';
import { marked } from 'marked';

// Constants
const RAW_TRANSCRIPTION_PLACEHOLDER = 'Your live transcription will appear here after you finish recording...';
const PROMPT_OUTPUT_PLACEHOLDER = 'The AI\'s response to your prompt will appear here...';
const EDITOR_TITLE_PLACEHOLDER = 'Your note\'s title will appear here...';

// API Key Management
const API_KEY_STORAGE = 'gemini_api_key';
const SETTINGS_STORAGE_KEY = 'voiceNotes_userSettings';
const NOTES_STORAGE_KEY = 'voiceNotes_notes';
const THEME_STORAGE_KEY = 'voiceNotes_theme';

function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE);
}

function saveApiKey(apiKey) {
  localStorage.setItem(API_KEY_STORAGE, apiKey);
}

function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
}

// UI Utils
function updateElementText(element, text, placeholder, isHtml = false) {
  if (!element) return;
  
  if (!text || text.trim() === '') {
    element.classList.add('placeholder-active');
    element.setAttribute('contenteditable', 'true');
    element.innerHTML = placeholder || '';
  } else {
    element.classList.remove('placeholder-active');
    if (isHtml) {
      element.innerHTML = text;
    } else {
      element.textContent = text;
    }
  }
}

function downloadFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Storage Service
class StorageService {
  getAllNotes() {
    const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
    if (notesJson) {
      try {
        return JSON.parse(notesJson);
      } catch (e) {
        console.error('Error parsing notes:', e);
        return [];
      }
    }
    return [];
  }

  saveNote(note) {
    const notes = this.getAllNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }
    
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }

  getNoteById(noteId) {
    const notes = this.getAllNotes();
    return notes.find(n => n.id === noteId);
  }

  deleteNote(noteId) {
    const notes = this.getAllNotes();
    const filteredNotes = notes.filter(n => n.id !== noteId);
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
  }

  loadUserSettings() {
    const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (settingsJson) {
      try {
        return JSON.parse(settingsJson);
      } catch (e) {
        console.error('Error parsing settings:', e);
        return {};
      }
    }
    return {};
  }

  saveUserSettings(settings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }

  loadThemePreference() {
    return localStorage.getItem(THEME_STORAGE_KEY);
  }

  saveThemePreference(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

// Gemini Service
class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getTranscription(base64Audio, mimeType) {
    try {
      const prompt = "Transcribe this audio in its original language. " +
                     "Include all spoken content, utterances, and fillers (like 'um', 'uh'). " +
                     "Use punctuation to reflect natural speech patterns. " +
                     "Don't add any introductory text - just provide the transcription.";

      const result = await this.model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { 
              inline_data: {
                mime_type: mimeType,
                data: base64Audio
              }
            }
          ]
        }]
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  async getAIResponse(transcription, customSystemInstruction) {
    try {
      const systemInstruction = customSystemInstruction || 
        "You are a helpful assistant. Transform the transcribed text into a well-structured, " +
        "clear response. Improve clarity, fix grammar, and organize the content logically. " +
        "Use appropriate formatting (headings, bullet points, etc.) where beneficial. " +
        "Maintain the original intent and key information while making it more readable and professional.";

      const userPrompt = `Here's a transcription to process:\n\n${transcription}`;

      const result = await this.model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: systemInstruction + '\n\n' + userPrompt }]
        }]
      });

      const response = await result.response;
      const text = response.text();
      const html = await marked.parse(text);
      
      return { text, html };
    } catch (error) {
      console.error('AI response error:', error);
      throw error;
    }
  }
}

// Audio Manager
class AudioManager {
  constructor(onStatusUpdate, onAudioAvailable, onRecordingProcessed, onError) {
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.recordingStartTime = null;
    
    this.onStatusUpdate = onStatusUpdate;
    this.onAudioAvailable = onAudioAvailable;
    this.onRecordingProcessed = onRecordingProcessed;
    this.onError = onError;
  }

  async start() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = async () => {
        await this.processRecording();
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordingStartTime = Date.now();
      
      return this.mediaStream;
    } catch (error) {
      console.error('Error starting recording:', error);
      this.onError('Failed to start recording. Please check microphone permissions.');
      this.fullCleanup();
      return null;
    }
  }

  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    this.stopMediaStream();
  }

  stopMediaStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  async processRecording() {
    if (this.audioChunks.length === 0) {
      this.onError('No audio data recorded.');
      this.onRecordingProcessed();
      return;
    }

    try {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const base64Audio = await this.blobToBase64(audioBlob);
      
      await this.onAudioAvailable({ 
        base64Audio: base64Audio.split(',')[1], 
        mimeType: audioBlob.type 
      });
    } catch (error) {
      console.error('Error processing recording:', error);
      this.onError('Failed to process recording.');
    } finally {
      this.audioChunks = [];
      this.onRecordingProcessed();
    }
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  fullCleanup() {
    this.stop();
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.recordingStartTime = null;
  }
}

// Live Display Manager
class LiveDisplayManager {
  constructor(elements) {
    this.elements = elements;
    this.analyser = null;
    this.animationId = null;
    this.timerInterval = null;
  }

  start(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    this.analyser = audioContext.createAnalyser();
    source.connect(this.analyser);
    
    this.elements.recordingInterface.classList.add('recording');
    this.elements.recordButton.classList.add('recording');
    this.elements.liveRecordingTitle.textContent = 'Recording...';
    
    this.startTimer();
    this.drawWaveform();
  }

  startTimer() {
    const startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      this.elements.liveRecordingTimerDisplay.textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 100);
  }

  drawWaveform() {
    if (!this.analyser) return;
    
    const canvas = this.elements.liveWaveformCanvas;
    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      this.animationId = requestAnimationFrame(draw);
      
      this.analyser.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#64FFDA';
      ctx.beginPath();
      
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    
    draw();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    this.elements.recordingInterface.classList.remove('recording');
    this.elements.recordButton.classList.remove('recording');
    this.elements.liveRecordingTitle.textContent = '';
    this.elements.liveRecordingTimerDisplay.textContent = '';
    
    const ctx = this.elements.liveWaveformCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.elements.liveWaveformCanvas.width, this.elements.liveWaveformCanvas.height);
  }
}

// Main App Class
class VoiceNotesApp {
  constructor(apiKey) {
    if (!apiKey) {
      this.handleFatalError("API_KEY is not set. Please ensure the API_KEY environment variable is configured.");
      return;
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
      this.handleAudioManagerError.bind(this)
    );
    
    const liveDisplayElements = {
      liveRecordingTitle: this.liveRecordingTitleEl,
      liveWaveformCanvas: this.liveWaveformCanvasEl,
      liveRecordingTimerDisplay: this.liveRecordingTimerDisplayEl,
      recordButton: this.recordButton,
      editorTitle: this.editorTitleEl,
      statusIndicatorDiv: this.statusIndicatorDivEl,
      recordingInterface: this.recordingInterfaceEl,
    };
    this.liveDisplayManager = new LiveDisplayManager(liveDisplayElements);
    
    this.currentNote = null;
    this.userSettings = {};
    this.isProcessingAudio = false;
    this.currentTheme = 'dark';
    
    this.bindEventListeners();
    this.createNewNote();
    this.updateButtonStates();
    this.updateRecordingStatus('Ready to record or upload audio');
    this.renderHistoryList();
    this.updateAudioPlayerVisibility();
    this.initializeSidebarState();
  }

  handleFatalError(message) {
    console.error(message);
    const statusEl = document.getElementById('recordingStatus');
    if (statusEl) {
      statusEl.textContent = `Configuration error: ${message}. App cannot function.`;
      statusEl.style.color = "red";
    }
  }

  loadDOMElements() {
    this.recordButton = document.getElementById('recordButton');
    this.newButton = document.getElementById('newButton');
    this.uploadButton = document.getElementById('uploadButton');
    this.audioFileInput = document.getElementById('audioFileInput');
    this.settingsButton = document.getElementById('settingsButton');
    this.historyToggleButton = document.getElementById('historyToggleBtn');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.themeIcon = this.themeToggleBtn.querySelector('i');
    this.downloadRawBtn = document.getElementById('downloadRawBtn');
    this.downloadPromptBtn = document.getElementById('downloadPromptBtn');
    this.downloadBothBtn = document.getElementById('downloadBothBtn');
    this.copyRawBtn = document.getElementById('copyRawBtn');
    this.copyPromptBtn = document.getElementById('copyPromptBtn');
    
    this.recordingStatusEl = document.getElementById('recordingStatus');
    this.rawTranscriptionEl = document.getElementById('rawTranscription');
    this.promptOutputEl = document.getElementById('promptOutput');
    this.rawTranscriptionCardEl = document.getElementById('rawTranscriptionCard');
    this.promptResponseCardEl = document.getElementById('promptResponseCard');
    this.editorTitleEl = document.querySelector('.editor-title');
    this.recordingInterfaceEl = document.querySelector('.recording-interface');
    this.liveRecordingTitleEl = document.getElementById('liveRecordingTitle');
    this.liveWaveformCanvasEl = document.getElementById('liveWaveformCanvas');
    this.liveRecordingTimerDisplayEl = document.getElementById('liveRecordingTimerDisplay');
    this.statusIndicatorDivEl = this.recordingInterfaceEl.querySelector('.status-indicator');
    
    this.historySidebarEl = document.getElementById('historySidebar');
    this.historyListEl = document.getElementById('historyList');
    
    this.settingsModalEl = document.getElementById('settingsModal');
    this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
    this.customSystemInstructionTextarea = document.getElementById('customSystemInstruction');
    
    this.audioPlayerContainerEl = document.getElementById('audioPlayerContainer');
    this.audioPlaybackEl = document.getElementById('audioPlaybackElement');
    
    // Add clear API key button
    const clearApiKeyBtn = document.getElementById('clear-api-key');
    if (clearApiKeyBtn) {
      clearApiKeyBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your API key?')) {
          clearApiKey();
          location.reload();
        }
      });
    }
  }

  bindEventListeners() {
    this.recordButton.addEventListener('click', () => this.toggleRecording());
    this.newButton.addEventListener('click', () => this.createNewNote());
    this.uploadButton.addEventListener('click', () => this.audioFileInput.click());
    this.audioFileInput.addEventListener('change', (event) => this.handleFileUpload(event));
    
    this.editorTitleEl.addEventListener('blur', () => this.handleTitleChange());
    this.rawTranscriptionEl.addEventListener('blur', () => this.handleContentEditableBlur(this.rawTranscriptionEl, 'rawTranscription'));
    this.promptOutputEl.addEventListener('blur', () => this.handleContentEditableBlur(this.promptOutputEl, 'promptResponse'));
    
    this.historyToggleButton.addEventListener('click', () => this.toggleHistorySidebar());
    
    this.settingsButton.addEventListener('click', () => this.openSettingsModal());
    this.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    
    this.downloadRawBtn.addEventListener('click', () => this.downloadRawTranscription());
    this.downloadPromptBtn.addEventListener('click', () => this.downloadPromptResponse());
    this.downloadBothBtn.addEventListener('click', () => this.downloadBoth());
    this.copyRawBtn.addEventListener('click', () => this.copyCardContent(this.rawTranscriptionEl, this.copyRawBtn, 'Transcription'));
    this.copyPromptBtn.addEventListener('click', () => this.copyCardContent(this.promptOutputEl, this.copyPromptBtn, 'Response'));
    
    document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this));
  }

  updateButtonStates() {
    const disableAllInteractions = this.isProcessingAudio;
    const disableDuringRecording = this.audioManager.isRecording;
    
    this.recordButton.disabled = disableAllInteractions;
    this.newButton.disabled = disableAllInteractions || disableDuringRecording;
    this.uploadButton.disabled = disableAllInteractions || disableDuringRecording;
    this.settingsButton.disabled = disableAllInteractions || disableDuringRecording;
    
    const hasRaw = this.currentNote && this.rawTranscriptionEl.innerText.trim() !== '' && !this.rawTranscriptionEl.classList.contains('placeholder-active');
    const hasPrompt = this.currentNote && this.promptOutputEl.innerText.trim() !== '' && !this.promptOutputEl.classList.contains('placeholder-active');
    
    this.downloadRawBtn.disabled = disableAllInteractions || disableDuringRecording || !hasRaw;
    this.downloadPromptBtn.disabled = disableAllInteractions || disableDuringRecording || !hasPrompt;
    this.downloadBothBtn.disabled = disableAllInteractions || disableDuringRecording || (!hasRaw && !hasPrompt);
    this.copyRawBtn.disabled = disableAllInteractions || disableDuringRecording || !hasRaw;
    this.copyPromptBtn.disabled = disableAllInteractions || disableDuringRecording || !hasPrompt;
  }

  updateRecordingStatus(status) {
    this.recordingStatusEl.textContent = status;
  }

  async toggleRecording() {
    if (this.audioManager.isRecording) {
      await this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    if (this.audioManager.isRecording || this.isProcessingAudio) return;
    
    this.isProcessingAudio = true;
    this.updateButtonStates();
    this.updateRecordingStatus('Initializing recorder...');
    this.clearPreviousOutputs();
    
    if (this.currentNote) {
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

  async stopRecording() {
    if (!this.audioManager.isRecording || this.isProcessingAudio) return;
    
    this.isProcessingAudio = true;
    this.updateButtonStates();
    this.updateRecordingStatus('Stopping recording...');
    this.liveDisplayManager.stop();
    this.audioManager.stop();
  }

  clearPreviousOutputs() {
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

  async handleAudioAvailable({ base64Audio, mimeType }) {
    this.updateRecordingStatus('Getting transcription...');
    this.rawTranscriptionCardEl.classList.add('is-processing');
    
    if (this.currentNote) {
      this.currentNote.audioBase64 = base64Audio;
      this.currentNote.audioMimeType = mimeType;
    }
    
    try {
      const transcriptionText = await this.geminiService.getTranscription(base64Audio, mimeType);
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
      console.error('Error during transcription:', error);
      const errorMessage = error.message || String(error);
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

  async handleTranscriptionComplete(transcription) {
    this.updateRecordingStatus('Getting AI response...');
    this.promptResponseCardEl.classList.add('is-processing');
    
    try {
      const { text: aiResponseText, html: htmlContent } = await this.geminiService.getAIResponse(
        transcription,
        this.userSettings.customSystemInstruction
      );
      
      updateElementText(this.promptOutputEl, htmlContent, PROMPT_OUTPUT_PLACEHOLDER, true);
      
      if (this.currentNote) this.currentNote.promptResponse = aiResponseText;
      this.trySetTitleFromAIResponse(aiResponseText);
      this.updateRecordingStatus('AI Response received.');
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = error.message || String(error);
      this.updateRecordingStatus(`AI response error: ${errorMsg}`);
      updateElementText(this.promptOutputEl, `<em>Error generating AI response: ${errorMsg}</em>`, PROMPT_OUTPUT_PLACEHOLDER, true);
      if (this.currentNote) this.currentNote.promptResponse = `AI Error: ${errorMsg}`;
    } finally {
      this.promptResponseCardEl.classList.remove('is-processing');
      this.updateButtonStates();
    }
  }

  handleTitleChange() {
    if (!this.currentNote || this.audioManager.isRecording || this.isProcessingAudio) return;
    
    const newTitleText = this.editorTitleEl.textContent?.trim() || '';
    const currentStoredTitleComparable = (this.currentNote.title === EDITOR_TITLE_PLACEHOLDER && newTitleText === '') ? '' : this.currentNote.title;
    
    if (currentStoredTitleComparable !== newTitleText) {
      this.currentNote.title = newTitleText === '' ? EDITOR_TITLE_PLACEHOLDER : newTitleText;
      this.storageService.saveNote(this.currentNote);
      this.renderHistoryList();
    }
  }

  handleContentEditableBlur(element, noteProperty) {
    if (!this.currentNote || this.audioManager.isRecording || this.isProcessingAudio) return;
    
    let newActualContent;
    if (element.classList.contains('placeholder-active')) {
      newActualContent = '';
    } else {
      newActualContent = element.innerText;
    }
    
    if (this.currentNote[noteProperty] !== newActualContent) {
      this.currentNote[noteProperty] = newActualContent;
      this.storageService.saveNote(this.currentNote);
      this.updateButtonStates();
    }
  }

  trySetTitleFromAIResponse(aiResponseText) {
    if (!aiResponseText || !this.editorTitleEl) return;
    
    const currentEditorTitle = this.editorTitleEl.textContent?.trim();
    if (currentEditorTitle && currentEditorTitle !== EDITOR_TITLE_PLACEHOLDER) {
      if (this.currentNote && this.currentNote.title !== currentEditorTitle) {
        this.currentNote.title = currentEditorTitle;
      }
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
      if (this.currentNote) this.currentNote.title = newTitle;
    } else if (this.currentNote && (!this.currentNote.title || this.currentNote.title === EDITOR_TITLE_PLACEHOLDER)) {
      const genericTitle = `Session ${new Date(this.currentNote.timestamp).toLocaleTimeString()}`;
      updateElementText(this.editorTitleEl, genericTitle, EDITOR_TITLE_PLACEHOLDER);
      this.currentNote.title = genericTitle;
    }
  }

  finalizeNoteProcessing() {
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

  handleRecordingProcessed() {
    if (!this.isProcessingAudio && !this.audioManager.isRecording) {
      this.updateButtonStates();
      this.updateRecordingStatus('Ready.');
    }
  }

  handleAudioManagerError(message) {
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

  createNewNote() {
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

  async resetNoteState(noteToLoad) {
    if (noteToLoad) {
      this.currentNote = { ...noteToLoad };
      updateElementText(this.editorTitleEl, this.currentNote.title || EDITOR_TITLE_PLACEHOLDER, EDITOR_TITLE_PLACEHOLDER);
      updateElementText(this.rawTranscriptionEl, this.currentNote.rawTranscription, RAW_TRANSCRIPTION_PLACEHOLDER, false);
      
      let displayHtml = '';
      if (this.currentNote.promptResponse) {
        try {
          const isLikelyHtml = /<[a-z][\s\S]*>/i.test(this.currentNote.promptResponse);
          if (isLikelyHtml && this.currentNote.promptResponse.includes("<p>")) {
            displayHtml = this.currentNote.promptResponse;
          } else {
            displayHtml = await marked.parse(this.currentNote.promptResponse);
          }
        } catch (e) {
          console.error("Error parsing markdown:", e);
          displayHtml = `<p><em>Error displaying content</em></p><pre>${this.currentNote.promptResponse}</pre>`;
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
      updateElementText(this.rawTranscriptionEl, null, RAW_TRANSCRIPTION_PLACEHOLDER, true);
      updateElementText(this.promptOutputEl, null, PROMPT_OUTPUT_PLACEHOLDER, true);
      this.updateRecordingStatus('Ready to record or upload audio');
    }
    
    this.updateAudioPlayerVisibility();
    this.updateButtonStates();
  }

  async handleFileUpload(event) {
    const input = event.target;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    
    if (this.audioManager.isRecording || this.isProcessingAudio) {
      this.updateRecordingStatus("Busy. Please wait for current task to finish.");
      input.value = '';
      return;
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
      const errorMessage = error.message || String(error);
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

  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const base64Data = result.split(',')[1];
        if (base64Data) resolve(base64Data);
        else reject(new Error('Failed to extract base64 data from file.'));
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  determineMimeTypeFromName(fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return null;
    
    const mimeMap = {
      'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg', 'oga': 'audio/ogg',
      'm4a': 'audio/mp4', 'aac': 'audio/aac', 'webm': 'audio/webm', 'opus': 'audio/opus',
      'mp4': 'video/mp4', 'mov': 'video/quicktime', 'avi': 'video/x-msvideo',
      'wmv': 'video/x-ms-wmv', 'flv': 'video/x-flv', 'mkv': 'video/x-matroska'
    };
    
    return mimeMap[extension] || null;
  }

  // History Sidebar Logic
  initializeSidebarState() {
    const isCollapsed = this.historySidebarEl.classList.contains('collapsed');
    this.historyToggleButton.setAttribute('aria-expanded', String(!isCollapsed));
    this.historySidebarEl.setAttribute('aria-hidden', String(isCollapsed));
  }

  toggleHistorySidebar() {
    const isCollapsing = !this.historySidebarEl.classList.contains('collapsed');
    this.historySidebarEl.classList.toggle('collapsed');
    this.historyToggleButton.setAttribute('aria-expanded', String(isCollapsing));
    this.historySidebarEl.setAttribute('aria-hidden', String(!isCollapsing));
    this.historyToggleButton.setAttribute('aria-label', isCollapsing ? 'Open history sidebar' : 'Close history sidebar');
    this.historyToggleButton.title = isCollapsing ? 'Open History Sidebar' : 'Close History Sidebar';
  }

  renderHistoryList() {
    const notes = this.storageService.getAllNotes().sort((a, b) => b.timestamp - a.timestamp);
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

  async loadNoteFromHistory(noteId) {
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

  deleteNoteFromHistory(noteId) {
    this.storageService.deleteNote(noteId);
    if (this.currentNote && this.currentNote.id === noteId) {
      this.createNewNote();
    }
    this.renderHistoryList();
    this.updateRecordingStatus("Note deleted from history.");
  }

  // Settings Modal Logic
  loadUserSettings() {
    this.userSettings = this.storageService.loadUserSettings();
    this.customSystemInstructionTextarea.value = this.userSettings.customSystemInstruction || '';
  }

  openSettingsModal() {
    this.customSystemInstructionTextarea.value = this.userSettings.customSystemInstruction || '';
    this.settingsModalEl.style.display = 'flex';
    this.settingsModalEl.classList.add('active');
    this.customSystemInstructionTextarea.focus();
  }

  closeSettingsModal() {
    this.settingsModalEl.style.display = 'none';
    this.settingsModalEl.classList.remove('active');
  }

  saveSettings() {
    this.userSettings.customSystemInstruction = this.customSystemInstructionTextarea.value.trim();
    this.storageService.saveUserSettings(this.userSettings);
    this.updateRecordingStatus("Settings saved.");
    this.closeSettingsModal();
  }

  // Audio Player Logic
  updateAudioPlayerVisibility() {
    if (this.currentNote && this.currentNote.audioBase64 && this.currentNote.audioMimeType) {
      this.audioPlaybackEl.src = `data:${this.currentNote.audioMimeType};base64,${this.currentNote.audioBase64}`;
      this.audioPlayerContainerEl.style.display = 'block';
    } else {
      this.audioPlaybackEl.removeAttribute('src');
      this.audioPlayerContainerEl.style.display = 'none';
    }
  }

  // Download & Copy Logic
  downloadRawTranscription() {
    if (this.currentNote && this.currentNote.rawTranscription) {
      const filename = `${(this.currentNote.title && this.currentNote.title !== EDITOR_TITLE_PLACEHOLDER ? this.currentNote.title : 'raw_transcription').replace(/[<>:"/\\|?*]/g, '_')}.txt`;
      downloadFile(filename, this.currentNote.rawTranscription);
    }
  }

  downloadPromptResponse() {
    if (this.currentNote && this.currentNote.promptResponse) {
      const filename = `${(this.currentNote.title && this.currentNote.title !== EDITOR_TITLE_PLACEHOLDER ? this.currentNote.title : 'prompt_response').replace(/[<>:"/\\|?*]/g, '_')}.md`;
      downloadFile(filename, this.currentNote.promptResponse, 'text/markdown');
    }
  }

  downloadBoth() {
    this.downloadRawTranscription();
    setTimeout(() => {
      this.downloadPromptResponse();
    }, 200);
  }

  copyCardContent(contentElement, buttonElement, contentType) {
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
          icon.className = 'fas fa-check';
          buttonElement.disabled = true;
          setTimeout(() => {
            icon.className = originalClass;
            buttonElement.disabled = false;
            this.updateButtonStates();
          }, 1500);
        }
      })
      .catch(err => {
        console.error(`Failed to copy ${contentType.toLowerCase()}:`, err);
        this.updateRecordingStatus(`Failed to copy ${contentType.toLowerCase()}.`);
      });
  }

  // Theme Toggle Logic
  loadThemePreference() {
    const savedTheme = this.storageService.loadThemePreference();
    let initialTheme;
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    this.applyTheme(initialTheme, true);
  }

  applyTheme(theme, isInitialLoad = false) {
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

  toggleTheme() {
    this.applyTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  // Keyboard Shortcuts
  handleGlobalKeyDown(event) {
    if (!(event.ctrlKey || event.metaKey)) return;
    
    const target = event.target;
    const key = event.key.toLowerCase();
    
    if (this.settingsModalEl.classList.contains('active') &&
        target === this.customSystemInstructionTextarea &&
        key === 'a') {
      return;
    }
    
    if (key === 's' && this.settingsModalEl.classList.contains('active')) {
      event.preventDefault();
      this.saveSettingsBtn.click();
      return;
    }
    
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

// Initialize app
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
    const apiKeyInput = document.getElementById('api-key-input');
    
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
      
      apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveButton.click();
        }
      });
    }
  }
});