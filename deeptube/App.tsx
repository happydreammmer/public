

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import AnalysisResultsDisplay, { AnalysisTypeId } from '@/components/AnalysisResultsDisplay';
import ChatBar from '@/components/ChatBar'; 
import {
  getYoutubeEmbedUrl,
  validateYoutubeUrl,
  getYouTubeVideoId,
  getYouTubeVideoTitle, 
} from '@/lib/youtube';
import {useRef, useState, useEffect, useCallback} from 'react';
import { getApiKey, saveApiKey, clearApiKey } from '@/lib/apiKey';
import './index.css';

const VALIDATE_INPUT_URL = true;

interface AnalyzedUrl {
  id: string; 
  url: string;
  title: string; 
}

// VideoID -> AnalysisTypeID -> { title (video), content (analysis) }
export type CompletedAnalysesDataType = Map<string, Map<AnalysisTypeId, { title: string, content: string }>>;


export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [analysisUrls, setAnalysisUrls] = useState<AnalyzedUrl[]>([]);
  const [displayVideoUrl, setDisplayVideoUrl] = useState<string | null>(null);

  const [urlValidating, setUrlValidating] = useState(false);
  const [isAnalyzingGlobal, setIsAnalyzingGlobal] = useState(false); 
  const [activeGlobalAnalysesCount, setActiveGlobalAnalysesCount] = useState(0); 

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [loadingVideoIds, setLoadingVideoIds] = useState<Set<string>>(new Set());


  // State for accordion and chat
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<string | null>(null);
  const [completedAnalysesData, setCompletedAnalysesData] = useState<CompletedAnalysesDataType>(new Map());
  const [chatBarHeight, setChatBarHeight] = useState(0);


  useEffect(() => {
    const existingKey = getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  useEffect(() => {
    setIsAnalyzingGlobal(loadingVideoIds.size > 0);
    setActiveGlobalAnalysesCount(loadingVideoIds.size);
  }, [loadingVideoIds]);


  const handleSubmit = async () => {
    const inputValue = textareaRef.current?.value.trim() || '';
    if (!inputValue) {
      textareaRef.current?.focus();
      return;
    }
    if (urlValidating || isAnalyzingGlobal) return;

    setUrlValidating(true);
    setLoadingVideoIds(new Set()); 
    setAnalysisUrls([]); 
    setDisplayVideoUrl(null);
    setExpandedAnalysisId(null); 
    setCompletedAnalysesData(new Map()); 

    const urls = inputValue
      .split(/[\n,]+/)
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);

    if (urls.length === 0) {
      alert('Please enter at least one YouTube URL.');
      setUrlValidating(false);
      return;
    }
    
    const validationPromises = urls.map(async (url: string) => {
      const videoId = getYouTubeVideoId(url) || `temp-id-${url}-${Math.random().toString(36).substring(2, 9)}`;
      let displayTitle = url; 

      if (!VALIDATE_INPUT_URL) {
         try {
            const fetchedTitle = await getYouTubeVideoTitle(url);
            displayTitle = fetchedTitle;
          } catch (titleError) {
            console.warn(`Could not fetch title for ${url}:`, titleError);
            try {
              const parsed = new URL(url);
              displayTitle = `Video from ${parsed.hostname}`;
            } catch { /* use full url if not parsable */ }
          }
        return { id: videoId, url, isValid: true, title: displayTitle };
      }

      try {
        const validationResult = await validateYoutubeUrl(url);
        if (validationResult.isValid) {
            try {
                const fetchedTitle = await getYouTubeVideoTitle(url);
                displayTitle = fetchedTitle;
            } catch (titleError) {
                console.warn(`Could not fetch title for ${url}:`, titleError);
                 try {
                  const parsed = new URL(url);
                  displayTitle = `Video from ${parsed.hostname}`;
                } catch { /* use full url if not parsable */ }
            }
        } else {
            displayTitle = url;
        }
        return { id: videoId, url, isValid: validationResult.isValid, error: validationResult.error, title: displayTitle };
      } catch (error) {
        return { id: videoId, url, isValid: false, error: 'Validation failed', title: url };
      }
    });

    const validationResults = await Promise.all(validationPromises);
    
    const validUrls: AnalyzedUrl[] = [];
    const invalidUrlMessages: string[] = [];

    validationResults.forEach((result) => {
      if (result.isValid) {
        validUrls.push({ id: result.id, url: result.url, title: result.title });
      } else {
        invalidUrlMessages.push(`Invalid URL: ${result.url} (${result.error || 'Unknown reason'})`);
      }
    });

    if (invalidUrlMessages.length > 0) {
      alert(`Some URLs were invalid:\n${invalidUrlMessages.join('\n')}`);
    }

    if (validUrls.length > 0) {
      setDisplayVideoUrl(validUrls[0].url); 
      setAnalysisUrls(validUrls);
      setExpandedAnalysisId(validUrls[0].id);
    }
    setUrlValidating(false);
  };

  const handleSingleVideoLoadingStateChange = useCallback((videoId: string, isLoadingThisVideo: boolean) => {
    setLoadingVideoIds((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (isLoadingThisVideo) {
        newSet.add(videoId);
      } else {
        newSet.delete(videoId);
      }
      return newSet;
    });
  }, []);

  const handleToggleExpand = (analysisId: string) => {
    setExpandedAnalysisId((prevId: string | null) => {
        const newExpandedId = prevId === analysisId ? null : analysisId;
        if (newExpandedId) {
            const newExpandedVideo = analysisUrls.find((v: AnalyzedUrl) => v.id === newExpandedId);
            if (newExpandedVideo) {
                setDisplayVideoUrl(newExpandedVideo.url);
            }
        }
        return newExpandedId;
    });
  };

  const handleAnalysisDataUpdate = useCallback((videoId: string, analysisType: AnalysisTypeId, videoTitle: string, content: string) => {
    setCompletedAnalysesData((prevOuterMap: CompletedAnalysesDataType) => {
      const newOuterMap = new Map(prevOuterMap);
      const prevVideoAnalyses = newOuterMap.get(videoId);
      // Ensure the inner map is also new for reference change detection
      const newVideoAnalyses = prevVideoAnalyses 
        ? new Map(prevVideoAnalyses) 
        : new Map<AnalysisTypeId, { title: string, content: string }>();
      
      newVideoAnalyses.set(analysisType, { title: videoTitle, content });
      newOuterMap.set(videoId, newVideoAnalyses);
      return newOuterMap;
    });
  }, []);


  const handleChatBarHeightChange = useCallback((height: number) => {
    setChatBarHeight(height);
  }, []);

  let currentVideoAnalysesForChat: Map<AnalysisTypeId, { title: string, content: string }> | null = null;
  let activeChatVideoTitle: string | null = null;

  if (expandedAnalysisId) {
    currentVideoAnalysesForChat = completedAnalysesData.get(expandedAnalysisId) || null;
    activeChatVideoTitle = analysisUrls.find((v: AnalyzedUrl) => v.id === expandedAnalysisId)?.title || 'Selected Video';
  }

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setApiKey(null);
    setApiKeyInput('');
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
          className="api-key-input"
        />
        <button onClick={handleSaveApiKey} className="button-primary">Save Key</button>
      </div>
    );
  }

  return (
    <>
      <div className="api-key-header">
        <span>API Key is set.</span>
        <button onClick={handleClearApiKey} className="button-secondary">Clear API Key</button>
      </div>
      <main className="main-container">
        <div className="left-side">
          <h1 className="headline">DeepTube</h1>
          <div className="input-container">
            <label htmlFor="youtube-urls" className="input-label">
              Paste YouTube URL(s) (one per line or comma-separated):
            </label>
            <textarea
              ref={textareaRef}
              id="youtube-urls"
              className="youtube-input"
              placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              rows={3} 
              disabled={urlValidating || isAnalyzingGlobal}
              onChange={() => {
                 // User starts typing new URLs, consider resetting
                 // This UX can be disruptive if they are just editing, so commented out for now.
                 // if (analysisUrls.length > 0) {
                 //   setAnalysisUrls([]); 
                 //   setDisplayVideoUrl(null);
                 //   setLoadingVideoIds(new Set());
                 //   setExpandedAnalysisId(null);
                 //   setCompletedAnalysesData(new Map());
                 // }
              }}
            />
          </div>

          <div className="button-container">
            <button
              onClick={handleSubmit}
              className="button-primary submit-button"
              disabled={urlValidating || isAnalyzingGlobal}
              aria-live="polite" 
            >
              {urlValidating
                ? 'Validating URLs...'
                : isAnalyzingGlobal
                  ? `Analyzing (${activeGlobalAnalysesCount} video${activeGlobalAnalysesCount === 1 ? '' : 's'})...`
                  : 'Load Video(s) for Analysis'}
            </button>
          </div>

          <div className="video-container">
            {displayVideoUrl ? (
              <iframe
                className="video-iframe"
                src={getYoutubeEmbedUrl(displayVideoUrl)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
            ) : (
              <div className="video-placeholder">
                <span className="material-symbols-outlined placeholder-icon">movie</span>
                <span>Video Player</span>
              </div>
            )}
          </div>
        </div>

        <div className="right-side" style={{ paddingBottom: chatBarHeight > 0 && expandedAnalysisId ? `${chatBarHeight}px` : '0' }}>
          <div className="content-area">
            {analysisUrls.length > 0 ? (
              analysisUrls.map((analyzedUrl) => (
                <AnalysisResultsDisplay
                  key={analyzedUrl.id}
                  videoId={analyzedUrl.id} 
                  videoUrl={analyzedUrl.url}
                  videoTitle={analyzedUrl.title} 
                  onLoadingStateChange={handleSingleVideoLoadingStateChange}
                  isExpanded={expandedAnalysisId === analyzedUrl.id}
                  onToggleExpand={() => handleToggleExpand(analyzedUrl.id)}
                  onAnalysisDataUpdate={handleAnalysisDataUpdate}
                />
              ))
            ) : (
              <div className="content-placeholder">
                 <span className="material-symbols-outlined placeholder-icon large-icon">insights</span>
                <p>
                  {urlValidating
                    ? 'Validating URL(s)...'
                    : isAnalyzingGlobal 
                      ? 'Loading videos...'
                      : 'Paste YouTube URL(s) and click "Load Video(s)" to begin!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <ChatBar
        isVisible={!!expandedAnalysisId} 
        videoTitle={activeChatVideoTitle}
        allCompletedAnalysesForVideo={currentVideoAnalysesForChat}
        onChatBarHeightChange={handleChatBarHeightChange}
        isContextRequired={true} 
      />

      <style>{`
        .main-container {
          padding: clamp(1rem, 2vw, 2rem); 
          display: flex;
          gap: clamp(1rem, 2vw, 2rem); 
          height: 100vh;
          box-sizing: border-box;
          overflow: hidden;
          background-color: var(--color-background);

          @media (max-width: 900px) { 
            flex-direction: column;
            height: auto;
            overflow: visible;
            gap: 1rem;
          }
        }

        .left-side {
          width: 40%;
          min-width: 300px; 
          height: 100%; 
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 2vw, 1.5rem); 
          overflow: hidden;

          @media (max-width: 900px) { 
            width: 100%;
            height: auto; 
            overflow: visible; 
            min-width: unset;
            gap: 1rem;
          }
        }



        .right-side {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0; 
          gap: 1rem;
          height: 100%;
          overflow: hidden; 
          transition: padding-bottom 0.3s ease-in-out;


          @media (max-width: 900px) { 
            height: auto; 
            min-height: 400px; 
          }
        }

        .headline {
          color: var(--color-headline);
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 4vw, 2.5rem); 
          font-weight: 400;
          line-height: 1.1;
          margin-top: 0.5rem;
          margin-bottom: 0; 
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1px; 
          flex-shrink: 0;

          @media (max-width: 768px) {
            margin-top: 0;
            font-size: clamp(1.25rem, 3vw, 2rem);
          }
        }

        .input-container {
          width: 100%;
          flex-shrink: 0;
        }

        .input-label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--color-text);
          font-size: clamp(0.85rem, 1.8vw, 0.95rem); 
        }

        .youtube-input {
          width: 100%;
          font-size: clamp(0.9rem, 1.8vw, 1rem); 
          min-height: 50px; 
          max-height: 80px;
        }

        .button-container {
          width: 100%;
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .submit-button {
          flex: 1;
          padding: clamp(0.6rem, 2vw, 0.75rem) 1rem; 
          font-size: clamp(0.95rem, 2vw, 1.05rem); 
          font-weight: 500; 
        }

        .video-container {
          background-color: var(--color-video-container-background);
          border-radius: 8px;
          color: var(--color-video-placeholder-text);
          padding-top: 56.25%; 
          position: relative;
          width: 100%;
          border: 1px solid var(--color-component-border);
          overflow: hidden; 
          flex: 1 1 auto;
          min-height: 0; 
          max-height: calc(100vh - 400px);
          box-sizing: border-box;

          @media (max-width: 900px) {
            max-height: 300px;
            min-height: 200px;
          }
        }

        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 8px; 
        }

        .video-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column; 
          align-items: center;
          justify-content: center;
          font-size: clamp(0.9rem, 1.8vw, 1rem);
          color: var(--color-video-placeholder-text);
          gap: 0.5rem; 
        }
        
        .placeholder-icon {
          font-size: 2rem; 
          color: var(--color-subtitle);
        }
        .placeholder-icon.large-icon {
          font-size: 3rem;
        }


        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column; 
          gap: 1rem; 
          border: 1px solid var(--color-component-border);
          border-radius: 8px;
          overflow-y: auto; 
          padding: 1rem; 
          background-color: var(--color-background); 
          scrollbar-width: thin;
          scrollbar-color: var(--color-subtitle) var(--color-background);

          @media (max-width: 900px) { 
            min-height: 300px; 
          }
        }
        
        .content-area::-webkit-scrollbar {
          width: 8px;
        }
        .content-area::-webkit-scrollbar-track {
          background: var(--color-background);
        }
        .content-area::-webkit-scrollbar-thumb {
          background-color: var(--color-subtitle) ;
          border-radius: 4px;
        }

        .content-placeholder {
          align-items: center;
          border: 2px dashed var(--color-content-placeholder-border);
          border-radius: 8px;
          box-sizing: border-box;
          color: var(--color-content-placeholder-text);
          display: flex;
          flex-direction: column; 
          font-size: clamp(1rem, 2vw, 1.1rem); 
          height: 100%;
          justify-content: center;
          padding: 2rem; 
          width: 100%;
          text-align: center;
          gap: 1rem; 

           @media (max-width: 768px) {
            min-height: 200px; 
          }
        }

        .api-key-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: var(--color-background);
          color: var(--color-text);
          padding: 2rem;
        }

        .api-key-container h1 {
          color: var(--color-headline);
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .api-key-container p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .api-key-container input {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 1px solid var(--color-component-border);
          border-radius: 8px;
          background-color: var(--color-input-background);
          color: var(--color-text);
          margin-bottom: 1rem;
        }

        .api-key-container button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          background-color: var(--color-button-primary);
          color: var(--color-button-text);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .api-key-container button:hover {
          background-color: var(--color-button-primary-hover);
        }

        .api-key-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: var(--color-header-background);
          border-bottom: 1px solid var(--color-component-border);
          color: var(--color-text);
        }

        .api-key-header p {
          font-size: 0.9rem;
          margin: 0;
        }

        .api-key-header button {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          background-color: var(--color-button-secondary);
          color: var(--color-button-text);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .api-key-header button:hover {
          background-color: var(--color-button-secondary-hover);
        }
      `}</style>
    </>
  );
}