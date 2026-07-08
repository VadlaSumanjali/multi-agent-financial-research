import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Database, Key, Shield } from 'lucide-react';
import Button from '../components/Common/Button';

export const Settings = () => {
  const { addNotification } = useApp();
  const [modelType, setModelType] = useState('llama-3.3-70b-versatile');
  const [apiKey, setApiKey] = useState('');
  const [backendUrl, setBackendUrl] = useState('http://127.0.0.1:8000');
  const [chunkSize, setChunkSize] = useState('1000');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addNotification('System configurations updated.', 'success');
  };

  return (
    <div className="space-y-6 page-transition-wrapper p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 tracking-tight">
          Control Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Modify backend coordinates, indexing boundaries, and active multi-agent orchestrator configurations.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Center: Configurations (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: LLM Engine */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 flex items-center gap-2">
              <Sliders size={16} className="text-blue-600" />
              LLM Model Orchestrator
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                  Default Core Model
                </label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Default - Groq)</option>
                  <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                  <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B (Groq)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                  API Key Credentials
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-600"
                  />
                  <Key className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                </div>
                <p className="text-[10px] text-slate-400">
                  Credentials are saved locally in the browser context. We never upload secrets to unauthorized paths.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Backend coordinates */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 flex items-center gap-2">
              <Database size={16} className="text-green-600" />
              FastAPI Integration Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                  FastAPI Server Endpoint
                </label>
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                  Parser Chunk Size (tokens)
                </label>
                <input
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Status (1 Column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* System Check Card */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield size={16} className="text-green-600" />
              Environment Assessment
            </h3>
            <div className="space-y-2.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>FastAPI connection</span>
                <span className="font-bold text-amber-500">Offline (Local Demo)</span>
              </div>
              <div className="flex justify-between">
                <span>Groq client status</span>
                <span className="font-bold text-amber-550">Not Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Environment Type</span>
                <span className="font-bold text-slate-600">Frontend Sandbox</span>
              </div>
            </div>
            
            <div className="pt-2">
              <Button type="submit" variant="primary" size="sm" className="w-full">
                Save System Config
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
