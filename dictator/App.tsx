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
        .app-container {
          min-height: 100vh;
          background: var(--color-background);
          color: var(--color-text);
          font-family: var(--font-primary);
          display: flex;
          flex-direction: column;
          transition: background-color 0.3s;
        }
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2.5rem 1.2rem 2.5rem;
          background: var(--color-header-background);
          border-bottom: 1px solid var(--color-component-border);
          transition: background-color 0.3s, border-color 0.3s;
        }
        .logo-container h1 {
          color: var(--color-headline);
          font-family: var(--font-display);
          font-size: 2.5rem;
          margin: 0;
          letter-spacing: 1px;
        }
        .controls-container {
          display: flex;
          gap: 0.75rem;
        }
        .header-button {
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 6px;
          padding: 0.6rem 1.2rem;
          font-size: 1.05rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.1s;
        }
        .header-button:hover, .header-button:focus {
          background: var(--color-accent-hover);
          color: #fff;
          transform: translateY(-2px);
        }
        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 2.5rem 0 1.5rem 0;
        }
        .editor-view {
          width: 100%;
          max-width: 900px;
          background: var(--color-component-background);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          padding: 2.5rem 2rem 2rem 2rem;
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .editor-header {
          margin-bottom: 1.5rem;
        }
        .editor-title {
          width: 100%;
          font-size: 1.25rem;
          padding: 1rem;
          border-radius: 8px;
          border: 1.5px solid var(--color-component-border);
          background: var(--color-input-background);
          color: var(--color-text);
          font-weight: 500;
          margin-bottom: 0.5rem;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .editor-title:focus {
          border: 1.5px solid var(--color-accent);
          outline: none;
          box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.2);
        }
        .cards-container {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .card {
          flex: 1 1 320px;
          background: var(--color-background);
          border-radius: 12px;
          border: 1.5px solid var(--color-component-border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          min-width: 300px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .card-header {
          padding: 1.1rem 1.2rem 0.7rem 1.2rem;
          border-bottom: 1.5px solid var(--color-component-border);
          background: var(--color-header-background);
          color: var(--color-headline);
          border-radius: 12px 12px 0 0;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .card-content {
          padding: 1.2rem 1.2rem 1.5rem 1.2rem;
          flex: 1;
        }
        .card-content textarea {
          width: 100%;
          min-height: 120px;
          background: var(--color-component-background);
          color: var(--color-text);
          border: 1.5px solid var(--color-component-border);
          border-radius: 8px;
          padding: 1rem;
          font-size: 1.05rem;
          font-family: var(--font-secondary);
          resize: vertical;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .card-content textarea:focus {
          border: 1.5px solid var(--color-accent);
          outline: none;
          box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.2);
        }
        .recording-controls-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1.2rem;
        }
        .recording-status {
          margin-bottom: 0.5rem;
          color: var(--color-subtitle);
          font-size: 1.1rem;
        }
        .main-action-buttons {
          display: flex;
          gap: 1.2rem;
        }
        .record-button {
          background: var(--color-accent);
          color: #0A192F;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          font-size: 1.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(100,255,218,0.10);
        }
        .record-button.recording {
          background: var(--color-error);
          color: #fff;
        }
        .record-button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        .record-button:focus {
          outline: 2px solid var(--color-accent);
        }
        .control-button {
          background: var(--color-accent-secondary);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.15s;
        }
        .control-button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        .control-button:focus {
          outline: 2px solid var(--color-accent-secondary);
        }
        .history-sidebar {
          position: fixed;
          right: 0;
          top: 0;
          width: 340px;
          height: 100vh;
          background: var(--color-component-background);
          box-shadow: -2px 0 12px rgba(0,0,0,0.10);
          z-index: 100;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease-out;
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.2rem 1rem 1.2rem;
          border-bottom: 1.5px solid var(--color-component-border);
          background: var(--color-header-background);
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--color-error);
          font-size: 2.2rem;
          cursor: pointer;
        }
        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 1.2rem;
          scrollbar-width: thin;
          scrollbar-color: var(--color-accent) var(--color-component-background);
        }
        .history-list::-webkit-scrollbar {
          width: 8px;
        }
        .history-list::-webkit-scrollbar-thumb {
          background: var(--color-accent);
          border-radius: 4px;
        }
        .history-item {
          padding: 0.85rem 1.1rem;
          border-radius: 8px;
          margin-bottom: 0.7rem;
          background: var(--color-background);
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          font-size: 1.05rem;
        }
        .history-item.active, .history-item:hover {
          background: var(--color-accent);
          color: #0A192F;
          transform: translateX(-4px);
        }
        .history-item-title {
          font-weight: 600;
        }
        .history-item-date {
          font-size: 0.9rem;
          color: var(--color-subtitle);
        }
        .empty-message {
          color: var(--color-subtitle);
          text-align: center;
          margin-top: 2rem;
          font-size: 1.1rem;
          opacity: 0.8;
        }
        .feedback-message {
          padding: 0.8rem 1.2rem;
          border-radius: 6px;
          margin: 1rem 0;
          font-size: 1rem;
        }
        .feedback-message.error {
          background: #ff5252;
          color: #fff;
        }
        .feedback-message.success {
          background: #64ffda;
          color: #0a192f;
        }
        @keyframes spinner {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .loading-spinner {
          border: 4px solid var(--color-component-border);
          border-top: 4px solid var(--color-accent);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          animation: spinner 1s linear infinite;
          margin: 2rem auto;
        }
        @media (max-width: 1100px) {
          .editor-view { max-width: 98vw; }
          .cards-container { flex-direction: column; gap: 1.5rem; }
        }
        @media (max-width: 700px) {
          .main-header { flex-direction: column; gap: 1rem; padding: 1rem; }
          .editor-view { padding: 1.2rem 0.5rem; }
          .main-content { padding: 1rem 0 1rem 0; }
        }
        @media (max-width: 500px) {
          .editor-title, .card-content textarea { font-size: 1rem; padding: 0.7rem; }
          .card-header { font-size: 1.05rem; }
        }
      `}</style>
    </div>
  );
}