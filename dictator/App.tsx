import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

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
      const model = geminiRef.current.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const transcriptionResult = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { text: "Transcribe this audio in its original language. Include all spoken content." },
            { 
              inline_data: {
                mime_type: audioBlob.type,
                data: base64Audio.split(',')[1]
              }
            }
          ]
        }]
      });
      
      const transcription = await transcriptionResult.response.text();
      
      // Get AI response
      setRecordingStatus('Getting AI response...');
      const aiResult = await model.generateContent(
        `Transform this transcribed text into a well-structured, clear response. Improve clarity, fix grammar, and organize the content logically:\n\n${transcription}`
      );
      
      const aiResponse = await aiResult.response.text();
      
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
    </div>
  );
}