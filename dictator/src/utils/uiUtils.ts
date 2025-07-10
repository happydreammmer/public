export function updateElementText(
  element: HTMLElement | null,
  content: string | null, // Can be text or HTML string
  placeholder: string,
  isHtmlContent: boolean = false // Flag to indicate if 'content' is HTML
): void {
  if (!element) return;

  const currentContent = content?.trim();

  if (currentContent) {
    if (isHtmlContent) {
      element.innerHTML = content!; // content is known to be non-null here
    } else {
      element.textContent = content;
    }
    element.classList.remove('placeholder-active');
  } else {
    // Set placeholder (which might itself contain HTML)
    if (element.id === 'promptOutput' || (placeholder.includes('<') && placeholder.includes('>'))) { // Heuristic for HTML placeholder
        element.innerHTML = placeholder;
    } else {
        element.textContent = placeholder;
    }
    element.classList.add('placeholder-active');
  }
}


export function initContentEditablePlaceholders(): void {
  document
    .querySelectorAll<HTMLElement>('[contenteditable="true"][placeholder]')
    .forEach((el) => {
      const placeholder = el.getAttribute('placeholder')!;
      const isPromptOutput = el.id === 'promptOutput';

      const isEffectivelyEmpty = () => {
        const text = (isPromptOutput ? el.innerText : el.textContent)?.trim();
        return text === '' || text === placeholder;
      };
      
      const setPlaceholder = () => {
        if (isPromptOutput || (placeholder.includes('<') && placeholder.includes('>'))) {
            el.innerHTML = placeholder;
        } else {
            el.textContent = placeholder;
        }
        el.classList.add('placeholder-active');
      };

      const clearPlaceholder = () => {
        if (isPromptOutput || (placeholder.includes('<') && placeholder.includes('>'))) {
            el.innerHTML = '';
        } else {
            el.textContent = '';
        }
        el.classList.remove('placeholder-active');
      };

      if (isEffectivelyEmpty()) {
        setPlaceholder();
      } else {
        el.classList.remove('placeholder-active');
      }

      el.addEventListener('focus', () => {
        if (isEffectivelyEmpty()) {
          clearPlaceholder();
        }
      });

      el.addEventListener('blur', () => {
        const currentText = (isPromptOutput ? el.innerText : el.textContent)?.trim();
        if (currentText === '') {
          setPlaceholder();
        } else {
           if (currentText !== placeholder) {
             el.classList.remove('placeholder-active');
           } else if (!el.classList.contains('placeholder-active')) {
             el.classList.add('placeholder-active');
           }
        }
      });

      el.addEventListener('input', () => {
        const currentText = (isPromptOutput ? el.innerText : el.textContent)?.trim();
         if (currentText !== '' && currentText !== placeholder) {
            el.classList.remove('placeholder-active');
        }
      });

    });
}

export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain'): void {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
