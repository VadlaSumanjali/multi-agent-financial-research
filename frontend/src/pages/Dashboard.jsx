import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FileUp,
  Table,
  AlertTriangle,
  GitCompare,
  MessageSquare,
  FileCheck,
  FolderKanban,
  FileText,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import Button from '../components/Common/Button';

export const Dashboard = () => {
  const { sessions, documents } = useApp();
  const navigate = useNavigate();

  // The six core modules
  const modules = [
    {
      title: 'Document Ingestion',
      description: 'Ingest and index SEC 10-K, 10-Q reports, and earnings transcripts into the vector index.',
      icon: FileUp,
      badge: 'Pending Ingestion'
    },
    {
      title: 'Financial Extraction',
      description: 'Extract balance sheets, income statements, capital expenditures, and custom margins.',
      icon: Table,
      badge: 'Pending Ingestion'
    },
    {
      title: 'Red Flag Scan',
      description: 'Identify accounting anomalies, litigation threats, and risk disclosure variables.',
      icon: AlertTriangle,
      badge: 'Pending Ingestion'
    },
    {
      title: 'Cross-Company Comparison',
      description: 'Benchmark margins, valuations, leverage multiples, and performance ratios side-by-side.',
      icon: GitCompare,
      badge: 'Pending Ingestion'
    },
    {
      title: 'Interactive Chat',
      description: 'Query financial footnote details and balance sheet variables via the multi-agent console.',
      icon: MessageSquare,
      badge: 'Pending Ingestion'
    },
    {
      title: 'Analyst Report Generation',
      description: 'Draft, format, and compile professional print-ready investment briefs and PDF summaries.',
      icon: FileCheck,
      badge: 'Pending Ingestion'
    }
  ];

  const hasDocuments = documents.length > 0;

  return (
    <div className="space-y-8 page-transition-wrapper p-6 max-w-7xl mx-auto select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 tracking-tight">
            Financial Research Center
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Deploy specialized multi-agent squads to parser corporate filings, extract balance sheet metrics, scan risk footnotes, and compile reports.
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <Button
            onClick={() => navigate('/upload')}
            Icon={Plus}
            variant="primary"
            className="shadow-md shadow-blue-200"
          >
            Upload Financial Document
          </Button>
        </div>
      </div>

      {/* Grid: Main Dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Modules (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope">
              Analysis Modules
            </h3>
            {!hasDocuments && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-semibold font-manrope uppercase">
                Awaiting Document Upload
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod, idx) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between opacity-65 relative overflow-hidden transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400">
                        <IconComp size={18} />
                      </div>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-manrope border border-slate-200/50">
                        {mod.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-slate-455 mt-1.5 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-manrope">
                    Unavailable
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar placeholders (1 Column) */}
        <div className="space-y-6">
          {/* Active Workspaces Overview */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <FolderKanban size={14} className="text-slate-400" />
              Active Contexts
            </h3>

            {sessions.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-400 font-medium">No active workspaces</p>
                <p className="text-[9px] text-slate-400 max-w-[180px] mx-auto leading-normal">
                  Create a new session in the research tab to map document contexts.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.slice(0, 3).map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => navigate('/workspace')}
                    className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl transition-colors cursor-pointer flex justify-between items-center"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-slate-800 truncate">{sess.title}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{sess.company}</p>
                    </div>
                    <ArrowRight size={12} className="text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ingested Documents List */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <FileText size={14} className="text-slate-400" />
              Corpus Index
            </h3>

            {documents.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-400 font-medium">Corpus empty</p>
                <p className="text-[9px] text-slate-400 max-w-[180px] mx-auto leading-normal">
                  Uploaded filings will be listed in the local vector cache.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.slice(0, 4).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-white border border-slate-150 rounded-xl flex items-center justify-between text-xs shadow-sm"
                  >
                    <div className="min-w-0 pr-2 flex items-center gap-2">
                      <FileText size={13} className="text-slate-450 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{doc.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-manrope font-medium shrink-0">
                      {doc.size}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
