import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Search,
  Upload,
  Trash,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import Button from '../components/Common/Button';

export const Documents = () => {
  const { documents, setDocuments, uploadFile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleDeleteDoc = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || d.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Document Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse and manage all SEC filings, transcript records, and analyst briefings loaded into the AI context.
          </p>
        </div>
        <div>
          <Button onClick={handleUploadClick} Icon={Upload} variant="primary">
            Upload Document
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt,.xlsx,.csv"
          />
        </div>
      </div>

      {/* Filters and Search toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-100/50 dark:bg-slate-900/50 text-xs rounded-xl border border-transparent focus:border-brand-blue/30 focus:bg-white dark:focus:bg-slate-950 focus:shadow text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold font-manrope uppercase tracking-wider">Status:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 pl-3 pr-8 text-xs bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 rounded-xl text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="All">All Documents</option>
              <option value="Indexed">Indexed</option>
              <option value="Indexing">Indexing</option>
              <option value="Failed">Failed</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 font-semibold uppercase font-manrope tracking-wider bg-slate-50/55 dark:bg-slate-900/20">
                <th className="py-3 px-5">Document Name</th>
                <th className="py-3 px-5">Company Target</th>
                <th className="py-3 px-5">Size</th>
                <th className="py-3 px-5">Uploaded Date</th>
                <th className="py-3 px-5">State</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900/50">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-100/30 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <FileText className="text-slate-400 shrink-0" size={16} />
                        <span className="truncate max-w-xs">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300 font-medium">
                      {doc.company}
                    </td>
                    <td className="py-3.5 px-5 text-slate-400 font-manrope">{doc.size}</td>
                    <td className="py-3.5 px-5 text-slate-400">{doc.uploadedAt}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium text-[9px] ${
                        doc.status === 'indexed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        doc.status === 'indexing' ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 animate-pulse' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {doc.status === 'indexed' && <CheckCircle size={10} />}
                        {doc.status === 'indexing' && <Clock size={10} className="animate-spin" />}
                        {doc.status === 'failed' && <AlertCircle size={10} />}
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Reviewing details for: ${doc.name}`)}
                          className="p-1 text-slate-400 hover:text-brand-blue rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Open document details"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Remove document"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No documents found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;
