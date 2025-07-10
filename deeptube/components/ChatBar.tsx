

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import { useState, useEffect, useRef, FormEvent, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import { Chat } from '@google/genai';
import { startVideoChatSession, sendMessageInSession } from '@/lib/chatService';
import { AnalysisTypeId, ANALYSIS_TYPES_CONFIG } from '@/components/AnalysisResultsDisplay';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
}

interface ChatBarProps {
  isVisible: boolean;
  videoTitle: string | null;
  allCompletedAnalysesForVideo: Map<AnalysisTypeId, { title: string; content: string; }> | null;
  onChatBarHeightChange: (height: number) => void;
  isContextRequired?: boolean;
}

const DEFAULT_EXPANDED_CHAT_HEIGHT = 350;
const MIN_CHAT_HEIGHT = 150;
const COLLAPSED_CHAT_HEIGHT = 48; // Standard height of the toggle button

export default function ChatBar({
  isVisible,
  videoTitle,
  allCompletedAnalysesForVideo,
  onChatBarHeightChange,
  isContextRequired = false,
}: ChatBarProps) {
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true); 
  const [showContextMissingMessage, setShowContextMissingMessage] = useState(false);

  const [chatHeight, setChatHeight] = useState(DEFAULT_EXPANDED_CHAT_HEIGHT);
  const [isResizing, setIsResizing] = useState(false); // State to indicate active resizing
  const resizeStartYRef = useRef<number>(0);
  const initialHeightRef = useRef<number>(0);

  const chatBarRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    // Update parent about height changes (for layout padding)
    const currentHeight = isExpanded ? chatHeight : COLLAPSED_CHAT_HEIGHT;
    onChatBarHeightChange(isVisible ? currentHeight : 0);
  }, [isVisible, isExpanded, chatHeight, onChatBarHeightChange]);

  useEffect(() => {
    const contextAvailable = allCompletedAnalysesForVideo && allCompletedAnalysesForVideo.size > 0;
    setShowContextMissingMessage(isContextRequired && !contextAvailable);

    if (isVisible && contextAvailable) {
      setIsInitializingChat(true);
      setError(null);
      setChatInstance(null); 

      const initChat = async () => {
        try {
          const newChat = startVideoChatSession(allCompletedAnalysesForVideo!); 
          setChatInstance(newChat);
          
          const loadedAnalysesNames = Array.from(allCompletedAnalysesForVideo!.keys())
            .map(id => ANALYSIS_TYPES_CONFIG[id]?.displayName || id)
            .join(', ');
          
          setMessages(prev => {
            // Replace previous init message if it exists, otherwise keep chat history and add new init message
            const existingMessages = prev.length > 0 && prev[0].id.startsWith('system-init-') ? prev.slice(1) : prev;
            return [
              {
                id: `system-init-${videoTitle || 'video'}-${Date.now()}`, // More unique ID
                sender: 'system',
                text: `Ready to chat about: "${videoTitle || 'the current video'}". Context from: ${loadedAnalysesNames || 'available analyses'} loaded.`,
              },
              ...existingMessages
            ];
          });

        } catch (e) {
          console.error("Failed to initialize chat:", e);
          const errorMsg = e instanceof Error ? e.message : 'Failed to start chat session.';
          setError(errorMsg);
          setMessages([ 
            {
              id: `system-err-${Date.now()}`,
              sender: 'system',
              text: `Error initializing chat: ${errorMsg}`,
            },
          ]);
        } finally {
          setIsInitializingChat(false);
          setIsLoading(false); 
        }
      };
      initChat();
    } else if (isVisible && !contextAvailable && isContextRequired) {
        setChatInstance(null);
        setUserInput('');
        setIsInitializingChat(false);
    } else if (!isVisible) {
      setChatInstance(null);
      setUserInput('');
      setIsInitializingChat(false);
    }
  }, [isVisible, allCompletedAnalysesForVideo, videoTitle, isContextRequired]);

  useEffect(() => {
    if (isExpanded) { 
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);
  
  useEffect(() => {
    if (isVisible && isExpanded && inputRef.current && !isInitializingChat && !isLoading && !showContextMissingMessage) { 
      inputRef.current.focus();
    }
  }, [isVisible, isExpanded, isInitializingChat, messages, isLoading, showContextMissingMessage]); 

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chatInstance || isLoading || isInitializingChat || showContextMissingMessage) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userInput.trim(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessageInSession(chatInstance, newUserMessage.text);
      const aiResponseText = response.text;
      if (aiResponseText) {
        setMessages((prev) => [
          ...prev,
          { id: `ai-${Date.now()}`, sender: 'ai', text: aiResponseText },
        ]);
      } else {
         setError('Received an empty response from AI.');
         setMessages((prev) => [...prev, {id: `system-empty-${Date.now()}`, sender: 'system', text: 'AI did not provide a response.'}]);
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response.';
      setError(errorMessage);
      setMessages((prev) => [...prev, {id: `system-err-${Date.now()}`, sender: 'system', text: `Error: ${errorMessage}`}]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Resizing Logic ---
  const handleMouseMoveForResize = useCallback((e: globalThis.MouseEvent) => {
    // This function is stable as its dependencies (refs, setChatHeight) are stable.
    const deltaY = e.clientY - resizeStartYRef.current;
    let newHeight = initialHeightRef.current - deltaY; 

    const maxChatHeight = window.innerHeight * 0.8;
    newHeight = Math.max(MIN_CHAT_HEIGHT, Math.min(newHeight, maxChatHeight));
    setChatHeight(newHeight);
  }, [setChatHeight /* resizeStartYRef, initialHeightRef are refs */]);

  const handleMouseUpForResize = useCallback(() => {
    setIsResizing(false); // This will trigger re-render and effect cleanup if needed
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMoveForResize);
    document.removeEventListener('mouseup', handleMouseUpForResize); // Pass itself
  }, [setIsResizing, handleMouseMoveForResize /* handleMouseUpForResize doesn't need to be dep for itself */]);


  const handleMouseDownOnDragHandle = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (!isExpanded) return; 
    e.preventDefault();
    setIsResizing(true);
    resizeStartYRef.current = e.clientY;
    initialHeightRef.current = chatHeight;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    
    // Add the stable listener references
    document.addEventListener('mousemove', handleMouseMoveForResize);
    document.addEventListener('mouseup', handleMouseUpForResize);
  };

  // Effect for cleaning up global listeners if component unmounts or resizing stops
  useEffect(() => {
    if (!isResizing) { // If resizing stopped (via handleMouseUpForResize)
        document.removeEventListener('mousemove', handleMouseMoveForResize);
        document.removeEventListener('mouseup', handleMouseUpForResize);
        // Reset body styles potentially, though handleMouseUpForResize should do it
        if (document.body.style.cursor === 'ns-resize') document.body.style.cursor = '';
        if (document.body.style.userSelect === 'none') document.body.style.userSelect = '';
    }
    // Cleanup function for when the component unmounts or isResizing changes from true to false
    return () => {
      // This cleanup runs if isResizing was true and then changes, or on unmount
        document.removeEventListener('mousemove', handleMouseMoveForResize);
        document.removeEventListener('mouseup', handleMouseUpForResize);
        // Ensure styles are reset if unmounting during resize
        if (document.body.style.cursor === 'ns-resize') document.body.style.cursor = '';
        if (document.body.style.userSelect === 'none') document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMoveForResize, handleMouseUpForResize]);
  // --- End Resizing Logic ---


  if (!isVisible) {
    return null;
  }
  
  const contextMissingMessageText = `Please run at least one analysis for "${videoTitle || 'this video'}" to enable chat.`;

  return (
    <div 
      ref={chatBarRef} 
      className={`chat-bar ${isExpanded ? 'expanded' : 'collapsed'}`} 
      style={{ height: isExpanded ? `${chatHeight}px` : `${COLLAPSED_CHAT_HEIGHT}px` }}
      role="complementary" 
      aria-label="Chat with AI about the video"
    >
      <button 
        className="chat-toggle-button" 
        onClick={() => setIsExpanded(!isExpanded)} 
        onMouseDown={handleMouseDownOnDragHandle}
        aria-expanded={isExpanded}
        aria-controls="chat-content-wrapper"
        title={isExpanded ? "Collapse Chat / Drag to resize" : "Expand Chat"}
      >
        <span className="material-symbols-outlined toggle-icon">
          {isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
        </span>
        <span className="toggle-text">
          {isExpanded ? `Chat: ${videoTitle || 'Video'}` : `Chat about ${videoTitle || 'Video'}`}
           {showContextMissingMessage && isExpanded && ` (Analysis needed)`}
        </span>
      </button>
      
      <div id="chat-content-wrapper" className="chat-content-wrapper">
        {isInitializingChat && (
          <div className="chat-status-display">
            <div className="loading-spinner"></div>
            <p>Preparing chat for "{videoTitle || 'selected video'}"...</p>
          </div>
        )}
        {showContextMissingMessage && !isInitializingChat && (
            <div className="chat-status-display">
                 <span className="material-symbols-outlined status-icon">info</span>
                <p>{contextMissingMessageText}</p>
            </div>
        )}
        {!isInitializingChat && !showContextMissingMessage && (
          <>
            <div className="chat-messages-area">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
              {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
                <div className="chat-message ai">
                  <p><span className="typing-indicator">AI is typing...</span></p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {error && !isLoading && <p className="chat-error-display">Error: {error}</p>}
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={!chatInstance || isLoading || isInitializingChat || showContextMissingMessage}
                aria-label="Your question"
              />
              <button 
                type="submit" 
                className="button-primary send-button" 
                disabled={!chatInstance || isLoading || isInitializingChat || !userInput.trim() || showContextMissingMessage}
                aria-label={isLoading ? "Waiting for AI response" : "Send message"}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </>
        )}
      </div>
      <style>{`
        .chat-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: var(--color-component-background);
          border-top: 2px solid var(--color-accent);
          box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.25);
          z-index: 1000;
          color: var(--color-text);
          display: flex;
          flex-direction: column;
          transition: opacity 0.3s ease-in-out; 
          overflow: hidden; 
        }
        .chat-bar.expanded {
          /* height is set by inline style */
          /* transition: height 0.1s linear; /* Fast transition for resize, or none if preferred */
        }
        .chat-bar.collapsed {
          /* height is set by inline style */
        }

        .chat-toggle-button {
          background-color: var(--color-component-background);
          color: var(--color-accent); 
          border: none;
          border-bottom: 1px solid ${isExpanded ? 'var(--color-component-border)' : 'transparent'};
          padding: 0 1rem;
          width: 100%;
          height: ${COLLAPSED_CHAT_HEIGHT}px;
          text-align: left;
          cursor: ${isExpanded ? 'ns-resize' : 'pointer'}; 
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-secondary);
          flex-shrink: 0; 
          transition: border-color 0.3s;
        }
        .chat-toggle-button:hover {
          background-color: #102A4C; 
        }
        .toggle-icon {
          font-size: 1.6rem;
          transition: transform 0.3s ease;
          pointer-events: none; 
        }
        
        .toggle-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          pointer-events: none; 
        }

        .chat-content-wrapper {
          flex-grow: 1; 
          padding: ${isInitializingChat || showContextMissingMessage ? '0' : '0.75rem 1rem 1rem 1rem'};
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0; 
        }
        
        .chat-status-display { 
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-subtitle);
          padding: 2rem 1rem;
          text-align: center;
          height: 100%; 
        }
        .chat-status-display .loading-spinner {
          animation: spin 1s linear infinite;
          border: 4px solid var(--color-component-border);
          border-radius: 50%;
          border-top-color: var(--color-accent);
          height: 32px;
          width: 32px;
          margin-bottom: 1rem;
        }
         .chat-status-display .status-icon {
          font-size: 2rem;
          color: var(--color-accent-secondary);
          margin-bottom: 0.75rem;
        }
        .chat-status-display p {
          font-size: 0.9rem;
          line-height: 1.5;
        }
         .chat-status-display p strong { color: var(--color-accent); }
         .chat-status-display p em { color: var(--color-text); font-style: normal; }


        .chat-messages-area {
          flex-grow: 1;
          overflow-y: auto;
          margin-bottom: 0.75rem;
          padding-right: 0.5rem; 
          scrollbar-width: thin;
          scrollbar-color: var(--color-subtitle) var(--color-component-background);
        }
        .chat-messages-area::-webkit-scrollbar {
          width: 8px;
        }
        .chat-messages-area::-webkit-scrollbar-thumb {
          background-color: var(--color-subtitle);
          border-radius: 4px;
        }
        .chat-message {
          margin-bottom: 0.85rem;
          padding: 0.6rem 0.9rem;
          border-radius: 12px;
          line-height: 1.5;
          max-width: 75%;
          word-wrap: break-word; 
        }
        .chat-message p {
          margin: 0;
        }
        .chat-message.user {
          background-color: var(--color-accent);
          color: var(--color-background); 
          margin-left: auto;
          border-bottom-right-radius: 4px; 
        }
        .chat-message.ai {
          background-color: #1E3A5F; 
          color: var(--color-text);
          margin-right: auto;
          border-bottom-left-radius: 4px; 
        }
        .chat-message.system {
          font-style: italic;
          color: var(--color-subtitle);
          text-align: center;
          font-size: 0.8rem;
          padding: 0.25rem 0;
          background-color: transparent;
          max-width: 100%;
        }
        
        .typing-indicator {
          font-style: italic;
          opacity: 0.8;
        }

        .chat-error-display {
            color: var(--color-error);
            background-color: rgba(255, 82, 82, 0.1);
            border: 1px solid var(--color-error);
            border-radius: 4px;
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
            padding: 0.5rem 0.75rem;
            text-align: center;
        }

        .chat-input-form {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-shrink: 0; 
          padding-top: 0.5rem;
          border-top: 1px solid var(--color-component-border);
        }
        .chat-input-form input[type="text"] {
          flex-grow: 1;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          border-radius: 20px; 
          background-color: #0E2038; 
        }
        .chat-input-form input[type="text"]:focus {
          background-color: var(--color-component-background); 
        }

        .send-button {
          border-radius: 50%; 
          width: 44px;
          height: 44px;
          padding: 0; 
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background-color: var(--color-accent);
          color: var(--color-background);
        }
        .send-button:hover:not(:disabled) {
          background-color: var(--color-accent-hover);
        }
        .send-button:disabled {
            background-color: #1E3A5F;
            border-color: #1E3A5F;
            color: #8892B0;
            opacity: 0.7; 
        }
        .send-button .material-symbols-outlined {
          font-size: 1.6rem; 
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
