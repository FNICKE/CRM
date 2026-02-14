import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAccount } from '../../../src/features/accounts/accountsSlice';import * as XLSX from 'xlsx';
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
  const dispatch = useDispatch();
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

  const processFile = (selectedFile) => {
    setUploadStatus('uploading');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        // Validation: Ensure the data is an array and not empty
        if (parsedData.length === 0) {
          alert("The file is empty or formatted incorrectly.");
          setUploadStatus('idle');
          return;
        }

        // Map data and dispatch to Redux
        parsedData.forEach((row) => {
          dispatch(addAccount({
            name: row.Name || row.name || 'Unknown',
            email: row.Email || row.email || 'N/A',
            phone: row.Phone || row.phone || 'N/A',
            website: row.Website || row.website || 'N/A',
            industry: row.Industry || row.industry || 'n/a',
            status: true, // Defaulting new imports to active
            remark: row.Remark || row.remark || ''
          }));
        });

        setTimeout(() => setUploadStatus('success'), 800);
      } catch (error) {
        console.error("Excel processing error:", error);
        alert("Error processing file. Please ensure it is a valid Excel/CSV.");
        setUploadStatus('idle');
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus('idle');
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
              <p className="text-gray-600 mt-1 text-sm">Data has been synced to your account list</p>
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
                  cursor-pointer hover:border-gray-400 transition-colors
                  ${isDragging ? 'border-blue-500 bg-blue-50' : ''}
                `}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileSelect} 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
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

            {uploadStatus === 'uploading' && (
              <div className="space-y-2 py-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 font-medium">Processing Data...</span>
                  <span className="text-gray-500 animate-pulse">Wait a moment</span>
                </div>
                <div className="h-1 bg-gray-200 overflow-hidden">
                  <div className="h-full bg-blue-600 w-full transition-all duration-1000 origin-left scale-x-75 animate-pulse"></div>
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