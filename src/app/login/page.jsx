'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.67 3.67 0 01-1.6 2.41v2h2.58c1.51-1.39 2.4-3.44 2.4-5.87z" fill="#4285F4"/>
      <path d="M8 16c2.16 0 3.97-.71 5.3-1.94l-2.58-2a4.8 4.8 0 01-7.15-2.52H.96v2.07A8 8 0 008 16z" fill="#34A853"/>
      <path d="M3.57 9.54A4.8 4.8 0 013.32 8c0-.53.09-1.05.25-1.54V4.39H.96A8 8 0 000 8c0 1.29.31 2.51.96 3.61l2.61-2.07z" fill="#FBBC05"/>
      <path d="M8 3.2c1.22 0 2.31.42 3.17 1.24l2.37-2.37A8 8 0 00.96 4.39L3.57 6.46A4.8 4.8 0 018 3.2z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('signin'); // signin | signup | forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function switchMode(next) {
    setMode(next);
    setError('');
    setSuccess('');
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError('');
    let supabase;
    try {
      supabase = createClient();
    } catch (err) {
      setError(err.message);
      setGoogleLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let supabase;
    try {
      supabase = createClient();
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/callback?next=/auth/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Check your email — we sent a password reset link.');
      }
      setLoading(false);
      return;
    }

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setLoading(false);
        setMode('signin');
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-600">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">Dropiq</span>
        </div>

        {/* Card */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-7">
          <h1 className="text-lg font-semibold text-white mb-1">
            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {mode === 'signin'
              ? 'Sign in to your Dropiq account'
              : mode === 'signup'
              ? 'Start generating copy and ad scripts in minutes'
              : "Enter your email and we'll send a reset link"}
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-4">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
              <Mail size={14} className="shrink-0" />
              {success}
            </div>
          )}

          {/* Google button — only on signin/signup */}
          {mode !== 'forgot' && (
            <>
              <button
                onClick={handleGoogle}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 rounded-lg text-sm font-medium transition-colors mb-4"
              >
                {googleLoading ? <Loader2 size={16} className="animate-spin text-slate-600" /> : <GoogleIcon />}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#1e1e2e]" />
                <span className="text-xs text-slate-600">or</span>
                <div className="flex-1 h-px bg-[#1e1e2e]" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[#0d0d15] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-600/50 focus:ring-1 focus:ring-violet-600/30 transition-colors"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-400">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-slate-500 hover:text-violet-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-[#0d0d15] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-600/50 focus:ring-1 focus:ring-violet-600/30 transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : mode === 'signin' ? (
                'Sign in'
              ) : mode === 'signup' ? (
                'Create account'
              ) : (
                'Send reset link'
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            {mode === 'forgot' ? (
              <button
                onClick={() => switchMode('signin')}
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Back to sign in
              </button>
            ) : mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          Free during beta · No credit card required
        </p>
        <p className="text-center text-xs text-slate-700 mt-2">
          <a href="/privacy" className="hover:text-slate-500 transition-colors">Privacy Policy</a>
          {' · '}
          <a href="/terms" className="hover:text-slate-500 transition-colors">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
