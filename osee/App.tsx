
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import FileDropzone from './components/FileDropzone';
import LoadingSpinner from './components/LoadingSpinner';
import ResultDisplay from './components/ResultDisplay';
import ErrorMessage from './components/ErrorMessage';
import FileQueueDisplay from './components/FileQueueDisplay';
import { extractTextFromData, resetAiClient } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { getApiKey, saveApiKey, clearApiKey } from './lib/apiKey';

export interface ProcessedFile {
  id: string;
  file: File; // Note: For session-restored items, this will be a mock File object
  status: 'pending' | 'processing' | 'completed' | 'error';
  extractedText?: string | null;
  previewUrl?: string | null; // Note: May be invalid if restored from session and was an object URL
  error?: string | null;
}

// Interface for data stored in sessionStorage
interface StoredFile {
  id: string;
  fileName: string;
  fileType: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  extractedText?: string | null;
  previewUrl?: string | null;
  error?: string | null;
}

const SESSION_STORAGE_KEY = 'ocrAppSessionData';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [files, setFiles] = useState<ProcessedFile[]>(() => {
    const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (savedData) {
      try {
        const storedFiles: StoredFile[] = JSON.parse(savedData);
        return storedFiles.map(sf => {
          let status = sf.status;
          let error = sf.error;
          // If a file was 'pending' or 'processing' during last session, it cannot be automatically resumed
          // as the actual file blob is not persisted. Mark as an error.
          if (status === 'pending' || status === 'processing') {
            status = 'error';
            error = sf.error || "File processing was interrupted and cannot be resumed from session. Please re-add the file if needed.";
          }
          return {
            id: sf.id,
            // Create a mock File object. This file cannot be re-processed by Gemini
            // as it doesn't contain the actual data. Its size will be 0.
            file: new File([], sf.fileName, { type: sf.fileType }),
            status: status,
            extractedText: sf.extractedText,
            previewUrl: sf.previewUrl, // This URL might be invalid if it was an object URL
            error: error,
          };
        });
      } catch (e) {
        console.error("Failed to parse session data:", e);
        sessionStorage.removeItem(SESSION_STORAGE_KEY); // Clear corrupted data
        return [];
      }
    }
    return [];
  });

  const [appError, setAppError] = useState<string | null>(null);

  // Ref to hold the current files state for cleanup purposes
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    const key = getApiKey();
    if (key) {
      setApiKey(key);
    }
  }, []);

  // Effect for saving to sessionStorage whenever files change
  useEffect(() => {
    if (files.length > 0) {
      const filesToStore: StoredFile[] = files.map(f => ({
        id: f.id,
        fileName: f.file.name,
        fileType: f.file.type,
        status: f.status,
        extractedText: f.extractedText,
        previewUrl: f.previewUrl,
        error: f.error,
      }));
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(filesToStore));
    } else {
      // If files array is empty (e.g., after "Clear All"), remove the item from session storage
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [files]);


  // Effect for cleaning up Object URLs on App unmount
  useEffect(() => {
    return () => {
      // filesRef.current holds the state of files at the time of unmount
      filesRef.current.forEach(f => {
        if (f.previewUrl && f.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(f.previewUrl);
        }
      });
    };
  }, []); // Empty dependency array ensures this runs only on unmount

  const handleFileAccepted = useCallback((acceptedFiles: File[]) => { // Changed from FileList
    setAppError(null);
    const newFiles: ProcessedFile[] = acceptedFiles.map(file => ({ // No Array.from needed
      id: crypto.randomUUID(),
      file, 
      status: 'pending',
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  useEffect(() => {
    const currentFileToProcess = files.find(f => f.status === 'pending');
    const isAnotherFileProcessing = files.some(f => f.status === 'processing');

    // Ensure the file to process has actual data (size > 0), not a mock from session restore
    if (currentFileToProcess && currentFileToProcess.file.size > 0 && !isAnotherFileProcessing) {
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === currentFileToProcess.id ? { ...f, status: 'processing' } : f
        )
      );

      (async () => {
        let newPreviewUrl: string | null = null;
        try {
          // Create preview URL only for images
          if (currentFileToProcess.file.type.startsWith('image/')) {
            newPreviewUrl = URL.createObjectURL(currentFileToProcess.file);
          }
          const base64Data = await fileToBase64(currentFileToProcess.file);
          const text = await extractTextFromData(base64Data, currentFileToProcess.file.type);
          setFiles(prevFiles =>
            prevFiles.map(f =>
              f.id === currentFileToProcess.id
                ? { ...f, status: 'completed', extractedText: text, previewUrl: newPreviewUrl }
                : f
            )
          );
        } catch (err: any) {
          console.error(`Error processing file ${currentFileToProcess.file.name}:`, err);
          // Only revoke if this specific processing attempt created it and failed
          if (newPreviewUrl && files.find(f => f.id === currentFileToProcess.id)?.previewUrl !== newPreviewUrl) {
             URL.revokeObjectURL(newPreviewUrl);
          }


          if (err.message && (err.message.includes("API key not valid") || err.message.includes("API key is not configured"))) {
            setAppError(err.message);
            setFiles(prevFiles =>
              prevFiles.map(f =>
                f.id === currentFileToProcess.id
                  ? { ...f, status: 'error', error: "Processing stopped due to API key issue.", previewUrl: f.previewUrl || null } // Keep existing preview if any
                  : (f.status === 'pending' ? { ...f, status: 'error', error: "Skipped due to API key issue." } : f)
              )
            );
          } else {
            setFiles(prevFiles =>
              prevFiles.map(f =>
                f.id === currentFileToProcess.id
                  ? { ...f, status: 'error', error: err.message || 'Processing failed', previewUrl: f.previewUrl || null } // Keep existing preview
                  : f
              )
            );
          }
        }
      })();
    } else if (currentFileToProcess && currentFileToProcess.file.size === 0 && currentFileToProcess.status === 'pending') {
      // This case handles 'pending' files restored from session that have no actual data. Mark as error.
       setFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === currentFileToProcess.id 
            ? { ...f, status: 'error', error: "File data not found (restored from session). Please re-add the file." } 
            : f
        )
      );
    }
  }, [files, setAppError]); // setAppError added as dependency

  const handleClearAll = useCallback(() => {
    // Revoke Object URLs for all files currently in state before clearing
    files.forEach(f => {
      if (f.previewUrl && f.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(f.previewUrl);
      }
    });
    setFiles([]); // This will trigger the useEffect to clear sessionStorage
    setAppError(null);
    const fileInput = document.getElementById('fileInputOCR') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }, [files]); // files is a dependency

  const dismissAppError = useCallback(() => {
    setAppError(null);
  }, []);
  
  const handleTextEdited = useCallback((fileId: string, newText: string) => {
    setFiles(prevFiles =>
      prevFiles.map(f =>
        f.id === fileId ? { ...f, extractedText: newText } : f
      )
    );
  }, []);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    resetAiClient();
    setApiKey(null);
  };

  const isQueueProcessing = files.some(f => f.status === 'processing');
  const hasPendingFiles = files.some(f => f.status === 'pending' && f.file.size > 0); // Only count pending if has actual data
  const overallLoading = isQueueProcessing || hasPendingFiles;
  const displayableFiles = files.filter(f => f.status === 'completed' || f.status === 'error');

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Enter Gemini API Key</h1>
          <p className="mb-6">To use this application, please enter your Google Gemini API key.</p>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter your API key"
            className="w-full max-w-md px-4 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={handleSaveApiKey} className="px-6 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
            Save Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      <Header />
      <div className="p-3 sm:p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <span className="text-xs sm:text-sm text-slate-300">API Key is set.</span>
        <button onClick={handleClearApiKey} className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs bg-red-600 rounded-md hover:bg-red-700 transition-colors">
          Clear API Key
        </button>
      </div>
      <ErrorMessage message={appError} onDismiss={dismissAppError} />

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden p-4 sm:p-6 gap-4 md:gap-6">
        <div className="md:w-2/5 lg:w-1/3 flex flex-col md:h-full md:pr-3">
          <div className="bg-slate-800 rounded-xl shadow-xl shadow-slate-900/50 flex flex-col md:h-full p-4 sm:p-6 space-y-3 sm:space-y-4">
            <section className="space-y-4 flex-shrink-0">
              <div className="text-left">
                <h2 className="text-xl font-semibold text-slate-100">Upload Documents</h2>
                <p className="text-slate-300 mt-1 text-sm">
                  {files.length === 0 ? "Select files for text extraction." : `${files.length} file(s) in queue. ${files.filter(f => f.status === 'pending' && f.file.size > 0).length} pending.`}
                </p>
              </div>
              <FileDropzone
                onFilesAccepted={handleFileAccepted}
                setGlobalError={setAppError}
                isProcessingQueue={isQueueProcessing}
              />
            </section>

            {files.length > 0 && (
              <FileQueueDisplay
                files={files}
                className="flex-grow overflow-y-auto custom-scrollbar min-h-[100px] md:max-h-none"
              />
            )}

            {files.length > 0 && (
              <div className="mt-auto pt-4 flex justify-center flex-shrink-0">
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition duration-150 ease-in-out shadow-sm hover:shadow-md flex items-center space-x-2 w-full sm:w-auto justify-center"
                  aria-label="Clear all files and results"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  <span>Clear All ({files.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-3/5 lg:w-2/3 flex flex-col custom-scrollbar overflow-y-auto md:pl-3 md:h-full gap-4 md:gap-6 pb-2">
          {(!overallLoading && displayableFiles.length === 0 && files.length === 0) && ( // Initial state
            <section className="w-full md:h-full min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-slate-800 rounded-xl shadow-xl shadow-slate-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 sm:w-20 sm:h-20 text-slate-500 mb-4 sm:mb-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-200">Results Area</h3>
              <p className="text-slate-400 mt-2 max-w-md text-sm sm:text-base">
                Upload files using the panel on the left to see extracted text results here.
              </p>
            </section>
          )}

          {(isQueueProcessing || (hasPendingFiles && displayableFiles.length === 0)) && files.length > 0 && ( // Loading state
            <section className="w-full md:h-full min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-slate-800 rounded-xl shadow-xl shadow-slate-900/50">
              <LoadingSpinner />
              <p className="text-base sm:text-lg font-medium text-blue-400 mt-4">
                {isQueueProcessing ? `Processing file ${files.find(f => f.status === 'processing')?.file.name || ''}...` : `Initializing queue...`}
              </p>
              <p className="text-sm sm:text-md text-slate-300 mt-1">{files.filter(f => f.status === 'pending' && f.file.size > 0).length} file(s) pending.</p>
            </section>
          )}

          {displayableFiles.map(processedFile => (
              <ResultDisplay
                key={processedFile.id}
                text={processedFile.extractedText}
                fileName={processedFile.file.name}
                filePreviewUrl={processedFile.previewUrl}
                fileType={processedFile.file.type}
                error={processedFile.error}
                onTextEdited={(newText) => handleTextEdited(processedFile.id, newText)}
              />
            )
          )}
          
          {/* Message for when all files processed but no actual content to show (e.g. all errors, or only pending non-processable from session) */}
          {!overallLoading && files.length > 0 && displayableFiles.length === 0 && (
             <section className="w-full md:h-full min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-slate-800 rounded-xl shadow-xl shadow-slate-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-200">No Results to Display</h3>
              <p className="text-slate-400 mt-2 max-w-md text-sm sm:text-base">
                All items in the queue have been handled. Check individual statuses in the left panel or upload new files.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
