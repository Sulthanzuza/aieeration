import React, { useState } from 'react';
import { Languages, FileText, Globe, Calendar, Download, Copy, Check, SpellCheck, MessageSquare } from 'lucide-react';
import jsPDF from 'jspdf';

const AnalysisResults = ({ results, metadata }) => {
  const [activeView, setActiveView] = useState('english'); // Default to English view
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, fieldName) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for insecure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const exportResults = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Audio Analysis Report', 105, y, { align: 'center' });
    y += 15;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Analysis Metadata', 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`File Name: ${metadata.fileName}`, 14, y);
    y += 7;
    doc.text(`File Size: ${(metadata.fileSize / (1024 * 1024)).toFixed(2)} MB`, 14, y);
    y += 7;
    doc.text(`Processed At: ${new Date(metadata.processedAt).toLocaleString()}`, 14, y);
    y += 15;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Identified Language', 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(results.identifiedLanguage, 14, y);
    y += 15;

    const addTextSection = (title, content) => {
      if (!content) return; // Don't add section if content is empty
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, y);
      y += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const splitText = doc.splitTextToSize(content, 180);
      
      splitText.forEach(line => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 14, y);
        y += 6;
      });
      y += 10;
    };

    // Add Content Sections to PDF
    addTextSection('English Summary', results.englishSummary);
    addTextSection('Full Transcript (English)', results.englishTranslation);
    addTextSection('Native Language Summary', results.nativeSummary);
    addTextSection('Full Transcript (Native)', results.nativeSubtitles);
    if (results.englishTransliteration) {
      addTextSection('Transliteration (English Characters)', results.englishTransliteration);
    }

    doc.save(`audio-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const CopyButton = ({ text, fieldName }) => (
    <button
      onClick={() => handleCopy(text, fieldName)}
      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
      title="Copy to clipboard"
    >
      {copiedField === fieldName ? (
        <Check size={16} className="text-green-600" />
      ) : (
        <Copy size={16} />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <FileText size={28} />
            <span>Analysis Results</span>
          </h2>
          <button
            onClick={exportResults}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Download size={16} />
            <span>Export as PDF</span>
          </button>
        </div>
        
        {metadata && (
          <div className="flex items-center space-x-6 text-sm text-blue-100">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{new Date(metadata.processedAt).toLocaleString()}</span>
            </div>
            <div>{metadata.fileName}</div>
            <div>{(metadata.fileSize / (1024 * 1024)).toFixed(2)} MB</div>
          </div>
        )}
      </div>

      {/* Language Identification */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Languages size={20} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Identified Language</h3>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium text-lg">{results.identifiedLanguage}</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveView('english')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeView === 'english' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Globe size={16} className="inline mr-2" />
            English
          </button>
          <button
            onClick={() => setActiveView('native')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeView === 'native' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Native Language
          </button>
          
          {results.englishTransliteration && (
            <button
              onClick={() => setActiveView('transliteration')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeView === 'transliteration' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SpellCheck size={16} className="inline mr-2" />
              Transliteration
            </button>
          )}
        </div>
      </div>

      {/* Content based on active view */}
      <div className="space-y-6">
        {activeView === 'native' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Full Transcript (Native)</h3>
                <CopyButton text={results.nativeSubtitles} fieldName="nativeSubtitles" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{results.nativeSubtitles}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Summary (Native)</h3>
                <CopyButton text={results.nativeSummary} fieldName="nativeSummary" />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed">{results.nativeSummary}</p>
              </div>
            </div>
          </>
        )}

        {activeView === 'transliteration' && results.englishTransliteration && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transliterated Transcript</h3>
              <CopyButton text={results.englishTransliteration} fieldName="englishTransliteration" />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{results.englishTransliteration}</p>
            </div>
          </div>
        )}

        {activeView === 'english' && (
          <>
            {/* English Translation */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Full Transcript (English)</h3>
                <CopyButton text={results.englishTranslation} fieldName="englishTranslation" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {results.englishTranslation}
                </p>
              </div>
            </div>

            {/* English Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">English Summary</h3>
                <CopyButton text={results.englishSummary} fieldName="englishSummary" />
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed">{results.englishSummary}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;