import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileArchive, Sparkles, Download, Eye, Trash2, Calendar, ChevronDown } from 'lucide-react';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';

const initialReportsList = [];

export const Reports = () => {
  const { activeSession, activeSessionId, setActiveSessionId, sessions, addNotification, reports, setReports } = useApp();
  const [reportTitle, setReportTitle] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (sessions.length === 0) {
    return (
      <div className="space-y-6 page-transition-wrapper">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Financial Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Build and access analyst-style PDF briefs and summaries compiled by the Report Agent.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 enterprise-card bg-white p-8">
          <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
            <FileArchive size={32} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Active Workspaces</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              You must create a research workspace first before compiling reports. Go to the Dashboard or Workspace tab to initialize one.
            </p>
          </div>
        </div>
      </div>
    );
  }


  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    setIsGenerating(true);
    addNotification('Report Agent compiling financial modules...', 'info');

    setTimeout(() => {
      const newReport = {
        id: `rep-${Date.now()}`,
        title: reportTitle,
        company: activeSession?.company || 'Apple Inc.',
        ticker: activeSession?.ticker || 'AAPL',
        date: new Date().toISOString().split('T')[0],
        category: 'Analyst PDF',
        author: 'Report Agent v2.1',
        content: `# FINANCIAL BRIEF: ${reportTitle.toUpperCase()}
## Structured Analysis for ${activeSession?.company || 'Apple Inc.'}

**Date:** ${new Date().toISOString().split('T')[0]}  
**Subject Company:** ${activeSession?.company || 'Apple Inc.'} (${activeSession?.ticker || 'AAPL'})  
**Valuation Verdict:** EVALUATED  
**Orchestration:** Multi-Agent Financial Research System

---

### Executive Commentary
This analyst-style report details observations compiled by the Document, Extraction, and Red Flag agents.

### Core Metrics Summary
* Assets: Evaluated within industry ranges.
* Operating Income: Stable.
* Cash Position: Liquid asset reserve confirmed.

### Auditor Concerns
Supply chain liabilities and inventory obligations require active oversight.`
      };

      setReports(prev => [newReport, ...prev]);
      setReportTitle('');
      setIsGenerating(false);
      addNotification('Analyst report generated successfully.', 'success');
    }, 2000);
  };

  const handleDownload = (title) => {
    addNotification(`Exporting "${title}" to PDF...`, 'info');
    setTimeout(() => {
      addNotification('Download completed.', 'success');
    }, 1200);
  };

  const handleDelete = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    addNotification('Report deleted.', 'info');
  };

  const handlePreviewReport = (report) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
          Financial Reports
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Build and access analyst-style PDF briefs and summaries compiled by the Report Agent.
        </p>
      </div>

      {/* Generator Form */}
      <div className="enterprise-card p-6">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-manrope block mb-3">
          Generate New Investment Brief
        </span>

        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Workspace selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-manrope">
              Active Workspace
            </label>
            <div className="relative">
              <select
                value={activeSessionId}
                onChange={(e) => setActiveSessionId(e.target.value)}
                className="w-full h-10 pl-3 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-primary cursor-pointer appearance-none"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.company} ({s.ticker})</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Report Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-manrope">
              Report Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Gross Margin FX Risk Analysis"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:border-primary"
            />
          </div>

          {/* Generate Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full h-10"
              Icon={Sparkles}
              loading={isGenerating}
              disabled={!reportTitle.trim()}
            >
              Generate PDF
            </Button>
          </div>
        </form>
      </div>

      {/* Reports Table Card */}
      <div className="enterprise-card p-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <h3 className="font-semibold text-sm font-jakarta text-slate-950 dark:text-white">
            Generated Reports
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase font-manrope tracking-wider bg-slate-50/50 dark:bg-slate-800/10">
                <th className="py-3 px-4">Report Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Compiled By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileArchive size={14} className="text-slate-400 shrink-0" />
                    <span>{report.title}</span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-650 dark:text-slate-300">
                    {report.company} ({report.ticker})
                  </td>
                  <td className="py-4 px-4 text-slate-400">{report.date}</td>
                  <td className="py-4 px-4 text-slate-400 font-manrope">{report.author}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => handlePreviewReport(report)}
                        size="xs"
                        variant="outline"
                        Icon={Eye}
                      >
                        Preview
                      </Button>
                      <Button
                        onClick={() => handleDownload(report.title)}
                        size="xs"
                        variant="secondary"
                        Icon={Download}
                      >
                        Download
                      </Button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-1.5 text-slate-400 hover:text-danger rounded hover:bg-slate-100 dark:hover:bg-slate-855 transition-colors cursor-pointer"
                        title="Delete Report"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedReport && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={selectedReport.title}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span>Compiler Engine: {selectedReport.author}</span>
              <span>Date Compiled: {selectedReport.date}</span>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl max-h-[50vh] overflow-y-auto border border-slate-200 dark:border-slate-800 select-text">
              <pre className="text-xs font-sans text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedReport.content}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => setIsPreviewOpen(false)} variant="outline" size="sm">
                Close
              </Button>
              <Button onClick={() => handleDownload(selectedReport.title)} variant="primary" size="sm" Icon={Download}>
                Save PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Reports;
