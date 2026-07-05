import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileArchive, Sparkles, Download, Eye, Calendar, Printer, Search, FileText } from 'lucide-react';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';

const reportsCatalog = [
  {
    id: 'rep-1',
    title: 'Apple Inc. Q3 2026 Margin & FX Risk Brief',
    company: 'Apple Inc.',
    ticker: 'AAPL',
    date: '2026-07-05',
    category: 'Earnings Brief',
    author: 'Report Agent v2.1',
    content: `# INVESTMENT BRIEF: APPLE INC. (AAPL)
## Analysis of Q3 2026 Margin Performance and FX Headwinds

**Date:** July 5, 2026  
**Subject Company:** Apple Inc. (AAPL)  
**Valuation Verdict:** OVERWEIGHT  
**Analyst Engine:** Multi-Agent Financial Research System  

---

### 1. Gross Margin Performance & Services Mix
Apple reported a consolidated **Gross Margin of 46.2%** for Q3 2026, marking a 60 bps expansion year-over-year. The core driver is the increasing weight of **Services Revenue**, which reached **$24.9B (74.1% Gross Margin)**.

\`\`\`
Services Contribution: 27.3% of Total Sales
Products Gross Margin: 36.1%
Services Gross Margin: 74.1%
Consolidated:         46.2%
\`\`\`

### 2. Risk Areas & Warning Signs
* **Foreign Exchange Drag:** Unfavorable currency adjustments reduced international gross margins by **110 bps** YoY.
* **Capital Commitments:** Supply chain purchase obligations for next-generation silicon increased **18% YoY**, creating potential oversupply risks if consumer demand in major segments softs in H2 2026.`
  },
  {
    id: 'rep-2',
    title: 'Tesla Inc. Q1 2026 Footnotes Audit & Credit Dependance',
    company: 'Tesla Inc.',
    ticker: 'TSLA',
    date: '2026-07-04',
    category: 'Footnotes Audit',
    author: 'Red Flag Agent v1.5',
    content: `# AUDIT REPORT: TESLA INC. (TSLA)
## Footnote Disclosure Quality and Earnings Sustainability Review

**Date:** July 4, 2026  
**Subject Company:** Tesla Inc. (TSLA)  
**Valuation Verdict:** NEUTRAL  
**Analyst Engine:** Red Flag Auditor  

---

### 1. Quality of Earnings & Regulatory Credits
Tesla recognized **$480M of regulatory credit revenue** in Q1 2026. Without these high-margin credits, automotive margins would have compressed to **15.2%** instead of the reported **17.4%**. 

* **Concentration Risk:** Peer legacy manufacturers are ramping EVs in Europe and China, likely depressing credit purchasing rates in Q3/Q4.

### 2. Warranty Reserves Adjustment
We noted a **4% decrease** in warranty reserves per delivery. If historic averages persist, this minor reserve change could boost Q1 Operating Income artificially by roughly **$35M**.`
  }
];

export const Reports = () => {
  const { theme, addNotification } = useApp();
  const [reports, setReports] = useState(reportsCatalog);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePreviewReport = (report) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  const handleDownload = (title) => {
    addNotification(`Exporting ${title} to PDF...`, 'info');
    setTimeout(() => {
      addNotification(`Downloaded successfully.`, 'success');
    }, 1500);
  };

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Markdown-lite helper for preview modal
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-bold font-jakarta text-slate-900 dark:text-white mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-base font-bold font-jakarta text-slate-800 dark:text-slate-200 mt-3 mb-1.5">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-semibold font-jakarta text-brand-blue mt-2 mb-1">{line.substring(4)}</h3>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={idx} className="ml-4 list-disc text-xs text-slate-600 dark:text-slate-300 my-0.5">{line.substring(2)}</li>;
      }
      if (line.startsWith('\`\`\`')) {
        return null; // Skip code fence
      }
      if (line.startsWith('Services') || line.startsWith('Products') || line.startsWith('Consolidated')) {
        return <pre key={idx} className="bg-slate-950 p-2 text-[10px] text-emerald-400 font-mono rounded-lg my-1.5">{line}</pre>;
      }
      return <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 my-1.5 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Generated Research Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access formatted investment briefings, financial audits, and multi-agent synthesis summaries.
          </p>
        </div>
        <div>
          <Button
            onClick={() => alert('Use Workspace prompt or files to trigger Report Agent generation')}
            Icon={Sparkles}
            variant="primary"
          >
            Draft New Report
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-100/50 dark:bg-slate-900/50 text-xs rounded-xl border border-transparent focus:border-brand-blue/30 focus:bg-white dark:focus:bg-slate-950 focus:shadow text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-brand-blue/10 text-brand-blue uppercase font-manrope">
                  {report.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar size={12} />
                  {report.date}
                </span>
              </div>
              <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white leading-snug group-hover:text-brand-blue transition-colors">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-normal">
                {report.content.substring(0, 200).replace(/[#*_-]/g, '')}...
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">By: {report.author}</span>
              <div className="flex items-center gap-1.5">
                <Button
                  onClick={() => handlePreviewReport(report)}
                  size="xs"
                  variant="outline"
                  Icon={Eye}
                >
                  View
                </Button>
                <Button
                  onClick={() => handleDownload(report.title)}
                  size="xs"
                  variant="secondary"
                  Icon={Download}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={selectedReport.title}
          size="lg"
        >
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
              <span>Author: {selectedReport.author}</span>
              <span>Date: {selectedReport.date}</span>
            </div>

            {/* Content area */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-xl max-h-[50vh] overflow-y-auto border border-slate-200/40 dark:border-slate-800/40 select-text">
              {renderMarkdown(selectedReport.content)}
            </div>

            {/* Print/Download Footer */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
              <Button onClick={() => window.print()} variant="outline" size="sm" Icon={Printer}>
                Print Brief
              </Button>
              <Button onClick={() => handleDownload(selectedReport.title)} variant="primary" size="sm" Icon={Download}>
                Save as PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Reports;
