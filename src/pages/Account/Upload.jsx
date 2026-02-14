import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  X, 
  Info, 
  ArrowRight,
  Download
} from 'lucide-react';

const AccountUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus('idle');
  };

  const simulateUpload = () => {
    setUploadStatus('uploading');
    setTimeout(() => setUploadStatus('success'), 1800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-4 sm:px-0">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium text-gray-900">Import Accounts</h2>
        <p className="text-gray-600 text-sm">Upload CSV or Excel file</p>
      </div>

      {/* Upload area */}
      <div className="bg-white border border-gray-200 p-6 md:p-8">
        
        {uploadStatus === 'success' ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Upload Successful</h3>
              <p className="text-gray-600 mt-1 text-sm">Data is being processed</p>
            </div>
            <button 
              onClick={removeFile}
              className="mt-4 px-6 py-2 bg-gray-800 text-white text-sm hover:bg-gray-900"
            >
              Upload Another
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {!file ? (
              <label 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed border-gray-300 p-10 md:p-16 flex flex-col items-center
                  cursor-pointer hover:border-gray-400
                  ${isDragging ? 'border-blue-500 bg-blue-50' : ''}
                `}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileSelect} 
                  accept=".csv,.xlsx" 
                />
                <UploadCloud size={36} className="text-gray-400 mb-4" />
                <p className="text-gray-800 font-medium">Click or drag file here</p>
                <p className="text-gray-500 text-sm mt-1">CSV or Excel • max 10 MB</p>
              </label>
            ) : (
              <div className="border border-gray-200 bg-gray-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet size={24} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={removeFile}
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {file && uploadStatus === 'idle' && (
              <button 
                onClick={simulateUpload}
                className="w-full bg-blue-600 text-white py-3 text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                Import File <ArrowRight size={16} />
              </button>
            )}

            {uploadStatus === 'uploading' && (
              <div className="space-y-2 py-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Processing...</span>
                  <span className="text-gray-500">~2 sec</span>
                </div>
                <div className="h-1 bg-gray-200">
                  <div className="h-full bg-blue-600 w-3/4 transition-all duration-1500"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help & Template */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 p-5 flex items-start gap-4">
          <Info size={20} className="text-orange-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-gray-800">File Format</h4>
            <p className="text-sm text-gray-600 mt-1">
              Required columns: Name, Email, Phone, Website, Industry
            </p>
          </div>
        </div>

        <div className="bg-gray-800 text-white p-5 flex items-center justify-between cursor-pointer hover:bg-gray-900">
          <div className="flex items-center gap-4">
            <Download size={20} />
            <div>
              <h4 className="text-sm font-medium">Download Template</h4>
              <p className="text-xs text-gray-400">Ready-to-use format</p>
            </div>
          </div>
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default AccountUpload;