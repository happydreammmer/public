
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import { useEffect, useState, useRef, useCallback } from 'react';
import { streamText } from '@/lib/textGeneration';
import { AI_PROMPTS, AiPromptKey } from '@/lib/prompts';
import JSZip from 'jszip';

export const ANALYSIS_TYPES_CONFIG = {
  ESSENTIALS: { id: 'ESSENTIALS', displayName: 'Video Essentials', promptKey: 'ESSENTIALS' as AiPromptKey },
  TRANSCRIPTION: { id: 'TRANSCRIPTION', displayName: 'Video Transcription', promptKey: 'TRANSCRIPTION' as AiPromptKey },
  QUOTES_HIGHLIGHTS: { id: 'QUOTES_HIGHLIGHTS', displayName: 'Quotes & Highlights', promptKey: 'QUOTES_HIGHLIGHTS' as AiPromptKey },
  TOPICS_TIMELINE: { id: 'TOPICS_TIMELINE', displayName: 'Topics & Timeline', promptKey: 'TOPICS_TIMELINE' as AiPromptKey },
  ACTION_ITEMS: { id: 'ACTION_ITEMS', displayName: 'Action Items', promptKey: 'ACTION_ITEMS' as AiPromptKey },
  RECORD_EVENTS: { id: 'RECORD_EVENTS', displayName: 'Record All Events', promptKey: 'RECORD_EVENTS' as AiPromptKey },
} as const;

export type AnalysisTypeId = keyof typeof ANALYSIS_TYPES_CONFIG;

interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  content: string;
  elapsedTime: number | null;
  isCompleted: boolean; // Has successfully completed at least once
  // Removed startTimeRef and intervalRef, managed within runAnalysis scope
}

interface AnalysisResultsDisplayProps {
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  onLoadingStateChange: (videoId: string, isLoadingThisVideo: boolean) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAnalysisDataUpdate: (videoId: string, analysisType: AnalysisTypeId, videoTitle: string, content: string) => void;
}

const initialAnalysisState: AnalysisState = {
  isLoading: false,
  error: null,
  content: '',
  elapsedTime: null,
  isCompleted: false,
};

const ALL_ANALYSIS_TYPE_IDS = Object.keys(ANALYSIS_TYPES_CONFIG) as AnalysisTypeId[];

