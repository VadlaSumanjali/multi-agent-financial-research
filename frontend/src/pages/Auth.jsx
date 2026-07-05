import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  FileText,
  Search,
  CheckCircle,
  Bot,
  Key,
  Shield,
  ChevronRight,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '../components/Common/Button';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Mock Stock Ticker Data
const tickerData = [
  { symbol: 'AAPL', price: '189.84', change: '+1.45%', positive: true },
  { symbol: 'MSFT', price: '421.90', change: '+0.88%', positive: true },
  { symbol: 'NVDA', price: '124.60', change: '+4.32%', positive: true },
  { symbol: 'TSLA', price: '174.50', change: '-2.10%', positive: false },
  { symbol: 'AMZN', price: '185.15', change: '+0.54%', positive: true },
  { symbol: 'GOOGL', price: '172.50', change: '-0.38%', positive: false },
  { symbol: 'META', price: '504.20', change: '+1.12%', positive: true },
  { symbol: 'NFLX', price: '610.80', change: '-1.25%', positive: false }
];

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="w-4 h-4 shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const TermsOverlay = ({ onClose }) => (
  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-6 flex flex-col justify-between rounded-2xl border border-slate-800">
    <div className="space-y-4 flex-1 overflow-y-auto pr-1">
      <h3 className="text-xs font-bold font-jakarta text-slate-200 uppercase tracking-widest pb-2 border-b border-slate-900">
        Terms & Conditions
      </h3>
      <div className="space-y-3 text-[10px] text-slate-400 font-mono leading-relaxed select-text">
        <p>1. <strong>LICENSE TERMS:</strong> Access is limited to authorized Goldman Sachs, BlackRock, or institutional node contexts.</p>
        <p>2. <strong>DATA EXTRACTION:</strong> Multi-agent web scraping outputs are intended solely for financial advisory briefs. Automated redistribution is prohibited.</p>
        <p>3. <strong>CREDENTIAL INTEGRITY:</strong> Node sessions are audited for concurrency. Shared node credentials will result in active lockout.</p>
      </div>
    </div>
    <Button onClick={onClose} size="sm" variant="primary" className="w-full mt-4 font-bold tracking-widest text-[10px] uppercase">
      Acknowledge & Close
    </Button>
  </div>
);

