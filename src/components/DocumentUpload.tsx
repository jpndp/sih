import React, { useState, useCallback } from 'react';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  category?: string;
  summary?: string;
  confidence?: number;
}

export function DocumentUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate processing
    newFiles.forEach(file => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'processing' }
            : f
        ));
      }, 1000);

      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'complete',
                category: getDocumentCategory(file.name),
                summary: generateSummary(file.name),
                confidence: Math.floor(Math.random() * 20) + 80
              }
            : f
        ));
      }, 3000);
    });
  };

  const getDocumentCategory = (filename: string): string => {
    if (filename.toLowerCase().includes('safety')) return 'Safety & Compliance';
    if (filename.toLowerCase().includes('invoice')) return 'Finance & Procurement';
    if (filename.toLowerCase().includes('maintenance')) return 'Engineering & Maintenance';
    if (filename.toLowerCase().includes('training')) return 'Human Resources';
    return 'General Operations';
  };

  const generateSummary = (filename: string): string => {
    const summaries = [
      'Critical safety updates for platform operations with immediate implementation required.',
      'Procurement document requires approval from Engineering department before processing payment.',
      'Routine maintenance schedule changes affecting weekend service operations.',
      'Staff training requirements updated per latest regulatory guidelines.',
      'Standard operational procedure updates for customer service protocols.'
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Upload & Processing</h1>
        <p className="text-gray-600 mt-2">
          Upload documents for automated categorization, summarization, and routing
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop documents here or click to upload
        </h3>
        <p className="text-gray-600 mb-4">
          Supports PDF, Word, Excel, and image files up to 50MB
        </p>
        <div className="text-sm text-gray-500">
          <p>✓ Automatic language detection (English/Malayalam)</p>
          <p>✓ Smart categorization by department and type</p>
          <p>✓ AI-powered summarization and key insight extraction</p>
        </div>
      </div>

      {/* Processing Queue */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Processing Queue</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <File className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                    
                    <div className="mt-3">
                      {file.status === 'uploading' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-blue-600">Uploading...</span>
                        </div>
                      )}
                      
                      {file.status === 'processing' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-orange-600">Processing with AI...</span>
                        </div>
                      )}
                      
                      {file.status === 'complete' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600">Processing Complete</span>
                            <span className="text-xs text-gray-500">({file.confidence}% confidence)</span>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700">Category:</span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {file.category}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-700 block mb-1">Summary:</span>
                              <p className="text-xs text-gray-600">{file.summary}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-red-600">Processing Failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Processing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Today's Processing</h3>
          <div className="text-2xl font-bold text-gray-900">247 docs</div>
          <p className="text-sm text-green-600">+12% from yesterday</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Accuracy Rate</h3>
          <div className="text-2xl font-bold text-gray-900">94.2%</div>
          <p className="text-sm text-green-600">+2.1% this week</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Avg. Processing Time</h3>
          <div className="text-2xl font-bold text-gray-900">1.8s</div>
          <p className="text-sm text-green-600">-0.3s improvement</p>
        </div>
      </div>
    </div>
  );
}