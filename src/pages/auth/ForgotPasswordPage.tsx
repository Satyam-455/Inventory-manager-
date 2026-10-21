import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="text-sm text-slate-400 mt-1">Enter your registered email address to receive password reset instructions</p>
      </div>

      {submitted ? (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-xl text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-sm font-semibold text-emerald-300">Reset link sent!</p>
          <p className="text-xs text-slate-300">Check your inbox ({email}) for instructions to reset your password.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-semibold shadow-lg transition-all"
          >
            Send Reset Instructions
          </button>
        </form>
      )}

      <div className="text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};
