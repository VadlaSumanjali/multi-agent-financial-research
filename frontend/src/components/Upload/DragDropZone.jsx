import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export const DragDropZone = ({ onFileSelect, onError }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    // Validate PDF extension
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      onError('Only PDF documents are supported.');
      return false;
    }
    
    // Validate size (20MB = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      onError('File exceeds the 20MB size limit.');
      return false;
    }
    
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  return (
    <motion.div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all relative overflow-hidden bg-slate-50/50 cursor-pointer ${
        isDragActive
          ? 'border-blue-500 bg-blue-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <input
        type="file"
        id="file-upload-input"
        className="hidden"
        accept=".pdf"
        onChange={handleChange}
      />
      
      <label htmlFor="file-upload-input" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
        <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
          <UploadCloud size={32} />
        </div>
        <span className="text-sm font-semibold text-slate-800">
          Drag & Drop your financial document here
        </span>
        <span className="text-xs text-slate-400 mt-1">
          or click to browse from your computer
        </span>
        <span className="text-[10px] text-slate-400 font-medium mt-3 bg-white px-2 py-1 rounded-md border border-slate-100">
          PDF up to 20MB
        </span>
      </label>
    </motion.div>
  );
};

export default DragDropZone;
