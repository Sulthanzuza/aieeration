import React from 'react';
// 1. Make sure the path to your logo is correct
import logo from '/logo.webp';

const LoadingSpinner = ({ size = 'md', text = 'Processing...' }) => {
  // 2. Define size classes for the logo image
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* 3. Replace the div spinner with your logo */}
      {/* The animate-pulse class creates the breathing effect */}
      <img 
        src={logo} 
        alt="Loading..." 
        className={`${sizeClasses[size]} animate-pulse`}
      />
      
      {/* The text remains, but we can adjust its style for a cleaner look */}
      {text && (
        <p className="text-slate-600 text-center font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
