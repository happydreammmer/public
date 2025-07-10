/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

// Function to extract YouTube video ID
export const getYouTubeVideoId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    // Handle standard watch URLs (youtube.com/watch?v=...)
    if (
      parsedUrl.hostname === 'www.youtube.com' ||
      parsedUrl.hostname === 'youtube.com'
    ) {
      if (parsedUrl.pathname === '/watch') {
        const videoId = parsedUrl.searchParams.get('v');
        if (videoId && videoId.length === 11) {
          return videoId;
        }
      }
      // Handle shorts URLs (youtube.com/shorts/...)
      if (parsedUrl.pathname.startsWith('/shorts/')) {
        const videoId = parsedUrl.pathname.substring(8); // Length of '/shorts/'
        if (videoId && videoId.length === 11) {
          return videoId;
        }
      }
      // Handle embed URLs (youtube.com/embed/...)
      if (parsedUrl.pathname.startsWith('/embed/')) {
        const videoId = parsedUrl.pathname.substring(7); // Length of '/embed/'
        if (videoId && videoId.length === 11) {
          return videoId;
        }
      }
    }
    // Handle short URLs (youtu.be/...)
    if (parsedUrl.hostname === 'youtu.be') {
      const videoId = parsedUrl.pathname.substring(1); // Remove leading '/'
      if (videoId && videoId.length === 11) {
        return videoId;
      }
    }
  } catch (e) {
    // Ignore URL parsing errors, means it's likely not a valid URL format
    console.warn('URL parsing failed:', e);
  }
  // Fallback using simplified Regex for other potential edge cases not caught by URL parsing
  // This regex might catch some cases, but the URL object parsing is more robust for known formats.
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([a-zA-Z0-9_-]{11}).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }

  return null;
};

// Helper function to validate a YouTube video URL
export async function validateYoutubeUrl(
  url: string,
): Promise<{isValid: boolean; error?: string}> {
  if (getYouTubeVideoId(url)) {
    return {isValid: true};
  }
  return {isValid: false, error: 'Invalid YouTube URL'};
}

// Helper function to extract YouTube video ID and create embed URL
export function getYoutubeEmbedUrl(url: string): string {
  const videoId = getYouTubeVideoId(url); // Use the enhanced getYouTubeVideoId

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // This fallback is unlikely to be hit if validation is working and getYouTubeVideoId is robust
  console.warn(
    'Could not extract video ID for embedding using getYouTubeVideoId, using original URL for embed:',
    url,
  );
  return url; 
}

export async function getYouTubeVideoTitle(url: string) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL, cannot extract video ID for title.');
  }
  // Use a canonical watch URL for oEmbed to ensure compatibility
  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`;

  const response = await fetch(oEmbedUrl);

  if (!response.ok) {
    // Try to get more specific error from YouTube oEmbed if possible
    let errorDetail = `HTTP error! status: ${response.status}`;
    try {
        const errorText = await response.text(); // YouTube oEmbed might return plain text errors
        if (errorText) errorDetail += ` - ${errorText}`;
    } catch (e) { /* ignore text parsing error */ }
    throw new Error(`Not a valid YouTube video URL or video not found on oEmbed: ${errorDetail}`);
  }

  // Parse the JSON response
  const data = await response.json();

  // Display the title
  if (data && data.title) {
    return data.title;
  } else {
    throw new Error('Error: No title found in the oEmbed response.');
  }
}
