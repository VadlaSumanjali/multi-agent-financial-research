import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import DragDropZone from './DragDropZone';
import FilePreview from './FilePreview';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const UploadCard = () => {
  const { addDocument, createNewSession } = useApp();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');
    setUploadStatus('idle');
    setProgress(0);
  };

  const handleRemove = () => {
    setFile(null);
    setError('');
    setUploadStatus('idle');
    setProgress(0);
  };

  const handleUpload = () => {
    if (!file) return;

    setUploadStatus('uploading');
    setProgress(0);

    // Simulate upload progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          
          // Complete local upload flow
          setTimeout(() => {
            // Automatically initialize a session for this document to make landing in Research Workspace smooth
            const baseName = file.name.replace(/\.[^/.]+$/, ""); // Strip extension
            // Try to extract ticker-like strings or use corporate default
            const session = createNewSession(`${baseName} Analysis`, baseName, 'CORP');
            addDocument(file, session.id);
            
            // Navigate to Research Workspace
            navigate('/workspace');
          }, 1000);
          
          return 100;
        }
        // Random increment for realistic simulation
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10 space-y-6"
    >
      {/* Card Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-jakarta text-slate-900 tracking-tight">
          Upload Financial Documents
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Upload Annual Reports, 10-K filings, Earnings Reports or Financial Statements to start financial research.
        </p>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-2"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone / File Preview */}
      <div>
        {!file ? (
          <DragDropZone onFileSelect={handleFileSelect} onError={setError} />
        ) : (
          <FilePreview
            file={file}
            progress={progress}
            status={uploadStatus}
            onRemove={handleRemove}
            onUpload={handleUpload}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="flex justify-center items-center gap-6 text-[10px] text-slate-400 font-semibold font-manrope uppercase tracking-widest pt-2 border-t border-slate-100">
        <span>Format: PDF</span>
        <span>•</span>
        <span>Limit: 20MB</span>
      </div>
    </motion.div>
  );
};

export default UploadCard;
