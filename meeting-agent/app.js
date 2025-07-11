import { GoogleGenerativeAI } from '@google/genai';
import { marked } from 'marked';

// Constants
const API_KEY_STORAGE = 'gemini-api-key';
const MEETINGS_STORAGE = 'meeting-records';
const THEME_STORAGE = 'theme-preference';
const LANGUAGE_STORAGE = 'language-preference';
const PROMPT_MODE_STORAGE = 'prompt-mode';

// Language configurations
const LANGUAGES = {
  en: { code: 'en', name: 'English', dir: 'ltr' },
  ar: { code: 'ar', name: 'العربية', dir: 'rtl' },
  fa: { code: 'fa', name: 'فارسی', dir: 'rtl' },
  he: { code: 'he', name: 'עברית', dir: 'rtl' }
};

// Prompt templates
const PROMPTS = {
  transcription: {
    fast: "Transcribe this audio in its original language. Include all spoken content.",
    smart: "Transcribe this audio in its original language. Include all spoken content, utterances, and fillers. Use punctuation to reflect natural speech patterns."
  },
  summary: {
    fast: "Summarize the key points from this transcription in a concise manner.",
    smart: "Provide a comprehensive summary of this transcription. Include main topics, key decisions, important discussions, and overall meeting outcomes. Structure the summary with clear sections."
  },
  actionItems: {
    fast: "List the action items from this transcription as bullet points.",
    smart: "Extract all action items from this transcription. For each action item, include: the task description, assigned person (if mentioned), deadline (if mentioned), and priority level. Format as a detailed list."
  },
  sentiment: {
    fast: "Analyze the overall sentiment and tone of this meeting.",
    smart: "Provide a detailed sentiment analysis of this meeting. Include: overall tone, emotional dynamics, areas of agreement/disagreement, enthusiasm levels, and any concerns or tensions. Analyze how sentiment evolved throughout the meeting."
  }
};

// Global state
let genAI = null;
let model = null;
let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let isRecording = false;
let recordingStartTime = null;
let timerInterval = null;
let animationId = null;
let currentMeeting = null;
let promptMode = 'fast';
let currentLanguage = 'en';
let currentTheme = 'light';

// Storage functions
function loadMeetings() {
  const stored = localStorage.getItem(MEETINGS_STORAGE);
  return stored ? JSON.parse(stored) : [];
}

function saveMeetings(meetings) {
  localStorage.setItem(MEETINGS_STORAGE, JSON.stringify(meetings));
}

function saveMeeting(meeting) {
  const meetings = loadMeetings();
  meetings.unshift(meeting);
  saveMeetings(meetings);
}

// UI Helper functions
function showElement(id) {
  const element = document.getElementById(id);
  if (element) element.style.display = '';
}

function hideElement(id) {
  const element = document.getElementById(id);
  if (element) element.style.display = 'none';
}

function showStatus(message, type = 'info') {
  const container = document.getElementById('status-container');
  const status = document.createElement('div');
  status.className = `status-message status-${type}`;
  status.textContent = message;
  container.appendChild(status);
  
  setTimeout(() => {
    status.remove();
  }, 5000);
}

// Theme management
function loadTheme() {
  const saved = localStorage.getItem(THEME_STORAGE);
  currentTheme = saved || 'light';
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  document.body.className = theme === 'dark' ? 'dark-theme' : '';
  const icon = document.getElementById('theme-icon');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem(THEME_STORAGE, theme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
}

// Language management
function loadLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE);
  currentLanguage = saved || 'en';
  applyLanguage(currentLanguage);
}

function applyLanguage(lang) {
  const langConfig = LANGUAGES[lang];
  document.documentElement.dir = langConfig.dir;
  document.documentElement.lang = langConfig.code;
  document.getElementById('language-display').textContent = langConfig.code.toUpperCase();
  localStorage.setItem(LANGUAGE_STORAGE, lang);
}

function cycleLanguage() {
  const langs = Object.keys(LANGUAGES);
  const currentIndex = langs.indexOf(currentLanguage);
  const nextIndex = (currentIndex + 1) % langs.length;
  currentLanguage = langs[nextIndex];
  applyLanguage(currentLanguage);
}

// Prompt mode management
function loadPromptMode() {
  const saved = localStorage.getItem(PROMPT_MODE_STORAGE);
  promptMode = saved || 'fast';
  updatePromptModeDisplay();
}

