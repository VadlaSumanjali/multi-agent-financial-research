import React from 'react';
import { FileText, Trash2, ArrowRight } from 'lucide-react';
import Button from '../Common/Button';
import UploadProgress from './UploadProgress';
import { motion } from 'framer-motion';

export const FilePreview = ({ file, progress, status, onRemove, onUpload }) => {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const isUploading = status === 'uploading';
  const isSuccess = status === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4.5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate select-text">
              ✓ {file.name}
            </p>
            <p className="text-[10px] text-slate-400 font-manrope font-medium mt-0.5">
              {formatBytes(file.size)}
            </p>
          </div>
        </div>

        {!isUploading && !isSuccess && (
          <button
            onClick={onRemove}
            className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            title="Remove document"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {isUploading || isSuccess ? (
        <UploadProgress progress={progress} status={status} />
      ) : (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 text-xs py-2 justify-center"
            onClick={onRemove}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1 text-xs py-2 justify-center"
            onClick={onUpload}
            Icon={ArrowRight}
          >
            Upload filing
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default FilePreview;
