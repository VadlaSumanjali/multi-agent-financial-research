import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, User, Sparkles, AlertCircle } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatPanel = () => {
  const { activeSession, addMessageToSession } = useApp();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addMessageToSession(inputText.trim());
    setInputText('');
  };

  const messages = activeSession?.messages || [];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope">
          Analyst Conversation
        </h3>
        {activeSession && (
          <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold font-manrope uppercase">
            Active: {activeSession.company}
          </span>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-full">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Ask questions about the uploaded financial report
              </p>
              <p className="text-[10px] text-slate-400 max-w-[220px] mx-auto mt-1 leading-relaxed">
                Query operating metrics, capital adequacy, red flags, or specific note disclosures.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-3 max-w-[85%] ${
                      isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border ${
                      isUser
                        ? 'bg-slate-100 border-slate-200 text-slate-500'
                        : 'bg-blue-600 border-transparent text-white'
                    }`}>
                      {isUser ? <User size={12} /> : <Sparkles size={12} />}
                    </div>

                    {/* Content Box */}
                    <div className="space-y-1">
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                        isUser
                          ? 'bg-slate-100/70 border-slate-200/50 text-slate-800 rounded-tr-none'
                          : 'bg-white border-slate-200 text-slate-850 rounded-tl-none shadow-sm'
                      }`}>
                        <div className="whitespace-pre-wrap font-sans select-text">
                          {msg.content}
                        </div>
                      </div>

                      {/* Msg Warning Footer for assistant */}
                      {!isUser && (
                        <div className="flex items-center gap-1 text-[9px] text-red-500 font-semibold pl-1">
                          <AlertCircle size={10} />
                          <span className="font-manrope uppercase">Connection Placeholder</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-150 flex gap-2 items-center bg-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={activeSession ? "Ask a financial question..." : "Initialize a session to start conversation"}
          disabled={!activeSession}
          className="flex-1 h-9 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim() || !activeSession}
          className="h-9 shrink-0 px-3 rounded-xl"
        >
          <Send size={14} />
        </Button>
      </form>
    </div>
  );
};

export default ChatPanel;
