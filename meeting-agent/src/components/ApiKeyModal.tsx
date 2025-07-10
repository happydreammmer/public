import React, { useState } from 'react';

const ApiKeyModal: React.FC<{ onSave: (key: string) => void }> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');

  return (
    <div id="api-key-container">
      <h1>Enter Gemini API Key</h1>
      <p>To use this application, please enter your Google Gemini API key.</p>
      <input 
        type="password" 
        id="api-key-input" 
        placeholder="Enter your API key" 
        value={inputKey}
        onChange={(e) => setInputKey(e.target.value)}
      />
      <button id="save-api-key" onClick={() => onSave(inputKey)}>Save Key</button>
    </div>
  );
};

export default ApiKeyModal; 