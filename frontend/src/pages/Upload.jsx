import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload as UploadIcon, FileText, ChevronDown, CheckCircle2, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import Button from '../components/Common/Button';

export const Upload = () => {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    documents,
    setDocuments,
    uploadFile
  } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [docType, setDocType] = useState('10-Q');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const fileInputRef = useRef(null);

  if (sessions.length === 0) {
    return (
      <div className="space-y-6 page-transition-wrapper">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Upload Documents
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Load corporate filings, 10-K, 10-Q report PDFs, or earnings call transcript txt files into the vector database.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 enterprise-card bg-white p-8">
          <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
            <UploadIcon size={32} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Active Workspaces</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              You must create a research workspace first before uploading files. Go to the Dashboard or Workspace tab to initialize one.
            </p>
          </div>
        </div>
      </div>
    );
  }


  const handleFileBrowse = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      if (!companyName && activeSession) {
        setCompanyName(activeSession.company);
      }
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Call context upload file simulated method
    const docName = `${activeSession?.ticker || 'CORP'}-${docType}-${fiscalYear}-${selectedFile.name}`;
    const modifiedFile = new File([selectedFile], docName, { type: selectedFile.type });
    uploadFile(modifiedFile);

    // Reset local inputs
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
          Upload Documents
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Load corporate filings, 10-K, 10-Q report PDFs, or earnings call transcript txt files into the vector database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form (1 Column) */}
        <div className="lg:col-span-1 enterprise-card p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-sm font-jakarta text-slate-950 dark:text-white">
                Ingestion Engine
              </h3>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Workspace selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                  Target Workspace Workspace Selector
                </label>
                <div className="relative">
                  <select
                    value={activeSessionId}
                    onChange={(e) => {
                      setActiveSessionId(e.target.value);
                      const active = sessions.find(s => s.id === e.target.value);
                      if (active) setCompanyName(active.company);
                    }}
                    className="w-full h-10 pl-3 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary cursor-pointer appearance-none"
                  >
                    {sessions.map(s => (
                      <option key={s.id} value={s.id}>{s.company} ({s.ticker})</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Company name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple Inc."
                  value={companyName || activeSession?.company || ''}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Fiscal Year */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                    Fiscal Year
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026"
                    value={fiscalYear}
                    onChange={(e) => setFiscalYear(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:border-primary"
                  />
                </div>

                {/* Document Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                    Document Type
                  </label>
                  <div className="relative">
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full h-10 pl-3 pr-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary cursor-pointer appearance-none"
                    >
                      <option value="10-K">10-K Filing</option>
                      <option value="10-Q">10-Q Filing</option>
                      <option value="Call-Transcript">Call Transcript</option>
                      <option value="Analyst-Report">Analyst Report</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Choose File box */}
              <div
                onClick={handleFileBrowse}
                className="border-2 border-dashed border-slate-250 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all select-none bg-slate-50/50 dark:bg-slate-900/30"
              >
                <UploadIcon size={20} className="text-slate-400 mb-2" />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">
                  {selectedFile ? selectedFile.name : 'Choose PDF or TXT filing'}
                </span>
                <span className="text-[9px] text-slate-400 mt-1">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Max capacity 32MB'}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.txt,.xlsx,.csv"
                />
              </div>

              {/* Upload Submit button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 mt-2"
                disabled={!selectedFile}
              >
                Upload Document
              </Button>
            </form>
          </div>
        </div>

        {/* Recent Uploads & Processing Status (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Uploads table */}
          <div className="enterprise-card p-6 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-semibold text-sm font-jakarta text-slate-950 dark:text-white">
                Recent Ingestions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase font-manrope tracking-wider">
                    <th className="py-3 px-4">Document Name</th>
                    <th className="py-3 px-4">Workspace</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Ingestion Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <FileText className="text-slate-400 shrink-0" size={14} />
                          <span className="truncate max-w-[180px]">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">{doc.company}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-manrope">{doc.size}</td>
                      <td className="py-3.5 px-4 text-slate-400">{doc.uploadedAt}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium text-[9px] ${
                          doc.status === 'indexed' ? 'bg-success/10 text-success' :
                          doc.status === 'indexing' ? 'bg-primary/10 text-primary animate-pulse' :
                          'bg-danger/10 text-danger'
                        }`}>
                          {doc.status === 'indexed' && <CheckCircle2 size={10} />}
                          {doc.status === 'indexing' && <Clock size={10} className="animate-spin" />}
                          {doc.status === 'failed' && <AlertTriangle size={10} />}
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={doc.status === 'indexing'}
                          className="p-1 text-slate-400 hover:text-danger rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
