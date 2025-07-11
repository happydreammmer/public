import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import './index.css';

const API_KEY_STORAGE = 'gemini-api-key';

interface Meeting {
  id: string;
  title: string;
  timestamp: number;
  rawTranscription: string;
  summary: string;
  actionItems: string;
  sentiment: string;
}

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState('transcription');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promptMode, setPromptMode] = useState('fast');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const geminiRef = useRef<GoogleGenAI | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey) {
      setApiKey(savedKey);
      geminiRef.current = new GoogleGenAI({ apiKey: savedKey });
    }

    // Load saved meetings
    const savedMeetings = localStorage.getItem('meeting-records');
    if (savedMeetings) {
      try {
        setMeetings(JSON.parse(savedMeetings));
      } catch (e) {
        console.error('Error loading meetings:', e);
      }
    }

    // Load preferences
    const savedTheme = localStorage.getItem('theme-preference') || 'light';
    const savedLanguage = localStorage.getItem('language-preference') || 'en';
    const savedPromptMode = localStorage.getItem('prompt-mode') || 'fast';
    
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setPromptMode(savedPromptMode);
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE, key);
    setApiKey(key);
    geminiRef.current = new GoogleGenAI({ apiKey: key });
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey(null);
    geminiRef.current = null;
  };

  const saveMeeting = (meeting: Meeting) => {
    const updatedMeetings = meetings.filter(m => m.id !== meeting.id);
    updatedMeetings.unshift(meeting);
    setMeetings(updatedMeetings);
    localStorage.setItem('meeting-records', JSON.stringify(updatedMeetings));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = processRecording;

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) return;

    setIsProcessing(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const base64Audio = await blobToBase64(audioBlob);

      if (!geminiRef.current) {
        throw new Error('Gemini API not initialized');
      }

      // Get transcription
      const transcriptionResult = await geminiRef.current.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{
          role: 'user',
          parts: [
            { text: "Transcribe this audio in its original language. Include all spoken content." },
            {
              inlineData: {
                mimeType: audioBlob.type,
                data: base64Audio.split(',')[1]
              }
            }
          ]
        }]
      });

      const transcription = transcriptionResult.text || '';

      // Generate summary
      const summaryResult = await geminiRef.current.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{
          role: 'user',
          parts: [{ text: `Provide a comprehensive summary of this meeting transcription. Include main topics, key decisions, and important discussions:\n\n${transcription}` }]
        }]
      });
      const summary = summaryResult.text || '';

      // Generate action items
      const actionItemsResult = await geminiRef.current.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{
          role: 'user',
          parts: [{ text: `Extract all action items from this meeting transcription. For each action item, include the task description, assigned person (if mentioned), and deadline (if mentioned):\n\n${transcription}` }]
        }]
      });
      const actionItems = actionItemsResult.text || '';

      // Generate sentiment analysis
      const sentimentResult = await geminiRef.current.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{
          role: 'user',
          parts: [{ text: `Provide a detailed sentiment analysis of this meeting. Include overall tone, emotional dynamics, and areas of agreement/disagreement:\n\n${transcription}` }]
        }]
      });
      const sentiment = sentimentResult.text || '';

      // Create meeting record
      const meeting: Meeting = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        title: `Meeting ${new Date().toLocaleString()}`,
        rawTranscription: transcription,
        summary,
        actionItems,
        sentiment
      };

      setCurrentMeeting(meeting);
      saveMeeting(meeting);

    } catch (error) {
      console.error('Error processing recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-theme' : '';
  };

  const cycleLanguage = () => {
    const langs = ['en', 'ar', 'fa', 'he'];
    const currentIndex = langs.indexOf(language);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    setLanguage(nextLang);
    localStorage.setItem('language-preference', nextLang);
  };

  const togglePromptMode = () => {
    const newMode = promptMode === 'fast' ? 'smart' : 'fast';
    setPromptMode(newMode);
    localStorage.setItem('prompt-mode', newMode);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!apiKey) {
    return (
      <div className="api-key-modal">
        <div className="modal-content">
          <h2>Enter API Key</h2>
          <p>Please enter your Gemini API key to continue</p>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter your API key"
          />
          <button 
            onClick={() => saveApiKey(apiKeyInput.trim())}
            className="primary-btn"
          >
            Save Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`main-app ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Header */}
      <header className="main-header">
        <h1 className="app-title">Meeting Agent</h1>
        <div className="header-controls">
          <button onClick={cycleLanguage} className="header-btn">
            <span>{language.toUpperCase()}</span>
          </button>
          <button onClick={togglePromptMode} className="header-btn">
            <span>{promptMode.charAt(0).toUpperCase() + promptMode.slice(1)}</span>
          </button>
          <button onClick={toggleTheme} className="header-btn">
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button onClick={clearApiKey} className="header-btn">
            <i className="fas fa-key"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Recording Section */}
          <section className="recording-section">
            <div className="recording-display">
              <div className="timer-display">{formatTime(recordingTime)}</div>
            </div>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`record-button ${isRecording ? 'recording' : ''}`}
            >
              <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </button>
          </section>

          {/* Results Section */}
          {currentMeeting && (
            <section className="results-section">
              <div className="tabs">
                {['transcription', 'summary', 'action-items', 'sentiment'].map(tab => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <i className={`fas ${
                      tab === 'transcription' ? 'fa-file-alt' :
                      tab === 'summary' ? 'fa-compress-alt' :
                      tab === 'action-items' ? 'fa-tasks' : 'fa-smile'
                    }`}></i>
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="tab-content">
                <div className="content-header">
                  <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h3>
                  <button 
                    onClick={() => copyToClipboard(
                      activeTab === 'transcription' ? currentMeeting.rawTranscription :
                      activeTab === 'summary' ? currentMeeting.summary :
                      activeTab === 'action-items' ? currentMeeting.actionItems :
                      currentMeeting.sentiment
                    )}
                    className="copy-btn"
                  >
                    <i className="fas fa-copy"></i> Copy
                  </button>
                </div>
                <div className="content-text">
                  {activeTab === 'transcription' && currentMeeting.rawTranscription}
                  {activeTab === 'summary' && currentMeeting.summary}
                  {activeTab === 'action-items' && currentMeeting.actionItems}
                  {activeTab === 'sentiment' && currentMeeting.sentiment}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Toggle */}
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="sidebar-toggle"
        >
          <i className="fas fa-history"></i>
        </button>
      </main>

      {/* Sidebar */}
      {showSidebar && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Meeting History</h2>
            <button onClick={() => setShowSidebar(false)} className="close-btn">
              &times;
            </button>
          </div>
          <div className="meeting-list">
            {meetings.length === 0 ? (
              <p className="empty-message">No past meetings found.</p>
            ) : (
              meetings.map(meeting => (
                <div
                  key={meeting.id}
                  className={`meeting-item ${currentMeeting?.id === meeting.id ? 'active' : ''}`}
                  onClick={() => setCurrentMeeting(meeting)}
                >
                  <div className="meeting-header">
                    <h4>{meeting.title}</h4>
                    <span className="meeting-date">
                      {new Date(meeting.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      )}

      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-message">
            Processing recording...
          </div>
        </div>
      )}
      {/* Add layout and component styles for Meeting Agent */}
      <style>{`
        .main-app {
          min-height: 100vh;
          background: var(--color-background);
          color: var(--color-text);
          font-family: var(--font-primary);
          display: flex;
          flex-direction: column;
        }
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: var(--color-header-background);
          border-bottom: 1px solid var(--color-component-border);
        }
        .app-title {
          color: var(--color-headline);
          font-family: var(--font-display);
          font-size: 2.2rem;
          margin: 0;
          letter-spacing: 1px;
        }
        .header-controls {
          display: flex;
          gap: 0.5rem;
        }
        .header-btn {
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .header-btn:hover {
          background: var(--color-accent-hover);
        }
        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 2rem 0;
        }
        .content-wrapper {
          width: 100%;
          max-width: 700px;
          background: var(--color-component-background);
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .recording-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .timer-display {
          font-size: 1.5rem;
          color: var(--color-subtitle);
        }
        .record-button {
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .record-button.recording {
          background: var(--color-error);
          color: #fff;
        }
        .results-section {
          margin-top: 2rem;
        }
        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .tab-btn {
          background: var(--color-background);
          color: var(--color-text);
          border: 1px solid var(--color-component-border);
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .tab-btn.active, .tab-btn:hover {
          background: var(--color-accent);
          color: #0A192F;
        }
        .tab-content {
          background: var(--color-background);
          border-radius: 8px;
          border: 1px solid var(--color-component-border);
          padding: 1rem;
        }
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .content-text {
          white-space: pre-wrap;
          font-size: 1rem;
        }
        .copy-btn {
          background: var(--color-accent-secondary);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          font-size: 0.95rem;
          cursor: pointer;
        }
        .sidebar-toggle {
          position: fixed;
          right: 2rem;
          bottom: 2rem;
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .sidebar {
          position: fixed;
          right: 0;
          top: 0;
          width: 320px;
          height: 100vh;
          background: var(--color-component-background);
          box-shadow: -2px 0 8px rgba(0,0,0,0.08);
          z-index: 100;
          display: flex;
          flex-direction: column;
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--color-component-border);
          background: var(--color-header-background);
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--color-error);
          font-size: 2rem;
          cursor: pointer;
        }
        .meeting-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .meeting-item {
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          background: var(--color-background);
          cursor: pointer;
          transition: background 0.2s;
        }
        .meeting-item.active, .meeting-item:hover {
          background: var(--color-accent);
          color: #0A192F;
        }
        .meeting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .meeting-date {
          font-size: 0.85rem;
          color: var(--color-subtitle);
        }
        .empty-message {
          color: var(--color-subtitle);
          text-align: center;
          margin-top: 2rem;
        }
        .processing-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10,25,47,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }
        .processing-message {
          background: var(--color-component-background);
          color: var(--color-headline);
          padding: 2rem 3rem;
          border-radius: 10px;
          font-size: 1.3rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
}