const API_KEY_STORAGE_KEY = 'gemini-api-key';

export function saveApiKey(apiKey: string) {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
} 