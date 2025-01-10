import React, { useState, useCallback } from 'react';
import { FileText, Download, Upload, Globe2, Loader2 } from 'lucide-react';

type FileType = '.txt' | '.docx' | '.pdf';
type TranslationResult = {
  originalText: string;
  translatedText: string;
  timestamp: string;
};

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<TranslationResult[]>([]);

  const allowedTypes: FileType[] = ['.txt', '.docx', '.pdf'];

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedText(e.target.value.split('').reverse().join('')); 
      setIsTranslating(false);
    }, 500);
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  const handleDownload = useCallback((format: string) => {
    const element = document.createElement('a');
    const file = new Blob([translatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `translation.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [translatedText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Globe2 className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Translation Service</h1>
          <p className="text-gray-600">Real-time translation for your content</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Original Text</h2>
            <textarea
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={handleTextChange}
            />

            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <FileText className="w-4 h-4" />
                <span>Supported formats:</span>
                {allowedTypes.map(type => (
                  <span key={type} className="bg-gray-100 px-2 py-1 rounded">
                    {type}
                  </span>
                ))}
              </div>

              <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload Document</span>
                <input
                  type="file"
                  className="hidden"
                  accept={allowedTypes.join(',')}
                  onChange={handleFileUpload}
                  multiple
                />
              </label>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Translation</h2>
            <div className="relative">
              <textarea
                className="w-full h-48 p-4 border border-gray-200 rounded-lg bg-gray-50"
                value={translatedText}
                readOnly
              />
              {isTranslating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Download Translation</h3>
              <div className="flex gap-2">
                {['txt', 'docx', 'pdf'].map(format => (
                  <button
                    key={format}
                    onClick={() => handleDownload(format)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    .{format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Files</h2>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{file.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;