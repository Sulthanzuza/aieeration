import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Cpu, 
  Zap, 

  Sparkles, 
  Shield, 
  Clock, 
  Globe, 

} from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import audioService from './services/audioService';
import FileUploader from './components/FileUploader';
import LoadingSpinner from './components/LoadingSpinner';
import AnalysisResults from './components/AnalysisResults';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useLocalStorage('audioAnalysisResults', null);
  const [analysisMetadata, setAnalysisMetadata] = useLocalStorage('audioAnalysisMetadata', null);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    setServerStatus('checking');
    try {
      const isHealthy = await audioService.healthCheck();
      setServerStatus(isHealthy ? 'online' : 'offline');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await audioService.analyzeAudio(selectedFile);
      setAnalysisResults(result.data);
      setAnalysisMetadata(result.metadata);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleRetry = () => {
    if (selectedFile) {
      handleAnalyze();
    }
  };

  const handleClearError = () => {
    setError(null);
  };

  const handleClearAll = () => {
    setSelectedFile(null);
    setAnalysisResults(null);
    setAnalysisMetadata(null);
    setError(null);
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation Header */}
      <nav className="bg-white/95 border-b border-slate-200/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
  src="/logo.webp" 
  className="h-12 w-12 grayscale brightness-0" 
  alt="Logo" 
/>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Aieeration
                </h1>
               
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <div className={`w-2 h-2 rounded-full ${
                  serverStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
                  serverStatus === 'offline' ? 'bg-red-500' : 'bg-amber-500'
                }`}></div>
                <span className="text-xs font-medium text-slate-600">
                  {serverStatus === 'checking' ? 'Connecting...' : 
                   serverStatus === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!analysisResults && (
        <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse [animation-delay:2000ms]"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center max-w-4xl mx-auto">
              
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
                Transform Audio into
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                  Actionable Insights
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                Experience next-generation audio analysis with enterprise-grade AI. Get instant transcriptions, intelligent summaries, and deep content insights from any audio file with unmatched accuracy and speed.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
               
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Real-time Processing</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium">100+ Languages</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {serverStatus === 'offline' && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Service Temporarily Unavailable</h3>
                  <p className="text-red-700">Backend server is offline. Please ensure it's running.</p>
                </div>
              </div>
              <button
                onClick={checkServerHealth}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {isAnalyzing ? (
          <section className="py-20">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-16">
              <LoadingSpinner size="xl" text="Analyzing your audio with advanced AI models... This may take a few moments." />
            </div>
          </section>
        ) : error ? (
          <section className="py-8">
            <ErrorMessage error={error} onRetry={handleRetry} onClear={handleClearError} />
          </section>
        ) : analysisResults ? (
          <section className="py-8">
            <AnalysisResults results={analysisResults} metadata={analysisMetadata} />
             <div className="mt-8 flex justify-center">
                <button
                  onClick={handleClearAll}
                  className="px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-colors duration-200"
                >
                  Analyze Another File
                </button>
              </div>
          </section>
        ) : (
          <>

            {/* Upload Section */}
            <section className="pb-20">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900">Upload & Analyze</h2>
                  <p className="text-slate-600 mt-1">Select your audio file to begin the AI-powered analysis.</p>
                </div>
                <div className="p-8">
                  <FileUploader onFileSelect={handleFileSelect} selectedFile={selectedFile} disabled={isAnalyzing || serverStatus === 'offline'} />
                  {selectedFile && !isAnalyzing && (
                    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={handleAnalyze}
                        disabled={serverStatus === 'offline'}
                        className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 mr-2" />
                          Analyze with AI
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div >
                 <img 
  src="/logo.webp" 
  className="h-12 w-12 grayscale brightness-100" 
  alt="Logo" 
/>
              </div>
              <h3 className="text-2xl font-bold">Aieeration</h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 mb-6 text-slate-400">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm">Powered by Google Gemini</span>
              </div>
              
            
            </div>
            <div className="border-t border-slate-700 pt-6 mt-6">
              <p className="text-slate-400 text-sm">
                © 2025 <a href="https://www.aieera.com">Aieera</a>. Advanced AI-powered audio intelligence platform.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;