import React from 'react';
import { ProcessedFile } from '../App'; 
import LoadingSpinner from './LoadingSpinner';

interface FileQueueDisplayProps {
  files: ProcessedFile[];
  className?: string;
}

const FileStatusIcon: React.FC<{ status: ProcessedFile['status'] }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case 'processing':
      return <LoadingSpinner size="sm" />; 
    case 'completed':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case 'error':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      );
    default:
      return null;
  }
};

const FileQueueDisplay: React.FC<FileQueueDisplayProps> = ({ files, className }) => {
  if (files.length === 0) {
    return null; 
  }

  const getStatusText = (status: ProcessedFile['status'], errorMsg?: string | null) => {
    switch(status) {
        case 'pending': return 'Pending...';
        case 'processing': return 'Processing...';
        case 'completed': return 'Completed';
        case 'error': return errorMsg ? `Error: ${errorMsg.substring(0,50)}${errorMsg.length > 50 ? '...' : ''}` : 'Error';
        default: return '';
    }
  }

  return (
    <div className={`space-y-2 ${className || ''}`} aria-label="File processing queue">
      <h3 className="text-md font-semibold text-slate-200 px-1 pt-1">File Queue ({files.length})</h3>
      <ul role="list" className="divide-y divide-slate-700">
        {files.map((item) => (
          <li key={item.id} className="p-3 hover:bg-slate-700/50 transition-colors duration-150 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FileStatusIcon status={item.status} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate" title={item.file.name}>
                  {item.file.name}
                </p>
                <p className={`text-xs truncate ${item.status === 'error' ? 'text-red-400' : 'text-slate-400'}`} title={getStatusText(item.status, item.error)}>
                  {getStatusText(item.status, item.error)}
                </p>
              </div>
              <div className="text-xs text-slate-500">
                ({(item.file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileQueueDisplay;