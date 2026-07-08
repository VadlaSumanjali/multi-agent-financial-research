import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const UploadProgress = ({ progress, status }) => {
  const isSuccess = status === 'success' || progress === 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-slate-500">
          {isSuccess ? 'Upload complete' : 'Uploading document...'}
        </span>
        <span className="font-semibold text-slate-700 font-manrope">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
        <motion.div
          className={`h-full rounded-full ${isSuccess ? 'bg-green-600' : 'bg-blue-600'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        />
      </div>

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs text-green-600 font-medium pt-1"
        >
          <CheckCircle2 size={14} />
          <span>Filing successfully parsed and indexed!</span>
        </motion.div>
      )}
    </div>
  );
};

export default UploadProgress;
