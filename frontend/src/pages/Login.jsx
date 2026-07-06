import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import Button from '../components/Common/Button';

export const Login = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('analyst@goldman.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const emailClean = email.trim().toLowerCase();
    const passwordClean = password.trim();

    if (!emailClean || !passwordClean) {
      setError('Credentials are required.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser(emailClean, passwordClean);
      navigate('/');
    }, 800);
  };

  const inputBase =
    'w-full px-3 py-2 bg-white border border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary transition-all duration-200 outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs';
  const labelClasses =
    'block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 font-manrope';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 select-none font-sans">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-50 flex flex-col items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-semibold text-slate-500">Verifying session...</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-primary">
            <Shield size={18} />
          </div>
          <h2 className="text-base font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            multiagent login
          </h2>
          <p className="text-[9px] text-slate-400 font-semibold font-manrope uppercase tracking-wider">
            Secure analyst authentication portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/5 text-danger text-xs rounded-lg border border-red-500/20 leading-relaxed">
              {error}
            </div>
          )}

          <div>
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              placeholder="analyst@goldman.com"
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
                className="absolute right-3 top-2.5 text-slate-400 hover:text-primary transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full h-10 mt-2 text-xs font-bold uppercase tracking-widest">
            Enter Workspace
          </Button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[8px] text-slate-400 font-semibold uppercase tracking-wider font-manrope">SSO Credential Node</span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
        </div>

        {/* Bypass SSO */}
        <Button
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              loginUser('analyst@goldman.com', 'google-sso-token');
              navigate('/');
            }, 600);
          }}
          variant="outline"
          className="w-full h-10 text-xs justify-center gap-2"
        >
          Sign In with Goldman Node
        </Button>
      </div>
    </div>
  );
};

export default Login;