function updatePromptModeDisplay() {
  document.getElementById('prompt-mode-display').textContent = 
    promptMode.charAt(0).toUpperCase() + promptMode.slice(1);
  localStorage.setItem(PROMPT_MODE_STORAGE, promptMode);
}

function togglePromptMode() {
  promptMode = promptMode === 'fast' ? 'smart' : 'fast';
  updatePromptModeDisplay();
}

// Tab management
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Update buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update panes
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `${targetTab}-content`) {
          pane.classList.add('active');
        }
      });
    });
  });
}

// Copy functionality
function setupCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const contentType = button.getAttribute('data-content');
      const textElement = document.getElementById(`${contentType}-text`);
      
      if (textElement && textElement.textContent) {
        navigator.clipboard.writeText(textElement.textContent)
          .then(() => {
            showStatus('Copied to clipboard!', 'success');
            const icon = button.querySelector('i');
            icon.className = 'fas fa-check';
            setTimeout(() => {
              icon.className = 'fas fa-copy';
            }, 2000);
          })
          .catch(() => {
            showStatus('Failed to copy', 'error');
          });
      }
    });
  });
}

// Sidebar management
function setupSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const closeSidebar = document.getElementById('close-sidebar');
  const sidebar = document.getElementById('sidebar');
  
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
  });
  
  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
  
  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// Meeting list management
function renderMeetingList() {
  const meetings = loadMeetings();
  const listContainer = document.getElementById('meeting-list');
  
  if (meetings.length === 0) {
    listContainer.innerHTML = '<p class="empty-message">No past meetings found.</p>';
    return;
  }
  
  listContainer.innerHTML = meetings.map(meeting => `
    <div class="meeting-item" data-id="${meeting.id}">
      <div class="meeting-header">
        <h4>${meeting.title}</h4>
        <span class="meeting-date">${new Date(meeting.timestamp).toLocaleDateString()}</span>
      </div>
      <button class="delete-meeting" data-id="${meeting.id}">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.meeting-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.delete-meeting')) {
        const id = item.getAttribute('data-id');
        loadMeeting(id);
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  });
  
  document.querySelectorAll('.delete-meeting').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = button.getAttribute('data-id');
      deleteMeeting(id);
    });
  });
}

function loadMeeting(id) {
  const meetings = loadMeetings();
  const meeting = meetings.find(m => m.id === id);
  
  if (meeting) {
    currentMeeting = meeting;
    displayMeetingResults(meeting);
    showElement('results-section');
  }
}

function deleteMeeting(id) {
  if (confirm('Are you sure you want to delete this meeting?')) {
    const meetings = loadMeetings();
    const filtered = meetings.filter(m => m.id !== id);
    saveMeetings(filtered);
    renderMeetingList();
    
    if (currentMeeting && currentMeeting.id === id) {
      currentMeeting = null;
      hideElement('results-section');
    }
  }
}

function displayMeetingResults(meeting) {
  document.getElementById('transcription-text').textContent = meeting.rawTranscription;
  document.getElementById('summary-text').innerHTML = meeting.summary;
  document.getElementById('action-items-text').innerHTML = meeting.actionItems;
  document.getElementById('sentiment-text').innerHTML = meeting.sentiment;
}

// Audio recording
async function startRecording() {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    mediaRecorder = new MediaRecorder(audioStream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = async () => {
      await processRecording();
    };
    
    mediaRecorder.start();
    isRecording = true;
    recordingStartTime = Date.now();
    
    updateRecordingUI(true);
    startTimer();
    startWaveformAnimation();
    
    showStatus('Recording started', 'info');
  } catch (error) {
    console.error('Error starting recording:', error);
    showStatus('Failed to start recording. Please check microphone permissions.', 'error');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
  
  isRecording = false;
  updateRecordingUI(false);
  stopTimer();
  stopWaveformAnimation();
}

function updateRecordingUI(recording) {
  const recordBtn = document.getElementById('record-btn');
  const recordIcon = document.getElementById('record-icon');
  const recordText = document.getElementById('record-text');
  
  if (recording) {
    recordBtn.classList.add('recording');
    recordIcon.className = 'fas fa-stop';
    recordText.textContent = 'Stop Recording';
  } else {
    recordBtn.classList.remove('recording');
    recordIcon.className = 'fas fa-microphone';
    recordText.textContent = 'Start Recording';
  }
}

// Timer functions
function startTimer() {
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timer-display').textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  document.getElementById('timer-display').textContent = '00:00';
}

// Waveform animation
function startWaveformAnimation() {
  const canvas = document.getElementById('waveform-canvas');
  const ctx = canvas.getContext('2d');
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(audioStream);
  
  source.connect(analyser);
  analyser.fftSize = 256;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  function draw() {
    animationId = requestAnimationFrame(draw);
    
    analyser.getByteFrequencyData(dataArray);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      
      ctx.fillStyle = `rgb(100, 255, 218)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  }
  
  draw();
}

function stopWaveformAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  const canvas = document.getElementById('waveform-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Process recording
async function processRecording() {
  if (audioChunks.length === 0) {
    showStatus('No audio recorded', 'error');
    return;
  }
  
  showStatus('Processing audio...', 'processing');
  
  try {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const base64Audio = await blobToBase64(audioBlob);
    
    // Generate transcription
    const transcription = await generateTranscription(base64Audio.split(',')[1], 'audio/webm');
    
    if (!transcription) {
      showStatus('Failed to generate transcription', 'error');
      return;
    }
    
    // Generate analyses
    showStatus('Generating summary...', 'processing');
    const summary = await generateSummary(transcription);
    
    showStatus('Extracting action items...', 'processing');
    const actionItems = await generateActionItems(transcription);
    
    showStatus('Analyzing sentiment...', 'processing');
    const sentiment = await generateSentiment(transcription);
    
    // Create meeting record
    const meeting = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      title: `Meeting ${new Date().toLocaleString()}`,
      rawTranscription: transcription,
      summary: summary || 'No summary generated',
      actionItems: actionItems || 'No action items found',
      sentiment: sentiment || 'No sentiment analysis available'
    };
    
    currentMeeting = meeting;
    saveMeeting(meeting);
    renderMeetingList();
    displayMeetingResults(meeting);
    showElement('results-section');
    
    showStatus('Processing complete!', 'success');
  } catch (error) {
    console.error('Error processing recording:', error);
    showStatus('Error processing recording', 'error');
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Gemini API functions
async function generateTranscription(base64Audio, mimeType) {
  try {
    const prompt = PROMPTS.transcription[promptMode];
    const result = await model.generateContent({
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

async function generateSummary(transcription) {
  try {
    const prompt = PROMPTS.summary[promptMode];
    const result = await model.generateContent(`${prompt}\n\nTranscription:\n${transcription}`);
    const response = await result.response;
    const text = response.text();
    return await marked.parse(text);
  } catch (error) {
    console.error('Summary error:', error);
    return null;
  }
}

async function generateActionItems(transcription) {
  try {
    const prompt = PROMPTS.actionItems[promptMode];
    const result = await model.generateContent(`${prompt}\n\nTranscription:\n${transcription}`);
    const response = await result.response;
    const text = response.text();
    return await marked.parse(text);
  } catch (error) {
    console.error('Action items error:', error);
    return null;
  }
}

async function generateSentiment(transcription) {
  try {
    const prompt = PROMPTS.sentiment[promptMode];
    const result = await model.generateContent(`${prompt}\n\nTranscription:\n${transcription}`);
    const response = await result.response;
    const text = response.text();
    return await marked.parse(text);
  } catch (error) {
    console.error('Sentiment error:', error);
    return null;
  }
}

// Initialize app
function initializeApp(apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  hideElement('api-key-modal');
  showElement('main-app');
  
  // Load preferences
  loadTheme();
  loadLanguage();
  loadPromptMode();
  
  // Setup UI
  setupTabs();
  setupCopyButtons();
  setupSidebar();
  renderMeetingList();
  
  // Event listeners
  document.getElementById('record-btn').addEventListener('click', () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });
  
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  document.getElementById('language-btn').addEventListener('click', cycleLanguage);
  document.getElementById('prompt-mode-btn').addEventListener('click', togglePromptMode);
  
  document.getElementById('clear-api-key-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your API key?')) {
      localStorage.removeItem(API_KEY_STORAGE);
      location.reload();
    }
  });
}

// Main entry point
document.addEventListener('DOMContentLoaded', () => {
  const storedApiKey = localStorage.getItem(API_KEY_STORAGE);
  
  if (storedApiKey) {
    initializeApp(storedApiKey);
  } else {
    const apiKeyInput = document.getElementById('api-key-input');
    const saveButton = document.getElementById('save-api-key-btn');
    
    saveButton.addEventListener('click', () => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
        localStorage.setItem(API_KEY_STORAGE, apiKey);
        initializeApp(apiKey);
      }
    });
    
    apiKeyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveButton.click();
      }
    });
  }
});