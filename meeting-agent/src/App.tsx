import React, { useState, useEffect } from 'react';
import ApiKeyModal from './components/ApiKeyModal';
import MainApp from './components/MainApp';
import { updateApiKey } from './services/geminiManager';

const App: React.FC = () => {
  const [_apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(true);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      updateApiKey(storedApiKey);
      setShowApiKeyModal(false);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    updateApiKey(key);
    setShowApiKeyModal(false);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey(null);
    setShowApiKeyModal(true);
  };

  return (
    <div>
      {showApiKeyModal ? (
        <ApiKeyModal onSave={handleSaveApiKey} />
      ) : (
        <MainApp onClearApiKey={handleClearApiKey} />
      )}
    </div>
  );
};

export default App; 