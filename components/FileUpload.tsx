import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { FlashcardData } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: FlashcardData[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await parseCSV(file);
      if (result.error) {
        setError(result.error);
      } else {
        onDataLoaded(result.data);
      }
    } catch (err) {
      setError('An unexpected error occurred parsing the file.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">FlashMaster 11</h1>
        <p className="text-slate-400 text-lg">Master your 11th-grade vocabulary.</p>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative w-full max-w-xl p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ease-out
          ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-102' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
            ) : (
              <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-400' : 'text-slate-400'}`} />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-200">
              {isDragging ? 'Drop CSV file here' : 'Upload your Flashcards'}
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Drag and drop your CSV file here, or click below to browse. 
              <br/>Format: "question", "answer"
            </p>
          </div>

          <label className="cursor-pointer mt-4">
            <span className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20">
              Browse Files
            </span>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={onFileInput}
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg border border-red-400/20 max-w-md animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm text-left">{error}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full text-left">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h4 className="font-medium text-slate-200">Simple Format</h4>
          </div>
          <p className="text-sm text-slate-500">Your CSV just needs two columns: "Question" and "Answer".</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-indigo-400"></div>
            <h4 className="font-medium text-slate-200">Secure & Private</h4>
          </div>
          <p className="text-sm text-slate-500">Files are processed entirely in your browser. No server uploads.</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;