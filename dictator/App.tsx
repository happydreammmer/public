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
      {/* Add layout and component styles for Dictator */}
      <style>{`
        .app-container {
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
        .logo-container h1 {
          color: var(--color-headline);
          font-family: var(--font-display);
          font-size: 2.2rem;
          margin: 0;
          letter-spacing: 1px;
        }
        .controls-container {
          display: flex;
          gap: 0.5rem;
        }
        .header-button {
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .header-button:hover {
          background: var(--color-accent-hover);
        }
        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 2rem 0;
        }
        .editor-view {
          width: 100%;
          max-width: 700px;
          background: var(--color-component-background);
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .editor-header {
          margin-bottom: 1.5rem;
        }
        .editor-title {
          width: 100%;
          font-size: 1.3rem;
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--color-component-border);
          background: var(--color-input-background);
          color: var(--color-text);
        }
        .cards-container {
          display: flex;
          gap: 2rem;
        }
        .card {
          flex: 1;
          background: var(--color-background);
          border-radius: 8px;
          border: 1px solid var(--color-component-border);
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
        }
        .card-header {
          padding: 1rem;
          border-bottom: 1px solid var(--color-component-border);
          background: var(--color-header-background);
          color: var(--color-headline);
          border-radius: 8px 8px 0 0;
        }
        .card-content {
          padding: 1rem;
          flex: 1;
        }
        .card-content textarea {
          width: 100%;
          min-height: 100px;
          background: var(--color-component-background);
          color: var(--color-text);
          border: 1px solid var(--color-component-border);
          border-radius: 6px;
          padding: 0.75rem;
          font-size: 1rem;
        }
        .recording-controls-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }
        .recording-status {
          margin-bottom: 1rem;
          color: var(--color-subtitle);
        }
        .main-action-buttons {
          display: flex;
          gap: 1rem;
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
        .control-button {
          background: var(--color-accent-secondary);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .history-sidebar {
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
        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .history-item {
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          background: var(--color-background);
          cursor: pointer;
          transition: background 0.2s;
        }
        .history-item.active, .history-item:hover {
          background: var(--color-accent);
          color: #0A192F;
        }
        .history-item-title {
          font-weight: 500;
        }
        .history-item-date {
          font-size: 0.85rem;
          color: var(--color-subtitle);
        }
      `}</style>
    </div>
  );
}