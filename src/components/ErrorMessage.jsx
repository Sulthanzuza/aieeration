import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ error, onRetry, onClear }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-red-100 rounded-full">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Analysis Failed
          </h3>
          <p className="text-red-800 mb-4">
            {error}
          </p>
          <div className="flex space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
            )}
            {onClear && (
              <button
                onClick={onClear}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Clear Error
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;