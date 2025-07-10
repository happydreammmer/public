import React, { useEffect, useState } from 'react';

interface ErrorMessageProps {
  message: string | null;
  onDismiss: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // Optional: auto-dismiss after some time
      // const timer = setTimeout(() => {
      //   handleDismiss();
      // }, 7000);
      // return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Call onDismiss after animation (if any) or immediately
    setTimeout(onDismiss, 300); // Match transition duration
  };

  if (!message && !isVisible) return null; // Ensure component unmounts fully if message is null

  return (
    <div 
      className={`fixed top-5 right-5 md:max-w-md w-11/12 
                 bg-red-900/80 border-l-4 border-red-600 text-red-300 
                 p-4 rounded-md shadow-lg shadow-red-900/60 z-50 
                 transition-all duration-300 ease-in-out transform 
                 ${isVisible && message ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`} 
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold">Error</p>
          <p className="text-sm">{message}</p>
        </div>
        <button 
            onClick={handleDismiss} 
            className="ml-auto -mx-1.5 -my-1.5 
                       bg-red-900/50 text-red-400 rounded-lg focus:ring-2 focus:ring-red-500 p-1.5 hover:bg-red-800/70
                       inline-flex h-8 w-8"
            aria-label="Dismiss"
        >
            <span className="sr-only">Dismiss</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;