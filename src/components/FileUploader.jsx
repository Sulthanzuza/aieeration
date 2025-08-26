import React, { useState, useRef } from 'react';
import { Upload, FileAudio, X } from 'lucide-react';

const FileUploader = ({ onFileSelect, selectedFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      onFileSelect(audioFile);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
            ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full transition-all duration-300
              ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
            `}>
              <Upload size={32} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragging ? 'Drop your audio file here' : 'Upload Audio File'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your audio file here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Supports MP3, WAV, M4A, and other audio formats (Max: 25MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileAudio size={24} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{selectedFile.name}</h4>
                <p className="text-sm text-gray-600">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
            </div>
            
            {!disabled && (
              <button
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                title="Remove file"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;