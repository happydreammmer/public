import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import './index.css';

const API_KEY_STORAGE = 'gemini_api_key';

interface Note {
  id: string;
  title: string;
  rawTranscription: string;
  promptResponse: string;
  timestamp: number;
  audioBase64?: string;
  audioMimeType?: string;
}

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('Ready to record or upload audio');
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState('dark');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const geminiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey) {
      setApiKey(savedKey);
      geminiRef.current = new GoogleGenAI({ apiKey: savedKey });
    }
    
    // Load saved notes
    const savedNotes = localStorage.getItem('voiceNotes_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading notes:', e);
      }
    }

    // Create initial note
    createNewNote();
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

  const createNewNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: '',
      rawTranscription: '',
      promptResponse: '',
      timestamp: Date.now()
    };
    setCurrentNote(newNote);
  };

  const saveNote = (note: Note) => {
    const updatedNotes = notes.filter(n => n.id !== note.id);
    updatedNotes.unshift(note);
    setNotes(updatedNotes);
    localStorage.setItem('voiceNotes_notes', JSON.stringify(updatedNotes));
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
      setRecordingStatus('Recording...');
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingStatus('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setRecordingStatus('Processing...');
  };

  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      setRecordingStatus('No audio recorded');
      return;
    }

    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const base64Audio = await blobToBase64(audioBlob);
      
      if (!geminiRef.current || !currentNote) {
        throw new Error('Gemini API not initialized or no current note');
      }

      // Get transcription
      setRecordingStatus('Getting transcription...');
      
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
      
      // Get AI response
      setRecordingStatus('Getting AI response...');
      const aiResult = await geminiRef.current.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{
          role: 'user',
          parts: [{ text: `Transform this transcribed text into a well-structured, clear response. Improve clarity, fix grammar, and organize the content logically:\n\n${transcription}` }]
        }]
      });
      
      const aiResponse = aiResult.text || '';
      
      // Update note
      const updatedNote: Note = {
        ...currentNote,
        rawTranscription: transcription,
        promptResponse: aiResponse,
        title: currentNote.title || `Voice Note ${new Date().toLocaleDateString()}`,
        audioBase64: base64Audio.split(',')[1],
        audioMimeType: audioBlob.type
      };
      
      setCurrentNote(updatedNote);
      saveNote(updatedNote);
      setRecordingStatus('Processing complete!');
      
    } catch (error) {
      console.error('Error processing recording:', error);
      setRecordingStatus('Error processing recording');
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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
  };

  if (!apiKey) {
    return (
      <div className="api-key-container">
        <h1>Enter Gemini API Key</h1>
        <p>To use this application, please enter your Google Gemini API key.</p>
        <input
          type="password"
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          placeholder="Enter your API key"
        />
        <button onClick={() => saveApiKey(apiKeyInput.trim())}>
          Save Key
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="logo-container">
          <h1>Dictator</h1>
        </div>
        <div className="controls-container">
          <button onClick={clearApiKey} className="header-button">
            Clear API Key
          </button>
          <button onClick={toggleTheme} className="header-button" aria-label="Toggle Theme">
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className="header-button" 
            aria-label="Toggle History"
          >
            <i className="fas fa-history"></i>
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="editor-view">
          <div className="editor-header">
            <input
              type="text"
              className="editor-title"
              value={currentNote?.title || ''}
              onChange={(e) => setCurrentNote(prev => prev ? {...prev, title: e.target.value} : null)}
              placeholder="Your note's title will appear here..."
            />
          </div>
          
          <div className="cards-container">
            <div className="card">
              <div className="card-header">
                <h2><i className="fas fa-closed-captioning"></i> Raw Transcription</h2>
              </div>
              <div className="card-content">
                <textarea
                  value={currentNote?.rawTranscription || ''}
                  onChange={(e) => setCurrentNote(prev => prev ? {...prev, rawTranscription: e.target.value} : null)}
                  placeholder="Your live transcription will appear here after you finish recording..."
                  rows={8}
                />
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h2><i className="fas fa-magic"></i> AI-Enhanced Response</h2>
              </div>
              <div className="card-content">
                <textarea
                  value={currentNote?.promptResponse || ''}
                  onChange={(e) => setCurrentNote(prev => prev ? {...prev, promptResponse: e.target.value} : null)}
                  placeholder="The AI's response to your prompt will appear here..."
                  rows={8}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="recording-controls-container">
          <div className="recording-status">{recordingStatus}</div>
          
          <div className="main-action-buttons">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`record-button ${isRecording ? 'recording' : ''}`}
              aria-label={isRecording ? "Stop Recording" : "Start Recording"}
            >
              <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>
            
            <button 
              onClick={createNewNote} 
              disabled={isRecording || isProcessing}
              className="control-button" 
              aria-label="New Note"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </main>

      {showHistory && (
        <aside className="history-sidebar">
          <div className="sidebar-header">
            <h2><i className="fas fa-history"></i> Note History</h2>
            <button onClick={() => setShowHistory(false)} className="close-btn">
              &times;
            </button>
          </div>
          <div className="history-list">
            {notes.length === 0 ? (
              <p>No saved notes.</p>
            ) : (
              notes.map(note => (
                <div 
                  key={note.id} 
                  className={`history-item ${currentNote?.id === note.id ? 'active' : ''}`}
                  onClick={() => setCurrentNote(note)}
                >
                  <span className="history-item-title">
                    {note.title || 'Untitled Note'}
                  </span>
                  <small className="history-item-date">
                    {new Date(note.timestamp).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </aside>
      )}
      {/* Refined and comprehensive styles for Dictator */}
      <style>{`
        :root {
          --color-background: #0A192F;
          --color-component-background: #112240;
          --color-header-background: #0A192F;
          --color-input-background: #0A192F;
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
          --font-secondary: 'Roboto Mono', monospace;
        }

        html.light-theme {
          --color-background: #F0F4F8;
          --color-component-background: #FFFFFF;
          --color-header-background: #F0F4F8;
          --color-input-background: #F0F4F8;
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

        .app-container {
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

        .logo-container h1 {
          color: var(--color-headline);
          font-family: var(--font-display);
          font-size: 1.8rem;
          margin: 0;
        }

        .controls-container {
          display: flex;
          gap: 1rem;
        }

        .header-button {
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

        .header-button:hover, .header-button:focus {
          background: var(--color-accent);
          color: var(--color-background);
        }

        .main-content {
          display: flex;
          flex: 1;
        }

        .editor-view {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .editor-header {
          margin-bottom: 1rem;
        }

        .editor-title {
          width: 100%;
          font-size: 1.5rem;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--color-component-border);
          background: var(--color-component-background);
          color: var(--color-headline);
          font-weight: 600;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .editor-title:focus {
          border-color: var(--color-accent);
          outline: none;
          box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.15);
        }
        
        .cards-container {
          display: flex;
          gap: 2rem;
          flex: 1;
        }

        .card {
          flex: 1;
          background: var(--color-component-background);
          border-radius: 12px;
          border: 1px solid var(--color-component-border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }

        .card-header {
          padding: 1rem;
          border-bottom: 1px solid var(--color-component-border);
          color: var(--color-headline);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .card-content {
          padding: 1rem;
          flex: 1;
        }
        
        .card-content textarea {
          width: 100%;
          height: 100%;
          background: transparent;
          color: var(--color-text);
          border: none;
          border-radius: 8px;
          padding: 0.5rem;
          font-size: 1rem;
          font-family: var(--font-secondary);
          resize: none;
        }
        
        .card-content textarea:focus {
          outline: none;
          box-shadow: 0 0 0 2px var(--color-accent) inset;
        }

        .recording-controls-container {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: var(--color-component-background);
          padding: 1.5rem 2rem;
          border-radius: 12px;
          border: 1px solid var(--color-component-border);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .recording-status {
          color: var(--color-subtitle);
          font-size: 0.9rem;
        }
        
        .main-action-buttons {
          display: flex;
          gap: 1.5rem;
          align-items: center;
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
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        
        .record-button.recording {
          background: var(--color-error);
          color: #fff;
        }

        .record-button:hover:not(:disabled) {
          transform: scale(1.1);
        }

        .control-button {
          background: var(--color-accent-secondary);
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }

        .control-button:hover:not(:disabled) {
          background: var(--color-accent);
          color: var(--color-background);
          transform: scale(1.1);
        }
        
        .history-sidebar {
          width: 300px;
          background: var(--color-header-background);
          border-left: 1px solid var(--color-component-border);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease-in-out;
        }
        
        .history-sidebar.hidden {
          width: 0;
          padding: 0;
          overflow: hidden;
        }

        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid var(--color-component-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .history-item {
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .history-item.active, .history-item:hover {
          background: var(--color-accent-secondary);
        }

        .history-item-title {
          font-weight: 500;
          color: var(--color-headline);
        }

        .history-item-date {
          font-size: 0.8rem;
          color: var(--color-subtitle);
        }
        
        .api-key-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          gap: 1rem;
        }
        
        .api-key-container input {
          padding: 0.75rem;
          width: 300px;
          border-radius: 6px;
          border: 1px solid var(--color-component-border);
          background: var(--color-component-background);
          color: var(--color-text);
        }

        .api-key-container button {
          padding: 0.75rem 1.5rem;
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}