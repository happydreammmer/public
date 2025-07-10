import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'lg' }) => {
  let spinnerSizeClasses = '';
  switch (size) {
    case 'sm':
      spinnerSizeClasses = 'h-5 w-5 border-t-2 border-b-2'; // Adjusted for FileQueue
      break;
    case 'md':
      spinnerSizeClasses = 'h-8 w-8 border-t-4 border-b-4';
      break;
    case 'lg':
    default:
      spinnerSizeClasses = 'h-12 w-12 border-t-4 border-b-4';
      break;
  }

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full border-blue-500 ${spinnerSizeClasses}`}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;