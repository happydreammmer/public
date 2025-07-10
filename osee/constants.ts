
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/heic',
  'image/heif',
];

export const MAX_FILE_SIZE_MB = 20; // Gemini's actual payload limit might be different (e.g. 4MB for gemini-pro-vision for text/image parts)
                                     // This is a client-side preliminary check.
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
