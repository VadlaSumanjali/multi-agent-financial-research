import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import Button from '../components/Common/Button';

export const Signup = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser(email || 'analyst@goldman.com', password);
      navigate('/');
    }, 1000);
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
            <span className="text-xs font-semibold text-slate-500">Creating secure node...</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-primary">
            <Shield size={18} />
          </div>
          <h2 className="text-base font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Register Analyst
          </h2>
          <p className="text-[9px] text-slate-400 font-semibold font-manrope uppercase tracking-wider">
            Establish Secure Vector Access context
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/5 text-danger text-xs rounded-lg border border-red-500/20 leading-relaxed">
              {error}
            </div>
          )}

          <div>
            <label className={labelClasses}>Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Shiva Kumar"
              className={inputBase}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              required
              placeholder="analyst@goldman.com"
              className={inputBase}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClasses}>Phone Number</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              className={inputBase}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClasses}>Secure Password</label>
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
            Create Profile
          </Button>
        </form>

        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-semibold font-manrope uppercase">
            Already registered?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline font-bold ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
