/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import { marked } from 'marked';

export function sanitizeFilename(name: string, maxLength: number = 60): string {
  let sanitized = name.replace(/[^\p{L}\p{N}\s.-]/gu, '_'); 
  sanitized = sanitized.replace(/\s+/g, '_');      
  sanitized = sanitized.replace(/__+/g, '_');      
  sanitized = sanitized.replace(/^_|_$/g, '');     

  if (sanitized.length > maxLength) {
    const extensionMatch = sanitized.match(/\.[^.]+$/);
    const extension = extensionMatch ? extensionMatch[0] : '';
    let baseName = extension ? sanitized.substring(0, sanitized.length - extension.length) : sanitized;
    
    const availableLengthForBase = maxLength - extension.length - (baseName.length > maxLength - extension.length && !extension ? 3 : 0);
    baseName = baseName.substring(0, availableLengthForBase);
    if (!extension && sanitized.length > maxLength) baseName += '...';
    
    sanitized = baseName + extension;
  }
  if (!sanitized.trim() || sanitized === '.' || sanitized.match(/^\.+$/)) {
      sanitized = `download_${Date.now()}`;
  }
  return sanitized;
}

export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain;charset=utf-8'): void {
  const safeFilename = sanitizeFilename(filename);
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string, type: string): Promise<void> {
  if (!text) {
      // Consider how to provide status updates, maybe return a status object or throw
      console.info(`No ${type} content to copy.`);
      return Promise.reject(`No ${type} content to copy.`);
  }
  try {
      await navigator.clipboard.writeText(text);
      return Promise.resolve();
  } catch (err) {
      console.error(`Failed to copy ${type}:`, err);
      return Promise.reject(`Failed to copy ${type}.`);
  }
}

export function stripHtmlForText(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  if (tempDiv.querySelector('ul') || tempDiv.querySelector('ol')) {
      let textList = '';
      tempDiv.querySelectorAll('li').forEach(li => {
          let itemText = '';
          const strongText = li.querySelector('strong')?.textContent?.trim();
          const emText = li.querySelector('em')?.textContent?.trim();

          if (strongText) itemText += strongText;
          if (emText) itemText += (itemText ? ' ' : '') + emText;
          
          if (!itemText) {
              const liClone = li.cloneNode(true) as HTMLLIElement;
              liClone.querySelectorAll('strong, em').forEach(el => el.remove());
              itemText = liClone.textContent?.trim() || '';
          }
          if (itemText) textList += `- ${itemText}\n`;
      });
      return textList.trim() !== '' ? textList.trim() : (tempDiv.textContent || tempDiv.innerText || "").trim();
  }
  return (tempDiv.textContent || tempDiv.innerText || "").trim();
}

export async function markdownToText(markdown: string): Promise<string> {
  if (!markdown) return '';
  const html = await Promise.resolve(marked.parse(markdown));
  return stripHtmlForText(html);
}

export function htmlListToMarkdown(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  let markdown = '';
  tempDiv.querySelectorAll('li').forEach(li => {
      const strong = li.querySelector('strong');
      const em = li.querySelector('em');
      let taskText = strong ? `**${strong.textContent?.trim()}**` : '';
      if (em) {
          taskText += (taskText ? ' ' : '') + `*${em.textContent?.trim()}*`;
      }
      if (!taskText) {
          const liClone = li.cloneNode(true) as HTMLLIElement;
          liClone.querySelectorAll('strong, em').forEach(sel => sel.remove());
          taskText = liClone.textContent?.trim() || '';
      }
      markdown += `- ${taskText}\n`;
  });
  return markdown.trim();
}

export function blobToBase64(blob: Blob): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(blob);
  });
}