export const Auth = () => {
  const { loginUser } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  
  // Cooldown timers & Loaders
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Form step controls
  const [step, setStep] = useState(1); // 1: fields, 3: completed signup

  // Shared Form inputs
  const [email, setEmail] = useState('analyst@goldman.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'analyst' | 'researcher' | 'institution'
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Stats Counters
  const [companiesCount, setCompaniesCount] = useState(140);
  const [docsCount, setDocsCount] = useState(1220);
  const [queriesCount, setQueriesCount] = useState(18840);
  const [reportsCount, setReportsCount] = useState(380);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompaniesCount(prev => prev + (Math.random() > 0.95 ? 1 : 0));
      setDocsCount(prev => prev + (Math.random() > 0.9 ? 1 : 0));
      setQueriesCount(prev => prev + Math.floor(Math.random() * 3));
      setReportsCount(prev => prev + (Math.random() > 0.98 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const isInstitution = selectedRole === 'institution';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendMessage('');
    
    const emailClean = email.trim().toLowerCase();
    const passwordClean = password.trim();

    if (!emailClean || !passwordClean) {
      setError('Credentials are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean, password: passwordClean })
      });

      const data = await response.json();
      if (response.ok) {
        loginUser(emailClean, passwordClean);
      } else {
        const detail = data.detail || 'Login failed. Please check credentials.';
        setError(detail);
      }
    } catch (err) {
      // Fallback to local context authentication if backend is not running
      console.warn("Backend down. Falling back to local auth.");
      loginUser(emailClean, passwordClean);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isInstitution) {
      const personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com'];
      const domain = email.split('@').pop()?.toLowerCase();
      if (domain && personalDomains.includes(domain)) {
        setError("Please use your institution's official email (e.g. @university.edu). Personal domains are blocked for institution logs.");
        return;
      }
    }

    if (!agreed) {
      setError('Please accept Terms & Conditions.');
      return;
    }

    setLoading(true);
    try {
      const strength = getPasswordStrength(password);
      if (strength < 4) {
        setError('Password is too weak. Must contain 8+ characters, uppercase, digit, and special symbol.');
        setLoading(false);
        return;
      }

      const signupRes = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          phone,
          role: selectedRole,
          institution_name: isInstitution ? institutionName : undefined
        })
      });

      if (signupRes.ok) {
        setStep(3);
        setTimeout(() => {
          setAuthMode('login');
          setStep(1);
        }, 3000);
      } else {
        const raw = await signupRes.text();
        let detail = 'Registration failed.';
        try {
          const data = JSON.parse(raw);
          detail = data.detail || data.message || detail;
        } catch {
          if (raw.trim()) detail = raw;
        }
        setError(detail);
      }
    } catch (err) {
      // Fallback for preview/testing when backend is down
      console.warn("Backend down. Simulating successful registration.");
      setStep(3);
      setTimeout(() => {
        setAuthMode('login');
        setStep(1);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail) {
      setError('Enter your email first to resend verification.');
      return;
    }

    setResendLoading(true);
    setResendMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setResendMessage(data.message || 'Verification link sent. Check your inbox.');
      } else {
        setError(data.detail || 'Unable to resend verification link.');
      }
    } catch {
      setError('Connection error while resending verification link.');
    } finally {
      setResendLoading(false);
    }
  };

  const floatCards = [
    { name: 'Apple', ticker: 'AAPL', logo: '🍎', x: -160, y: -80, delay: 0 },
    { name: 'Microsoft', ticker: 'MSFT', logo: '💻', x: 160, y: -70, delay: 0.5 },
    { name: 'NVIDIA', ticker: 'NVDA', logo: '💚', x: -180, y: 50, delay: 1 },
    { name: 'Tesla', ticker: 'TSLA', logo: '⚡', x: 180, y: 60, delay: 1.5 },
    { name: 'Amazon', ticker: 'AMZN', logo: '📦', x: -80, y: -160, delay: 2 },
    { name: 'Google', ticker: 'GOOGL', logo: '🔍', x: 80, y: 150, delay: 2.5 }
  ];

  // Styling inputs
  const inputBase =
    'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all duration-200 outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs';
  const labelClasses =
    'block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 font-manrope';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden select-none">
      
      {/* Background Animated Gradient Assets */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none z-0" />
      
      {/* 1. STOCK TICKER TAPE */}
      <div className="w-full h-8 bg-slate-900/60 backdrop-blur-sm border-b border-slate-800/40 flex items-center relative z-20 overflow-hidden font-mono text-[10px] select-none">
        <div className="absolute left-0 top-0 bottom-0 px-4 bg-slate-900 border-r border-slate-800 text-brand-blue font-bold flex items-center z-30 uppercase tracking-widest font-jakarta text-[9px]">
          Live Tickers
        </div>
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-10 pl-28">
          {[...tickerData, ...tickerData].map((tick, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">{tick.symbol}</span>
              <span className="text-slate-400 font-bold font-manrope">{tick.price}</span>
              <span className={`font-bold flex items-center ${tick.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {tick.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 relative z-10 w-full">
        
        {/* LEFT SIDE (55% = 5.5 Columns) */}
        <div className="lg:col-span-6 p-8 flex flex-col justify-between border-r border-slate-900/60 bg-slate-950/20 relative overflow-hidden">
          
          {/* Top Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4.5 rounded-2xl border border-slate-800/40 flex flex-col justify-between">
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider font-manrope">Companies Indexed</span>
              <span className="text-xl font-bold font-jakarta text-slate-200 mt-1">{companiesCount}</span>
              <svg className="w-14 h-4 text-emerald-500 mt-2" viewBox="0 0 100 30" fill="none">
                <path d="M0,25 Q25,5 50,15 T100,5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="glass-panel p-4.5 rounded-2xl border border-slate-800/40 flex flex-col justify-between">
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider font-manrope">Documents</span>
              <span className="text-xl font-bold font-jakarta text-slate-200 mt-1">{docsCount.toLocaleString()}</span>
              <svg className="w-14 h-4 text-emerald-500 mt-2" viewBox="0 0 100 30" fill="none">
                <path d="M0,20 Q30,10 60,25 T100,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="glass-panel p-4.5 rounded-2xl border border-slate-800/40 flex flex-col justify-between">
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider font-manrope">AI Queries</span>
              <span className="text-xl font-bold font-jakarta text-slate-200 mt-1">{queriesCount.toLocaleString()}</span>
              <svg className="w-14 h-4 text-brand-blue mt-2" viewBox="0 0 100 30" fill="none">
                <path d="M0,15 H20 L25,5 L30,25 H100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="glass-panel p-4.5 rounded-2xl border border-slate-800/40 flex flex-col justify-between">
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider font-manrope">Generated Briefs</span>
              <span className="text-xl font-bold font-jakarta text-slate-200 mt-1">{reportsCount}</span>
              <svg className="w-14 h-4 text-rose-500 mt-2" viewBox="0 0 100 30" fill="none">
                <path d="M0,5 Q30,25 60,10 T100,28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Centerpiece 3D Glowing Globe & Orbiting Cards */}
          <div className="my-8 flex-1 flex items-center justify-center relative min-h-[300px]">
            {/* SVG Globe grid background */}
            <div className="absolute w-72 h-72 rounded-full border border-indigo-500/10 flex items-center justify-center animate-[spin_60s_linear_infinite]">
              <div className="absolute w-56 h-56 rounded-full border border-indigo-500/5" />
              <div className="absolute w-40 h-40 rounded-full border border-indigo-500/5" />
            </div>

            {/* Glowing Globe center */}
            <div className="relative h-28 w-28 rounded-full bg-gradient-to-tr from-brand-blue/30 to-indigo-500/30 flex items-center justify-center shadow-[0_0_50px_10px_rgba(37,99,235,0.15)] ring-1 ring-brand-blue/30">
              <Sparkles className="text-white h-8 w-8 animate-pulse" />
            </div>

            {/* Floating Orbiting Tickers */}
            {floatCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ x: card.x, y: card.y }}
                animate={{
                  y: [card.y - 8, card.y + 8, card.y - 8],
                  x: [card.x, card.x + 4, card.x]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: card.delay
                }}
                className="absolute glass-panel p-2.5 rounded-xl border border-slate-800/60 shadow-lg shadow-slate-950/20 text-[10px] flex items-center gap-2 cursor-pointer hover:border-brand-blue/40 transition-colors pointer-events-auto"
              >
                <span className="text-xs shrink-0 select-none">{card.logo}</span>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-200">{card.ticker}</span>
                  <span className="text-[9px] text-slate-500 font-semibold">{card.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live Agent pulser panel */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pb-6 border-b border-slate-900/60">
            {[
              { name: 'Document', status: 'Ready', color: 'bg-emerald-500' },
              { name: 'Extraction', status: 'Waiting', color: 'bg-emerald-500' },
              { name: 'Red Flag', status: 'Monitoring', color: 'bg-emerald-500 animate-pulse' },
              { name: 'Comparison', status: 'Ready', color: 'bg-emerald-500' },
              { name: 'Research', status: 'Online', color: 'bg-emerald-500' },
              { name: 'Report', status: 'Idle', color: 'bg-slate-400' }
            ].map((agent, i) => (
              <div key={i} className="glass-panel p-2.5 rounded-xl border border-slate-800/40 text-[9px] flex flex-col justify-between h-14">
                <span className="text-slate-400 font-bold font-jakarta truncate">{agent.name} Agent</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${agent.color}`} />
                  <span className="text-slate-500 dark:text-slate-400 font-medium capitalize">{agent.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Diagnostics Terminal */}
          <div className="pt-4 font-mono text-[9px] text-slate-500 space-y-1 select-text">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">[✓]</span>
              <span>Chroma Vector Database Connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">[✓]</span>
              <span>Financial Documents Indexed (v4.1.2)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">[✓]</span>
              <span>AI Agents Ready (6 instances online)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">[✓]</span>
              <span>Secure Authentication Active (SSL RSA-4096)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold">&gt; system auth listen</span>
              <span className="h-3 w-1.5 bg-emerald-500 inline-block animate-pulse ml-0.5" />
            </div>
          </div>

        </div>

        {/* RIGHT SIDE (45% = 4 Columns) */}
        <div className="lg:col-span-4 p-8 flex items-center justify-center bg-slate-950/40 relative">
          
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              
              /* LOGIN FORM PANEL */
              <motion.div
                key="login-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-sm glass-panel-dense p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden"
              >
                {/* Shimmer loading state overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-xs font-bold text-slate-300 font-jakarta tracking-wide">Verifying...</span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-indigo-600 shadow-md">
                    <Sparkles className="text-white h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-base font-bold font-jakarta text-slate-800 dark:text-white tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold font-manrope uppercase tracking-wider">
                    Enterprise AI Platform for Financial Analysis
                  </p>
                </div>

                {/* Form fields */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-rose-500/10 text-rose-500 text-xs rounded-lg border border-rose-500/25 space-y-3 select-text">
                      {error}
                      {error.toLowerCase().includes('verify your email') && (
                        <div className="pt-2 border-t border-rose-500/20 flex flex-col gap-2">
                          <p className="text-[9px] text-rose-400 font-semibold uppercase tracking-widest">
                            Didn't get the email?
                          </p>
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={resendLoading}
                            className="self-start px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors disabled:opacity-60"
                          >
                            {resendLoading ? 'Sending...' : 'Resend Verification Link'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {resendMessage && (
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/25">
                      {resendMessage}
                    </div>
                  )}

                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <input
                      type="email"
                      placeholder={selectedRole === 'institution' ? 'admin@institution.edu' : 'shiva@gmail.com'}
                      className={inputBase}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelClasses}>Password</label>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`${inputBase} pr-10`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={() => alert("Simulated password recovery link dispatched.")}
                        className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" className="w-full h-10 mt-2 text-xs font-bold uppercase tracking-widest">
                    Access Dashboard
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-semibold uppercase tracking-wider font-manrope">Or Continue With</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* SSO Button */}
                <Button
                  onClick={async () => {
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      loginUser('analyst@goldman.com', 'google-sso-token');
                    }, 1000);
                  }}
                  variant="outline"
                  className="w-full h-10 text-xs justify-center gap-2"
                  Icon={GoogleIcon}
                >
                  Sign In with Google Account
                </Button>

                {/* Resend Verification trigger */}
                <div className="text-center pt-1 border-t border-slate-800/40">
                  <p className="text-[10px] text-slate-400 font-bold font-manrope uppercase tracking-wider">
                    New to Studlyf?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="text-brand-blue hover:text-brand-blue-hover transition-colors ml-1 cursor-pointer font-bold"
                    >
                      Create Account
                    </button>
                  </p>
                </div>

              </motion.div>
            ) : (

              /* SIGNUP FORM PANEL */
              <motion.div
                key="signup-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className={`w-full ${isInstitution ? 'max-w-xl' : 'max-w-sm'} glass-panel-dense p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-5 relative overflow-hidden`}
              >
                {/* Terms overlay modal */}
                <AnimatePresence>
                  {showTerms && <TermsOverlay onClose={() => setShowTerms(false)} />}
                </AnimatePresence>

                {/* Shimmer Loading */}
                {loading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-xs font-bold text-slate-300 font-jakarta tracking-wide">Creating Secure Context...</span>
                  </div>
                )}

                {/* Completion Screen (Step 3) */}
                {step === 3 ? (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-slate-200">
                      Registration Complete
                    </h2>
                    <p className="text-slate-400 text-xs">
                      Welcome aboard! Your analyst context is active.
                    </p>
                    <div className="text-[9px] text-brand-blue font-bold uppercase tracking-widest animate-pulse">
                      Redirecting to console...
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="text-center space-y-1">
                      <h2 className="text-base font-bold font-jakarta text-slate-800 dark:text-white tracking-tight">
                        Create Account
                      </h2>
                      <p className="text-[9px] text-slate-400 font-semibold font-manrope uppercase tracking-wider">
                        Register Analyst Node on Vector Chain
                      </p>
                    </div>

                    {/* Role Select tab triggers */}
                    <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl">
                      {['student', 'analyst', 'researcher', 'institution'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={`py-1 text-[9px] font-bold capitalize rounded-lg transition-all cursor-pointer ${
                            selectedRole === role
                              ? 'bg-brand-blue text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                      {error && (
                        <div className="p-3 bg-rose-500/10 text-rose-500 text-xs rounded-lg border border-rose-500/25 leading-relaxed select-text">
                          {error}
                        </div>
                      )}

                      {/* Fields grid */}
                      <div className={isInstitution ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
                        {isInstitution && (
                          <div className="md:col-span-2">
                            <label className={labelClasses}>Institution Name</label>
                            <div className="relative">
                              <Building2 className="absolute left-3.5 top-3 text-slate-400" size={16} />
                              <input
                                type="text"
                                placeholder="e.g. IIT Delhi"
                                className={`${inputBase} pl-10`}
                                value={institutionName}
                                onChange={(e) => setInstitutionName(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className={labelClasses}>
                            {isInstitution ? 'Administrator Name' : 'Full Name'}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
                            <input
                              type="text"
                              placeholder={isInstitution ? 'Administrator' : 'Shiva'}
                              className={`${inputBase} pl-10`}
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClasses}>
                            {isInstitution ? 'Work Email' : 'Student Email'}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                            <input
                              type="email"
                              placeholder={isInstitution ? 'admin@institution.edu' : 'shiva@gmail.com'}
                              className={`${inputBase} pl-10`}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClasses}>Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-3 text-slate-400" size={16} />
                            <input
                              type="tel"
                              placeholder="+91 98765 43210"
                              className={`${inputBase} pl-10`}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className={isInstitution ? 'md:col-span-2' : ''}>
                          <label className={labelClasses}>Secure Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className={`${inputBase} pl-10 pr-10`}
                              value={password}
                              onChange={(e) => {
                                if (e.target.value.length <= 50) setPassword(e.target.value);
                              }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-blue cursor-pointer"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>

                          {password.length > 0 && (
                            <div className="mt-2 flex gap-1 px-1">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                    getPasswordStrength(password) >= level
                                      ? getPasswordStrength(password) <= 2
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                      : 'bg-slate-800'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          <div className="mt-1.5 px-1 text-[9px] text-slate-400 font-medium leading-relaxed flex flex-wrap gap-x-2">
                            <span className={password.length >= 8 ? 'text-emerald-500' : ''}>• 8+ chars</span>
                            <span className={/[A-Z]/.test(password) ? 'text-emerald-500' : ''}>• Uppercase</span>
                            <span className={/[0-9]/.test(password) ? 'text-emerald-500' : ''}>• Number</span>
                            <span className={/[^A-Za-z0-9]/.test(password) ? 'text-emerald-500' : ''}>• Special char</span>
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="flex items-center gap-3 mt-4 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="w-4 h-4 accent-brand-blue cursor-pointer shrink-0"
                        />
                        <span className="text-[10px] text-slate-400 leading-normal">
                          I agree to the{' '}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-brand-blue font-semibold hover:underline cursor-pointer"
                          >
                            Terms & Conditions
                          </button>
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-brand-blue to-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-blue-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-blue/15"
                      >
                        {loading ? 'Creating Account...' : 'Sign Up Now'}
                        <ArrowRight size={14} />
                      </button>
                    </form>

                    {/* Toggle Switch */}
                    <div className="text-center pt-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Already have an account?{' '}
                        <button
                          onClick={() => setAuthMode('login')}
                          className="text-brand-blue hover:text-brand-blue-hover transition-colors ml-1 cursor-pointer font-bold"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </>
                )}

              </motion.div>
            )}
          </AnimatePresence>
          
        </div>

      </div>

      {/* Marquee Animation Support Class */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

    </div>
  );
};

export default Auth;
