import React from 'react';
import UploadCard from '../components/Upload/UploadCard';
import { motion } from 'framer-motion';

export const Upload = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-6 sm:p-12 page-transition-wrapper select-none">
      <UploadCard />
    </div>
  );
};

export default Upload;
