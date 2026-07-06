import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Database, Key, Shield, Sun, Moon } from 'lucide-react';
import Button from '../components/Common/Button';

export const Settings = () => {
  const { theme, toggleTheme, addNotification } = useApp();
  const [modelType, setModelType] = useState('llama-3.3-70b-versatile');
  const [apiKey, setApiKey] = useState('');
  const [backendUrl, setBackendUrl] = useState('http://127.0.0.1:8000');
  const [chunkSize, setChunkSize] = useState('1000');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addNotification('System configurations updated.', 'success');
  };

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
          Control Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Modify backend coordinates, indexing boundaries, and active multi-agent orchestrator configurations.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Center: Configurations (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: LLM Engine */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
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
                  className="w-full h-10 px-3 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary cursor-pointer"
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
                    className="w-full h-10 pl-3 pr-10 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:border-primary"
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
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white flex items-center gap-2">
              <Database size={16} className="text-success" />
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
                  className="w-full h-10 px-3 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:border-primary"
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
                  className="w-full h-10 px-3 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Theme & Status (1 Column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Theme card */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Visual Options
            </h3>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
                {theme === 'dark' ? 'Dark theme' : 'Light theme'}
              </div>
              <Button onClick={toggleTheme} size="xs" variant="outline">
                Switch Mode
              </Button>
            </div>
          </div>

          {/* System Check Card */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Shield size={16} className="text-success" />
              Environment Assessment
            </h3>
            <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>FastAPI connection</span>
                <span className="font-bold text-warning">Offline (using mock)</span>
              </div>
              <div className="flex justify-between">
                <span>Groq client status</span>
                <span className="font-bold text-success">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Local indexing corpus</span>
                <span className="font-bold text-slate-700 dark:text-slate-350">6 documents active</span>
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
