import { useState, useEffect } from 'react';

type PromptMode = 'fast' | 'smart';

export const usePromptMode = () => {
  const [promptMode, setPromptMode] = useState<PromptMode>(() => {
    return (localStorage.getItem('promptMode') as PromptMode) || 'fast';
  });

  useEffect(() => {
    localStorage.setItem('promptMode', promptMode);
  }, [promptMode]);

  const togglePromptMode = () => {
    setPromptMode((prevMode) => (prevMode === 'fast' ? 'smart' : 'fast'));
  };

  return { promptMode, togglePromptMode };
}; 