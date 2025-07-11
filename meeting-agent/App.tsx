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
      {/* Refined and comprehensive styles for Meeting Agent */}
      <style>{`
        :root {
          --color-background: #0A192F;
          --color-component-background: #112240;
          --color-header-background: #0A192F;
          --color-text: #CCD6F6;
          --color-headline: #E6F1FF;
          --color-subtitle: #8892B0;
          --color-accent: #64FFDA;
          --color-accent-hover: #52d8bA;
          --color-accent-secondary: #0D3B66;
          --color-component-border: #1E3A5F;
          --color-error: #E57373;
          --font-primary: 'Inter', sans-serif;
          --font-display: 'Montserrat', sans-serif;
        }

        html.dark-theme {
          --color-background: #0A192F;
          --color-component-background: #112240;
          --color-header-background: #0A192F;
          --color-text: #CCD6F6;
          --color-headline: #E6F1FF;
          --color-subtitle: #8892B0;
        }

        html.light-theme {
          --color-background: #F0F4F8;
          --color-component-background: #FFFFFF;
          --color-header-background: #F0F4F8;
          --color-text: #334E68;
          --color-headline: #102A43;
          --color-subtitle: #627D98;
          --color-accent: #26A69A;
          --color-accent-hover: #00897B;
          --color-accent-secondary: #B2DFDB;
          --color-component-border: #D9E2EC;
          --color-error: #D32F2F;
        }

        body {
          margin: 0;
          font-family: var(--font-primary);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: var(--color-background);
          color: var(--color-text);
          transition: background-color 0.3s;
        }

        .main-app {
          min-height: 100vh;
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
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .app-title {
          color: var(--color-headline);
          font-family: var(--font-display);
          font-size: 1.8rem;
          margin: 0;
        }

        .header-controls {
          display: flex;
          gap: 1rem;
        }

        .header-btn {
          background: transparent;
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .header-btn:hover, .header-btn:focus {
          background: var(--color-accent);
          color: var(--color-background);
        }

        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 2rem;
        }

        .content-wrapper {
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .recording-section {
          background: var(--color-component-background);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--color-component-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .recording-display {
          width: 100%;
          height: 100px;
          background: var(--color-background);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timer-display {
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--color-headline);
        }

        .record-button {
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s, transform 0.15s;
        }
        
        .record-button.recording {
          background: var(--color-error);
          color: #fff;
        }

        .record-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .results-section {
          background: var(--color-component-background);
          border-radius: 12px;
          border: 1px solid var(--color-component-border);
          overflow: hidden;
        }

        .tabs {
          display: flex;
          background: var(--color-header-background);
          border-bottom: 1px solid var(--color-component-border);
        }
        
        .tab-btn {
          flex: 1;
          padding: 1rem;
          background: transparent;
          border: none;
          color: var(--color-subtitle);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        
        .tab-btn.active {
          color: var(--color-accent);
          border-bottom: 2px solid var(--color-accent);
        }

        .tab-content {
          padding: 1.5rem;
        }
        
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .content-header h3 {
          margin: 0;
          color: var(--color-headline);
        }

        .content-text {
          white-space: pre-wrap;
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .copy-btn {
          background: var(--color-accent-secondary);
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .copy-btn:hover {
          background: var(--color-accent);
          color: var(--color-background);
        }

        .sidebar-toggle {
          position: fixed;
          right: 2rem;
          bottom: 2rem;
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .sidebar-toggle:hover {
          transform: scale(1.1);
        }

        .sidebar {
          position: fixed;
          right: 0;
          top: 0;
          width: 320px;
          height: 100vh;
          background: var(--color-header-background);
          box-shadow: -2px 0 12px rgba(0,0,0,0.15);
          z-index: 100;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid var(--color-component-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: var(--color-subtitle);
          font-size: 1.5rem;
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
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .meeting-item.active, .meeting-item:hover {
          background: var(--color-accent-secondary);
        }
        
        .meeting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .api-key-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10,25,47,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }
        
        .modal-content {
          background: var(--color-component-background);
          padding: 2rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 90%;
          max-width: 400px;
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