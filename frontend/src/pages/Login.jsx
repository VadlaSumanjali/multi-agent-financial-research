import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Common/Button';

const API_BASE_URL = 'http://127.0.0.1:8000';

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="w-4 h-4 shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export const Login = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const [email, setEmail] = useState('analyst@goldman.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

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
        navigate('/');
      } else {
        const detail = data.detail || 'Login failed. Please check credentials.';
        setError(detail);
      }
    } catch (err) {
      console.warn("Backend down. Falling back to local auth.");
      loginUser(emailClean, passwordClean);
      navigate('/');
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

  const inputBase =
    'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all duration-200 outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs';
  const labelClasses =
    'block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 font-manrope';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden select-none">
      
      {/* Background Animated Gradient Assets */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-sm p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full glass-panel-dense p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden"
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

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 text-rose-500 text-xs rounded-lg border border-rose-500/25 space-y-3 select-text leading-relaxed">
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
                placeholder="shiva@gmail.com"
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
                navigate('/');
              }, 1000);
            }}
            variant="outline"
            className="w-full h-10 text-xs justify-center gap-2"
            Icon={GoogleIcon}
          >
            Sign In with Google Account
          </Button>

          {/* Signup Route toggle */}
          <div className="text-center pt-1 border-t border-slate-800/40">
            <p className="text-[10px] text-slate-400 font-bold font-manrope uppercase tracking-wider">
              New to Studlyf?{' '}
              <Link
                to="/signup"
                className="text-brand-blue hover:text-brand-blue-hover transition-colors ml-1 font-bold"
              >
                Create Account
              </Link>
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;
