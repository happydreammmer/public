import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { usePromptMode } from '../hooks/usePromptMode';
import { useRecorder } from '../hooks/useRecorder';
import { useLiveDisplay } from '../hooks/useLiveDisplay';
import { useStorage } from '../hooks/useStorage';
import Sidebar from './Sidebar';
import { MeetingRecord } from '../types';
import { generateTranscription, generateSummary, generateActionItems, generateSentimentAnalysis } from '../services/geminiManager';
import { TRANSCRIPTION_PROMPT_TEMPLATE, SUMMARY_PROMPT_TEMPLATE, ACTION_ITEMS_PROMPT_TEMPLATE, SENTIMENT_ANALYSIS_PROMPT_TEMPLATE } from '../config/prompts';

const MainApp: React.FC<{ onClearApiKey: () => void }> = ({ onClearApiKey }) => {
  const { theme, toggleTheme } = useTheme();
  const { cycleLanguage, currentLanguageCode } = useLanguage();
  const { promptMode, togglePromptMode } = usePromptMode();
  const { isRecording, startRecording, stopRecording, audioStream, audioChunks } = useRecorder();
  const { timer, canvasRef } = useLiveDisplay(isRecording, audioStream);
  const { meetingRecords, saveMeetingRecord } = useStorage();
  const [showSidebar, setShowSidebar] = useState(false);
  const [_selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(null);

  useEffect(() => {
    if (!isRecording && audioChunks.length > 0) {
      const processAudio = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const base64Audio = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });

        const transcription = await generateTranscription(base64Audio.split(',')[1], 'audio/webm', TRANSCRIPTION_PROMPT_TEMPLATE);
        if (transcription) {
          const summary = await generateSummary(transcription, SUMMARY_PROMPT_TEMPLATE);
          const actionItems = await generateActionItems(transcription, ACTION_ITEMS_PROMPT_TEMPLATE);
          const sentiment = await generateSentimentAnalysis(transcription, SENTIMENT_ANALYSIS_PROMPT_TEMPLATE);

          const newRecord: MeetingRecord = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            title: 'New Meeting',
            rawTranscription: transcription,
            summary: summary || '',
            actionItems: actionItems || '',
            sentiment: sentiment || '',
          };
          saveMeetingRecord(newRecord);
          setSelectedMeeting(newRecord);
        }
      };
      processAudio();
    }
  }, [isRecording, audioChunks, saveMeetingRecord]);

  const handleSelectMeeting = (meeting: MeetingRecord) => {
    setSelectedMeeting(meeting);
  };

  return (
    <div id="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Meeting Agent</h1>
        </div>
        <div className="header-right">
          <button id="clear-api-key" className="header-button" onClick={onClearApiKey}>Clear API Key</button>
          <div id="promptModeToggle" className="prompt-mode-toggle" title="Toggle between Fast and Smart prompts" onClick={togglePromptMode}>
            <span id="promptModeFastText" className={`prompt-mode-text ${promptMode === 'fast' ? 'active' : ''}`}>Fast</span>
            <div className="toggle-switch">
              <div className="toggle-knob"></div>
            </div>
            <span id="promptModeSmartText" className={`prompt-mode-text ${promptMode === 'smart' ? 'active' : ''}`}>Smart</span>
          </div>
          <div className="language-selector">
            <button id="languageToggleButton" className="header-button language-toggle-button" aria-haspopup="true"
              aria-expanded="false" onClick={cycleLanguage}>
              <i className="fas fa-globe"></i>
              <span id="currentLanguageDisplay">{currentLanguageCode}</span>
            </button>
            <div id="languageDropdown" className="language-dropdown" role="menu">
            </div>
          </div>
          <button id="themeToggleButton" className="header-button" title="Toggle Theme" onClick={toggleTheme}>
            <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
          </button>
          <button id="sidebarToggleButton" className="header-button" title="Toggle Sidebar" onClick={() => setShowSidebar(!showSidebar)}>
            <i className="fas fa-history"></i>
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="note-area">
          <div className="note-header">
            <div 
              contentEditable="true" 
              className="editor-title" 
              id="editorTitle" 
              data-placeholder="Your meeting title here..."
            >
            </div>
            <div className="header-actions">
              <button id="newButton" className="control-button" title="New Meeting">
                <i className="fas fa-plus"></i>
              </button>
              <button id="uploadButton" className="control-button" title="Upload Audio">
                <i className="fas fa-upload"></i>
              </button>
              <input type="file" id="audioFilePicker" accept="audio/*" style={{ display: 'none' }} />
              <button id="downloadAllButton" className="control-button" title="Download All">
                <i className="fas fa-download"></i>
              </button>
            </div>
          </div>
          <div className="note-content-wrapper">
            <div className="tab-navigation">
            </div>
            <div className="tab-content-wrapper">
            </div>
          </div>
          <footer className="note-footer">
            <div className="recording-interface">
              <div className="status-indicator">
                <i id="statusIcon" className="fas fa-circle"></i>
                <span id="recordingStatus"></span>
              </div>
              <div id="liveRecordingTitle"></div>
              <canvas id="liveWaveformCanvas" ref={canvasRef}></canvas>
              <div id="liveRecordingTimerDisplay">{timer}</div>
            </div>
            <button id="recordButton" className="record-button" title="Start/Stop Recording" onClick={isRecording ? stopRecording : startRecording}>
              <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>
          </footer>
        </div>
      </main>
      {showSidebar && <Sidebar meetingRecords={meetingRecords} onSelectMeeting={handleSelectMeeting} />}
    </div>
  );
};

export default MainApp; 