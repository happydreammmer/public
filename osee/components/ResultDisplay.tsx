
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ResultDisplayProps {
  text: string | null | undefined;
  fileName?: string | null;
  filePreviewUrl?: string | null;
  fileType?: string | null;
  error?: string | null;
  onTextEdited?: (newText: string) => void;
}

const ImagePreviewControls: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}> = ({ onZoomIn, onZoomOut, onRotateLeft, onRotateRight, onReset, canZoomIn, canZoomOut }) => {
  const buttonClass = "p-1.5 rounded-md text-slate-300 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  return (
    <div className="flex items-center space-x-1 bg-slate-700/80 p-1 rounded-md mb-2">
      <button onClick={onZoomIn} disabled={!canZoomIn} className={buttonClass} aria-label="Zoom In">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
      </button>
      <button onClick={onZoomOut} disabled={!canZoomOut} className={buttonClass} aria-label="Zoom Out">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" /></svg>
      </button>
      <button onClick={onRotateLeft} className={buttonClass} aria-label="Rotate Left">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
      </button>
      <button onClick={onRotateRight} className={buttonClass} aria-label="Rotate Right">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>
      </button>
      <button onClick={onReset} className={buttonClass} aria-label="Reset View">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
      </button>
    </div>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ text, fileName, filePreviewUrl, fileType, error, onTextEdited }) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editedText, setEditedText] = useState(text || "");
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.2;


  const contentEditableRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (text !== undefined || error || filePreviewUrl) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [text, error, filePreviewUrl]);

  useEffect(() => {
    const newTextValue = text || "";
    setEditedText(newTextValue); 
    if (contentEditableRef.current && contentEditableRef.current.innerText !== newTextValue) {
      contentEditableRef.current.innerText = newTextValue; 
    }
  }, [text]);

  useEffect(() => {
    if (lineNumbersRef.current) {
      const lines = editedText.split('\n');
      const lineCount = Math.max(lines.length, 1); 
      lineNumbersRef.current.innerHTML = Array.from({ length: lineCount }, (_, i) => 
        `<div class="h-[1.625em] flex items-center justify-end">${i + 1}</div>`
      ).join('');
    }
  }, [editedText]);

  const handleTextEdit = useCallback((event: React.FormEvent<HTMLDivElement>) => {
    const currentTextInDOM = event.currentTarget.innerText;
    setEditedText(currentTextInDOM);
    if (onTextEdited) {
      onTextEdited(currentTextInDOM);
    }
  }, [onTextEdited]);

  const handleScroll = useCallback(() => {
    if (lineNumbersRef.current && contentEditableRef.current) {
      lineNumbersRef.current.scrollTop = contentEditableRef.current.scrollTop;
    }
  }, []);

  const handleCopyText = () => {
    if (editedText.trim()) {
      navigator.clipboard.writeText(editedText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          alert('Failed to copy text. Please try manually.');
        });
    }
  };

  const handleDownloadText = () => {
    if (!editedText.trim()) return;
    const safeBaseFileName = (fileName || 'document').replace(/\.[^/.]+$/, "") || "extracted_text";
    const downloadFileName = `${safeBaseFileName}_extracted.txt`;
    const blob = new Blob([editedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  const handleRotateLeft = () => setRotationAngle(prev => (prev - 90) % 360);
  const handleRotateRight = () => setRotationAngle(prev => (prev + 90) % 360);
  const handleResetView = () => {
    setZoomLevel(1);
    setRotationAngle(0);
  };

  const isImage = fileType?.startsWith('image/');
  const hasEditableContent = editedText && editedText.trim() !== "";
  const initialHasTextContent = text && text.trim() !== "";

  return (
    <div
      className={`bg-slate-800 rounded-xl shadow-xl shadow-slate-900/50 w-full flex flex-col transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 flex-shrink-0 cursor-pointer group"
        onClick={toggleCollapse}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleCollapse()}
        tabIndex={0}
        role="button"
        aria-expanded={!isCollapsed}
        aria-controls={`result-content-${fileName?.replace(/\s+/g, '-') || 'unknown'}`}
      >
        <div className="flex items-center">
            <h2 className="text-lg md:text-xl font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
            {error ? 'Processing Error' : 'Extracted Text'}
            {fileName && <span className="text-sm text-slate-400 font-normal ml-2 hidden md:inline truncate max-w-[150px] sm:max-w-xs" title={fileName}>from "{fileName}"</span>}
            </h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ml-2 text-slate-400 group-hover:text-blue-300 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </div>
        {!error && initialHasTextContent && (
          <div className="flex items-center space-x-2 mt-2 sm:mt-0" onClick={(e) => e.stopPropagation()} /* Prevent collapse when clicking buttons */>
            <button
              onClick={handleCopyText}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-150 flex items-center space-x-1.5 sm:space-x-2
                          ${copied ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500' :
                'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'}
                          ${!hasEditableContent ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!hasEditableContent || copied}
              aria-label={copied ? "Text copied to clipboard" : "Copy extracted text to clipboard"}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a8.25 8.25 0 0 1-7.5 7.5H4.5A2.25 2.25 0 0 1 2.25 13.5v-3a2.25 2.25 0 0 1 2.25-2.25H6.75m0 0H3.75m11.25 0h4.5m-4.5 0H9.75M11.25 18.75h3.75m-3.75 0h-3.75m3.75 0V15m0 3.75V15m0 0H9.75" />
                </svg>
              )}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              <span className="sm:hidden">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadText}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-150 flex items-center space-x-1.5 sm:space-x-2
                          bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500
                          ${!hasEditableContent ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!hasEditableContent}
              aria-label="Download extracted text as a .txt file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">DL</span>
            </button>
          </div>
        )}
      </div>
      {fileName && <p className="text-xs text-slate-400 font-normal mb-3 md:hidden -mt-3 px-4 sm:px-6 truncate" title={fileName}>File: "{fileName}"</p>}

      <div 
        id={`result-content-${fileName?.replace(/\s+/g, '-') || 'unknown'}`}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}`}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col gap-4 md:gap-6 flex-grow">
            {isImage && filePreviewUrl && !error && (
            <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-700 flex-shrink-0">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-md font-semibold text-slate-200">Image Preview</h3>
                    <ImagePreviewControls 
                        onZoomIn={handleZoomIn} 
                        onZoomOut={handleZoomOut}
                        onRotateLeft={handleRotateLeft}
                        onRotateRight={handleRotateRight}
                        onReset={handleResetView}
                        canZoomIn={zoomLevel < MAX_ZOOM}
                        canZoomOut={zoomLevel > MIN_ZOOM}
                    />
                </div>
                <div 
                  className="flex items-center justify-center w-full py-2 bg-slate-900/30 rounded max-h-[200px] sm:max-h-[250px] md:max-h-[300px] overflow-hidden"
                >
                    <img
                        src={filePreviewUrl}
                        alt="Uploaded image content preview"
                        className="max-w-full max-h-full object-contain rounded-md shadow-sm transition-transform duration-200 ease-out"
                        style={{ transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)` }}
                    />
                </div>
            </div>
            )}

            <div className="bg-slate-700/50 p-1 sm:p-2 rounded-md border border-slate-700 flex flex-col flex-grow min-h-[200px] overflow-hidden">
            {error ? (
                <div className="text-center py-6 flex flex-col items-center justify-center flex-grow min-h-[150px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-400 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.956 11.956 0 0 1 20.488 8.25l-3.094 3.093m-4.243-3.093-3.094-3.093A11.956 11.956 0 0 1 12 2.964Zm0 10.036a6.75 6.75 0 1 1 0 13.5 6.75 6.75 0 0 1 0-13.5Zm0 0V9m0 3.75h.008v.008H12v-.008Z" />
                </svg>
                <p className="text-red-300 font-medium text-md">Extraction Failed</p>
                <p className="text-red-400 text-sm mt-1 break-words px-2">{error}</p>
                </div>
            ) : initialHasTextContent ? (
                <div className="flex flex-row flex-grow min-h-[100px] h-full overflow-hidden">
                <div
                    ref={lineNumbersRef}
                    className="text-sm text-right text-slate-500 bg-slate-800/30 pt-[0.125rem] sm:pt-[0.25rem] pr-2 select-none font-mono leading-relaxed custom-scrollbar"
                    style={{ flexBasis: 'auto', minWidth: '35px', flexShrink: 0, overflowY: 'hidden', scrollbarWidth: 'none' }}
                    aria-hidden="true"
                >
                </div>
                <div
                    ref={contentEditableRef}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onInput={handleTextEdit}
                    onScroll={handleScroll}
                    className="text-sm text-slate-300 whitespace-pre-wrap break-words font-mono leading-relaxed flex-grow p-[0.125rem] sm:p-[0.25rem] custom-scrollbar overflow-y-auto focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-slate-700/70 rounded-sm caret-blue-400"
                    role="textbox"
                    aria-multiline="true"
                    aria-label="Editable extracted text"
                    style={{lineHeight: '1.625em'}} 
                />
                </div>
            ) : (
                <div className="text-center py-8 flex flex-col items-center justify-center flex-grow min-h-[150px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-amber-400 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <p className="text-slate-300 font-medium text-lg">No Text Extracted</p>
                <p className="text-slate-400 text-sm mt-1">The AI could not find any text in this file.</p>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