export default function AnalysisResultsDisplay({
  videoId,
  videoUrl,
  videoTitle,
  onLoadingStateChange,
  isExpanded,
  onToggleExpand,
  onAnalysisDataUpdate,
}: AnalysisResultsDisplayProps) {
  const [analysisStates, setAnalysisStates] = useState<Map<AnalysisTypeId, AnalysisState>>(() => {
    const map = new Map<AnalysisTypeId, AnalysisState>();
    ALL_ANALYSIS_TYPE_IDS.forEach(id => map.set(id, { ...initialAnalysisState }));
    return map;
  });

  const [activeInternalAnalysesCount, setActiveInternalAnalysesCount] = useState(0);
  const isMountedRef = useRef(true);
  const analysisAbortControllersRef = useRef<Map<AnalysisTypeId, AbortController>>(new Map());


  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Abort any ongoing streams when component unmounts or videoUrl changes significantly
      analysisAbortControllersRef.current.forEach(controller => controller.abort());
      analysisAbortControllersRef.current.clear();
    };
  }, []);
  
  // Effect to reset states when videoUrl changes
  useEffect(() => {
    const newMap = new Map<AnalysisTypeId, AnalysisState>();
    ALL_ANALYSIS_TYPE_IDS.forEach(id => newMap.set(id, { ...initialAnalysisState }));
    setAnalysisStates(newMap);
    setActiveInternalAnalysesCount(0);
    onLoadingStateChange(videoId, false); // Ensure loading state is reset for the new video

    // Clear any existing abort controllers for the new video
    analysisAbortControllersRef.current.forEach(controller => controller.abort());
    analysisAbortControllersRef.current.clear();

  }, [videoUrl, videoId, onLoadingStateChange]);


  useEffect(() => {
    onLoadingStateChange(videoId, activeInternalAnalysesCount > 0);
  }, [videoId, activeInternalAnalysesCount, onLoadingStateChange]);


  const runAnalysis = useCallback(async (analysisTypeId: AnalysisTypeId) => {
    if (!isMountedRef.current || !videoUrl) return;

    const config = ANALYSIS_TYPES_CONFIG[analysisTypeId];
    if (!config) return;

    // Abort previous run for this specific analysis type if any
    analysisAbortControllersRef.current.get(analysisTypeId)?.abort();
    const abortController = new AbortController();
    analysisAbortControllersRef.current.set(analysisTypeId, abortController);

    setActiveInternalAnalysesCount(prev => prev + 1);
    setAnalysisStates(prev => {
      const newStates = new Map(prev);
      newStates.set(analysisTypeId, {
        ...initialAnalysisState,
        isLoading: true,
        elapsedTime: 0,
      });
      return newStates;
    });

    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      if (isMountedRef.current) {
        setAnalysisStates(prev => {
          const current = prev.get(analysisTypeId);
          if (current?.isLoading) {
            const newStates = new Map(prev);
            newStates.set(analysisTypeId, {
              ...current,
              elapsedTime: Math.round((Date.now() - startTime) / 1000),
            });
            return newStates;
          }
          return prev;
        });
      }
    }, 1000);

    try {
      const stream = await streamText({
        modelName: 'gemini-2.5-flash',
        prompt: AI_PROMPTS[config.promptKey],
        videoUrl: videoUrl,
        // Pass abortController.signal if streamText supports it (not in current spec)
      });
      
      let currentContent = "";
      for await (const chunk of stream) {
        if (abortController.signal.aborted || !isMountedRef.current) {
          throw new Error('Analysis aborted');
        }
        if (chunk.promptFeedback?.blockReason) {
          throw new Error(`${config.displayName}: Blocked - ${chunk.promptFeedback.blockReason}.`);
        }
        const candidate = chunk.candidates?.[0];
        if (candidate?.finishReason === 'SAFETY') {
          throw new Error(`${config.displayName}: Stopped (Safety).`);
        }
        const textContent = chunk.text;
        if (textContent) {
          currentContent += textContent;
          if (isMountedRef.current) {
            setAnalysisStates(prev => {
              const current = prev.get(analysisTypeId);
              if (current) {
                const newStates = new Map(prev);
                newStates.set(analysisTypeId, { ...current, content: current.content + textContent });
                return newStates;
              }
              return prev;
            });
          }
        }
      }

      if (isMountedRef.current && !abortController.signal.aborted) {
        setAnalysisStates(prev => {
          const current = prev.get(analysisTypeId);
          if (current) {
            const newStates = new Map(prev);
            newStates.set(analysisTypeId, {
              ...current,
              isLoading: false,
              isCompleted: true,
              error: null,
              // content: currentContent, // content is already updated incrementally
              elapsedTime: Math.round((Date.now() - startTime) / 1000),
            });
            return newStates;
          }
          return prev;
        });
        onAnalysisDataUpdate(videoId, analysisTypeId, videoTitle, currentContent);
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message === 'Analysis aborted') {
        console.log(`Analysis ${analysisTypeId} for ${videoUrl} was aborted.`);
         if (isMountedRef.current) {
            setAnalysisStates(prev => {
                const newStates = new Map(prev);
                newStates.set(analysisTypeId, {
                    ...initialAnalysisState, // Reset to initial or keep existing content? For now, reset.
                    error: 'Analysis was cancelled by user.',
                });
                return newStates;
            });
        }
      } else {
        console.error(`Error in ${analysisTypeId} stream for ${videoUrl}:`, err);
        if (isMountedRef.current) {
          setAnalysisStates(prev => {
            const current = prev.get(analysisTypeId);
            if (current) {
              const newStates = new Map(prev);
              newStates.set(analysisTypeId, {
                ...current,
                isLoading: false,
                error: err instanceof Error ? err.message : `Unknown error fetching ${config.displayName}.`,
                isCompleted: false, // Explicitly set to false on error
                elapsedTime: Math.round((Date.now() - startTime) / 1000),
              });
              return newStates;
            }
            return prev;
          });
        }
      }
    } finally {
      clearInterval(timerInterval);
      analysisAbortControllersRef.current.delete(analysisTypeId);
      if (isMountedRef.current) {
        setActiveInternalAnalysesCount(prev => Math.max(0, prev - 1));
         // Final elapsed time update if not set by error/success path already
        setAnalysisStates(prev => {
          const current = prev.get(analysisTypeId);
          if (current && current.isLoading) { // If still loading (e.g. aborted before completion)
            const newStates = new Map(prev);
            newStates.set(analysisTypeId, {
              ...current,
              isLoading: false,
              elapsedTime: Math.round((Date.now() - startTime) / 1000),
            });
            return newStates;
          }
          return prev;
        });
      }
    }
  }, [videoUrl, videoId, videoTitle, onAnalysisDataUpdate]);

  const sanitizeFilename = (name: string) =>
    name.replace(/[^a-z0-9_.-]/gi, '_').substring(0, 100).toLowerCase() || 'content';

  const downloadMarkdown = (analysisId: AnalysisTypeId) => {
    const state = analysisStates.get(analysisId);
    const config = ANALYSIS_TYPES_CONFIG[analysisId];
    if (!state || !state.content || !config) return;

    const safeVideoTitlePart = sanitizeFilename(videoTitle);
    const filenameBase = sanitizeFilename(config.displayName);
    const filename = `${safeVideoTitlePart}_${filenameBase}.md`;

    const blob = new Blob([state.content], { type: 'text/markdown;charset=utf-utf-8;' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', objectUrl);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const safeVideoTitlePart = sanitizeFilename(videoTitle);
    let filesAdded = 0;

    analysisStates.forEach((state, analysisId) => {
      const config = ANALYSIS_TYPES_CONFIG[analysisId];
      if (state.isCompleted && state.content && config) {
        const filenameBase = sanitizeFilename(config.displayName);
        zip.file(`${safeVideoTitlePart}_${filenameBase}.md`, state.content);
        filesAdded++;
      }
    });

    if (filesAdded === 0) {
        alert("No completed analyses with content available to download.");
        return;
    }

    try {
      const blob = await zip.generateAsync({ type: "blob" });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${safeVideoTitlePart}_all_analyses.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error("Error generating ZIP file:", e);
      alert("Failed to generate ZIP file.");
    }
  };

  const renderAnalysisCard = (analysisTypeId: AnalysisTypeId) => {
    const state = analysisStates.get(analysisTypeId);
    const config = ANALYSIS_TYPES_CONFIG[analysisTypeId];
    if (!state || !config) return null;

    // Only render card if it's loading, or has content, or has an error, or has completed (even if content is empty)
    if (!state.isLoading && !state.content && !state.error && !state.isCompleted) {
        return null; // Don't render card for analyses not yet run
    }
    
    const roundedElapsedTime = state.elapsedTime !== null ? Math.round(state.elapsedTime) : null;

    return (
      <div className="analysis-section-card" key={analysisTypeId}>
        <div className="section-header">
          <h3>
            {config.displayName}
            {state.isLoading && roundedElapsedTime !== null && (
              <span className="timer-text loading">(generating for {roundedElapsedTime}s...)</span>
            )}
            {!state.isLoading && state.isCompleted && !state.error && roundedElapsedTime !== null && (
              <span className="timer-text completed">(done in {roundedElapsedTime}s)</span>
            )}
             {!state.isLoading && !state.isCompleted && state.error && roundedElapsedTime !== null && (
              <span className="timer-text error">(failed after {roundedElapsedTime}s)</span>
            )}
          </h3>
          {state.isCompleted && state.content && !state.isLoading && !state.error && (
            <button
              onClick={() => downloadMarkdown(analysisTypeId)}
              className="button-secondary download-button"
              aria-label={`Download ${config.displayName} as Markdown`}
              title={`Download ${config.displayName} as Markdown`}
            >
              <span className="material-symbols-outlined">download</span> MD
            </button>
          )}
        </div>
        {state.isLoading && !state.content && !state.error && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading {config.displayName.toLowerCase()}...</p>
          </div>
        )}
        {state.error && (
          <div className="error-message">
            <span className="material-symbols-outlined error-icon">error</span>
            <div>
              <strong>Error loading {config.displayName.toLowerCase()}:</strong>
              <p>{state.error}</p>
            </div>
          </div>
        )}
        {((state.isCompleted && !state.error) || state.content) && ( // Show content if completed without error, or if there's any content (even during loading)
          <pre className="results-content" aria-label={`${config.displayName} results`}>{state.content || (state.isLoading ? ' ' : '')}</pre>
        )}
        {!state.isLoading && state.isCompleted && !state.error && !state.content && (
           <div className="no-content">No content was generated for {config.displayName.toLowerCase()}.</div>
        )}
      </div>
    );
  };
  
  const itemTitleId = `video-title-${videoId}`;
  const isAnyAnalysisCompleted = Array.from(analysisStates.values()).some(s => s.isCompleted && s.content);
  const isAnyAnalysisRunningForThisVideo = activeInternalAnalysesCount > 0;

  return (
    <div className="analysis-results-display-item" role="region" aria-labelledby={itemTitleId}>
      <h2 className="video-item-title-button" id={itemTitleId} onClick={onToggleExpand} aria-expanded={isExpanded} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onToggleExpand()}>
        <span className={`material-symbols-outlined chevron-icon ${isExpanded ? 'expanded' : ''}`}>chevron_right</span>
        <span className="video-title-text" title={videoTitle}>{videoTitle}</span>
        {isAnyAnalysisCompleted && (
            <button
                onClick={(e) => { e.stopPropagation(); handleDownloadZip(); }}
                className="button-secondary download-zip-button"
                title="Download All Completed Analyses as ZIP"
                aria-label="Download all completed analyses as ZIP file"
                disabled={isAnyAnalysisRunningForThisVideo}
            >
                <span className="material-symbols-outlined">archive</span> ZIP
            </button>
        )}
         {isAnyAnalysisRunningForThisVideo && <div className="title-loading-spinner"></div>}
      </h2>
      {isExpanded && (
        <div className="analysis-content-wrapper">
          <div className="analysis-actions-toolbar">
            {ALL_ANALYSIS_TYPE_IDS.map(analysisTypeId => {
              const config = ANALYSIS_TYPES_CONFIG[analysisTypeId];
              const state = analysisStates.get(analysisTypeId);
              const isLoadingThisType = state?.isLoading || false;
              return (
                <button
                  key={analysisTypeId}
                  onClick={() => runAnalysis(analysisTypeId)}
                  className={`button-secondary analysis-action-button ${state?.isCompleted ? 'completed' : ''} ${isLoadingThisType ? 'loading' : ''}`}
                  disabled={isLoadingThisType || isAnyAnalysisRunningForThisVideo && !isLoadingThisType} // Disable other buttons if one is running
                  title={isLoadingThisType ? `Generating ${config.displayName}...` : (state?.isCompleted ? `${config.displayName} (Completed)` : `Run ${config.displayName}`)}
                >
                  {isLoadingThisType && <span className="button-spinner material-symbols-outlined">progress_activity</span>}
                  {!isLoadingThisType && state?.isCompleted && <span className="button-check material-symbols-outlined">check_circle</span>}
                  {config.displayName}
                </button>
              );
            })}
          </div>
          <div className="analysis-cards-container">
            {ALL_ANALYSIS_TYPE_IDS.map(analysisTypeId => renderAnalysisCard(analysisTypeId))}
          </div>
        </div>
      )}
      <style>{`
        .analysis-results-display-item {
          padding: 0; 
          background-color: var(--color-component-background); 
          border-radius: 8px; 
          border: 1px solid var(--color-component-border);
          box-shadow: 0 1px 3px rgba(0,0,0,0.15); 
          display: flex; 
          flex-direction: column;
          min-height: 0; 
          overflow: hidden; 
        }
        .video-item-title-button {
          font-size: clamp(1.1rem, 2vw, 1.3rem); 
          color: var(--color-accent); 
          margin: 0;
          padding: clamp(0.6rem, 1.2vw, 0.8rem) clamp(0.75rem, 1.5vw, 1rem);
          border-bottom: ${isExpanded ? '1px solid var(--color-component-border)' : 'none'};
          font-weight: 500; 
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem; 
          transition: background-color 0.2s;
        }
        .video-item-title-button:hover, .video-item-title-button:focus {
          background-color: rgba(100, 255, 218, 0.05); 
          outline: none;
        }
        .video-title-text {
          flex-grow: 1; 
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0; 
        }
        .chevron-icon {
          transition: transform 0.2s ease-in-out;
          font-size: 1.8rem;
          color: var(--color-accent);
          flex-shrink: 0;
        }
        .chevron-icon.expanded {
          transform: rotate(90deg);
        }
        .download-zip-button {
          padding: 0.3rem 0.6rem; 
          line-height: 1;
          margin-left: 0.5rem; 
          flex-shrink: 0;
          border-color: transparent;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .download-zip-button .material-symbols-outlined {
           font-size: 1.2rem;
        }
        .download-zip-button:hover:not(:disabled) {
            background-color: rgba(100, 255, 218, 0.15);
            border-color: transparent;
        }

        .title-loading-spinner {
          width: 18px; 
          height: 18px;
          border: 2px solid var(--color-accent-hover);
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-left: 0.75rem; 
          flex-shrink: 0; 
        }

        .analysis-content-wrapper {
          display: flex;
          flex-direction: column;
          gap: clamp(0.75rem, 1.2vw, 1rem); 
          min-height: 0; /* Important for nested flex */
          flex-grow: 1; /* Allow this wrapper to grow if its parent (.analysis-results-display-item) has space */
          padding: clamp(0.75rem, 1.5vw, 1rem);
          overflow: hidden; /* Prevent content wrapper itself from scrolling, defer to cards-container */
        }

        .analysis-actions-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem; /* This gap applies between buttons */
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-component-border);
          margin-bottom: 0.5rem; 
          flex-shrink: 0; /* Toolbar should not shrink */
        }
        .analysis-action-button {
          font-size: clamp(0.8rem, 1.6vw, 0.85rem);
          padding: 0.4rem 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          flex-grow: 1; /* Allow buttons to grow and fill space */
          flex-basis: calc((100% - 1rem) / 3); /* For 3 buttons per row (100% - 2 * 0.5rem gap) / 3 */
          min-width: 120px; /* Prevent buttons from becoming too small */
        }
        .analysis-action-button .material-symbols-outlined {
          font-size: 1.1rem;
        }
        .analysis-action-button.completed {
          border-color: var(--color-accent-secondary);
          color: var(--color-accent-secondary);
        }
        .analysis-action-button.completed:hover:not(:disabled) {
           background-color: rgba(66, 133, 244, 0.1);
        }
        .analysis-action-button .button-spinner {
          animation: spin 1s linear infinite;
        }

        .analysis-cards-container {
            display: flex;
            flex-direction: column;
            gap: 0.75rem; 
            overflow-y: auto; 
            flex-grow: 1; /* Key change: allow this container to grow */
            min-height: 0; /* Key change: allow shrinking and proper flex participation */
            /* max-height: calc(100vh - 300px); /* REMOVED */
        }

        .analysis-section-card { 
          border: 1px solid var(--color-component-border); 
          border-radius: 6px;
          padding: clamp(0.6rem, 1.2vw, 0.8rem); 
          background-color: var(--color-background); 
          display: flex; 
          flex-direction: column; 
          min-height: 0; /* Allow card to shrink if content is small, helps with overall layout */
          flex-shrink: 0; /* Prevent cards from shrinking if container has space, they should take their content size */
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem; 
          flex-shrink: 0; 
        }
        .section-header h3 {
          font-size: clamp(1rem, 1.8vw, 1.15rem); 
          color: var(--color-headline);
          margin: 0;
          font-weight: 500; 
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .timer-text {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--color-subtitle);
          font-style: italic;
        }
        .timer-text.loading {
          color: var(--color-accent-secondary);
        }
        .timer-text.completed {
          color: var(--color-subtitle);
        }
        .timer-text.error {
          color: var(--color-error);
        }

        .download-button {
          display: inline-flex; 
          align-items: center;
          gap: 0.4rem; 
          font-size: clamp(0.8rem, 1.5vw, 0.9rem); 
          padding: 0.4rem 0.6rem; 
        }
        .download-button .material-symbols-outlined { 
          font-size: clamp(1rem, 1.8vw, 1.1rem); 
        }
        .material-symbols-outlined { 
          font-family: 'Google Symbols';
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20; 
          font-size: 1.1rem; 
          vertical-align: middle; 
          line-height: 1; 
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1rem; 
          color: var(--color-subtitle);
          min-height: 80px; 
        }
        .loading-spinner {
          animation: spin 1s linear infinite; 
          border: 4px solid var(--color-component-border); 
          border-radius: 50%;
          border-top-color: var(--color-accent); 
          height: 32px; 
          width: 32px;
          margin-bottom: 0.8rem; 
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .error-message {
          color: #FFAB91; 
          background-color: #4E342E; 
          border: 1px solid #D84315; 
          border-radius: 6px; 
          padding: 0.8rem; 
          display: flex; 
          align-items: flex-start; 
          gap: 0.75rem; 
          font-size: clamp(0.85rem, 1.6vw, 0.9rem); 
          margin-top: 0.5rem;
        }
        .error-message .error-icon {
          font-size: 1.5rem; 
          color: #FF8A65; 
          margin-top: 2px; 
        }
        .error-message strong {
          display: block;
          margin-bottom: 0.25rem;
          color: #FFFFFF;
        }
        .error-message p {
            margin: 0;
            line-height: 1.5;
        }
        .results-content {
          white-space: pre-wrap; 
          word-wrap: break-word;
          font-family: var(--font-technical);
          font-size: clamp(0.8rem, 1.5vw, 0.85rem); 
          line-height: 1.6; 
          padding: clamp(0.6rem, 1vw, 0.8rem); 
          background-color: #0E2038; 
          border-radius: 4px;
          max-height: 250px; /* Individual result content can scroll */
          overflow-y: auto;
          color: var(--color-text);
          scrollbar-width: thin;
          scrollbar-color: var(--color-subtitle) var(--color-background);
          border: 1px solid var(--color-component-border); 
          min-height: 50px; 
          flex-grow: 0; /* Don't let pre itself grow if card can grow */
          flex-shrink: 1; /* Allow pre to shrink if card forces it */
        }
        .results-content::-webkit-scrollbar {
          width: 8px; 
        }
        .results-content::-webkit-scrollbar-thumb {
          background-color: var(--color-subtitle) ;
          border-radius: 4px;
        }
         .results-content::-webkit-scrollbar-track {
          background: #0E2038; 
        }
        .no-content {
          color: var(--color-subtitle);
          padding: 1rem 0.8rem; 
          text-align: center;
          font-style: italic;
          background-color: var(--color-background);
          border-radius: 4px;
          border: 1px dashed var(--color-component-border);
          font-size: clamp(0.85rem, 1.6vw, 0.9rem);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
        }
      `}</style>
    </div>
  );
}
