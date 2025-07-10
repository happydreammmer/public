import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SUPPORTED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void; // Changed from FileList to File[]
  setGlobalError: (message: string | null) => void; 
  isProcessingQueue: boolean; 
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesAccepted, setGlobalError, isProcessingQueue }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const validateAndAcceptFiles = useCallback((inputFiles: FileList | File[] | null): boolean => {
    if (!inputFiles || inputFiles.length === 0) {
      setGlobalError('No files selected or pasted. Please choose one or more files.');
      return false;
    }

    const filesArray = Array.from(inputFiles); // Works for FileList and File[]

    const allFilesValid = filesArray.every(file => {
      if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
        setGlobalError(`Unsupported file type: ${file.name} (${file.type}). Supported types include PDF, JPG, PNG, etc.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setGlobalError(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum size per file: ${MAX_FILE_SIZE_MB}MB.`);
        return false;
      }
      return true;
    });

    if (!allFilesValid) {
      return false;
    }
    
    setGlobalError(null);
    onFilesAccepted(filesArray); // Pass File[]
    return true;
  }, [setGlobalError, onFilesAccepted]);

  const commonDragHandler = useCallback((event: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isProcessingQueue) setIsDragging(dragging);
  }, [isProcessingQueue]);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => commonDragHandler(event, true), [commonDragHandler]);
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => commonDragHandler(event, false), [commonDragHandler]);
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => commonDragHandler(event, true), [commonDragHandler]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (isProcessingQueue) return;

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndAcceptFiles(files);
    } else {
      setGlobalError("Could not read the dropped files.");
    }
  }, [isProcessingQueue, validateAndAcceptFiles, setGlobalError]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessingQueue) return;
    const files = event.target.files;
    if (files && files.length > 0) {
      validateAndAcceptFiles(files);
    }
    event.target.value = ''; // Reset file input
  }, [isProcessingQueue, validateAndAcceptFiles, setGlobalError]);


  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    if (isProcessingQueue) return;

    const items = event.clipboardData?.items;
    if (!items) return;

    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          // Create a new File object with a more descriptive name if possible
          const now = new Date();
          const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
          const newFileName = `Pasted_Image_${timestamp}.${file.type.split('/')[1] || 'png'}`;
          pastedFiles.push(new File([file], newFileName, { type: file.type }));
        }
      }
    }

    if (pastedFiles.length > 0) {
      event.preventDefault(); // Prevent default paste action if we handle files
      validateAndAcceptFiles(pastedFiles);
    } else {
      // Optionally, provide feedback if non-image data was pasted
      // setGlobalError("Pasted content is not a supported image file.");
    }
  }, [isProcessingQueue, validateAndAcceptFiles, setGlobalError]);

  useEffect(() => {
    const currentDropzone = dropzoneRef.current;
    if (currentDropzone) {
      // Type assertion for ClipboardEvent if TypeScript complains
      currentDropzone.addEventListener('paste', handlePaste as any as EventListener);
      return () => {
        currentDropzone.removeEventListener('paste', handlePaste as any as EventListener);
      };
    }
  }, [handlePaste]);


  const baseRingColor = 'border-slate-600';
  const hoverRingColor = 'hover:border-blue-500';
  const draggingRingColor = 'border-blue-500';
  const baseBgColor = 'bg-slate-700';
  const hoverBgColor = 'hover:bg-slate-600';
  const draggingBgColor = 'bg-slate-600';

  let dynamicClasses = '';
  if (isProcessingQueue) {
    dynamicClasses = ` bg-slate-600 border-slate-500 cursor-not-allowed opacity-70`;
  } else if (isDragging) {
    dynamicClasses = ` ${draggingRingColor} ${draggingBgColor} scale-105 shadow-lg shadow-blue-900/50`;
  } else {
    dynamicClasses = ` ${baseRingColor} ${baseBgColor} ${hoverRingColor} ${hoverBgColor} cursor-pointer`;
  }

  const groupClass = (!isProcessingQueue && !isDragging) ? 'group' : '';

  const dropzoneClasses = `
    border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ease-in-out
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 relative
    ${dynamicClasses} ${groupClass}
  `;
  
  const handleZoneClick = () => {
    if (!isProcessingQueue) {
      document.getElementById('fileInputOCR')?.click();
    }
  };
  
  const handleZoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isProcessingQueue) {
      document.getElementById('fileInputOCR')?.click();
    }
  };

  return (
    <div
      ref={dropzoneRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={dropzoneClasses.trim()}
      onClick={handleZoneClick}
      tabIndex={isProcessingQueue ? -1 : 0} // Make focusable for paste events
      onKeyDown={handleZoneKeyDown}
      role="button"
      aria-label="File upload zone. Click to browse, drag and drop files, or paste an image from clipboard."
    >
      <input
        type="file"
        id="fileInputOCR"
        className="hidden"
        onChange={handleFileInputChange}
        accept={SUPPORTED_MIME_TYPES.join(',')}
        disabled={isProcessingQueue}
        multiple
      />
      <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none min-h-[100px] md:min-h-[120px]">
        {isProcessingQueue ? (
          <>
            <LoadingSpinner size="md" />
            <p className="text-md font-medium text-blue-400 mt-2">Processing queue...</p>
          </>
        ) : (
          <>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.2} 
                stroke="currentColor" 
                className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-200 
                            ${isDragging ? 'text-blue-400 scale-110' : 'text-slate-500 group-hover:text-blue-400 group-hover:scale-110'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            <p className="text-md font-medium text-slate-200">
              <span className="text-blue-400 font-semibold">Click to upload, paste,</span> or drag & drop
            </p>
            <p className="text-xs text-slate-400">PDF, JPG, PNG, GIF, etc. (Max {MAX_FILE_SIZE_MB}MB each)</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
