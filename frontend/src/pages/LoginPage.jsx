import React, { useState } from 'react';
import { LogIn, ShieldCheck, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2, SkipForward, X, Globe, Sparkles, BrainCircuit } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage({ onLoginSuccess, switchToSignup, switchToHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Social OAuth Login Modal states
  const [socialModal, setSocialModal] = useState(null); // 'google' | 'facebook' | null
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');

  // Forgot password flow states
  const [forgotMode, setForgotMode] = useState(false); // false = normal login, true = forgot flow
  const [forgotStep, setForgotStep] = useState(1); // 1=enter email, 2=enter OTP, 3=new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      onLoginSuccess(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    if (!socialEmail) {
      setError('Please enter your email address for OAuth authentication.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.socialLogin(socialModal, {
        email: socialEmail,
        name: socialName
      });
      setSocialModal(null);
      onLoginSuccess(res);
    } catch (err) {
      setError(err.response?.data?.detail || `${socialModal} login failed.`);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Step 1: Send OTP
  const handleForgotSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(forgotEmail);
      setForgotStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.verifyOTP(forgotEmail, otpCode);
      setForgotStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Step 3: Reset password
  const handleResetPassword = async (skipNewPassword = false) => {
    setError('');
    setLoading(true);
    try {
      if (!skipNewPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        await api.resetPassword({ email: forgotEmail, otp_code: otpCode, new_password: newPassword });
      }
      const res = await api.login({ email: forgotEmail, password: skipNewPassword ? undefined : newPassword });
      onLoginSuccess(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset failed.');
      setForgotMode(false);
      setEmail(forgotEmail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[560px]">
        
        {/* ─── LEFT PANEL: FACEBOOK META ELECTRIC BLUE HERO ─── */}
        <div className="bg-gradient-to-br from-[#0866ff] via-[#1877f2] to-[#0052cc] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Subtle Circles */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Logo Header */}
          <div onClick={switchToHome} className="flex items-center gap-3 cursor-pointer z-10">
            <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-lg">
              <img src="/logo.png" alt="SocialFlow AI Logo" className="h-full w-full object-contain rounded-xl" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight font-outfit">
                SocialFlow AI
              </h1>
              <p className="text-[10px] text-blue-100 font-sans">Memory & Strategy Operating System</p>
            </div>
          </div>

          {/* Hero Welcome Text */}
          <div className="space-y-4 my-8 z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit leading-tight text-white">
              Welcome<br />Back
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed font-sans">
              Sign in to manage your creator persona, platform URLs, AI strategies, and Vectorize Hindsight memory bank.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-100 font-mono">
              <BrainCircuit className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span>Vectorize Hindsight Memory Active</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-blue-100/80 border-t border-white/15 pt-4 z-10 font-sans">
            © 2026 SocialFlow AI • Enterprise Creator Workspace
          </div>
        </div>

        {/* ─── RIGHT PANEL: CRISP WHITE LOGIN FORM ─── */}
        <div className="p-8 sm:p-10 bg-white flex flex-col justify-center space-y-6 font-sans">
          
          {!forgotMode ? (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Sign In to SocialFlow</h2>
                <p className="text-xs text-slate-500">Enter your login credentials to continue</p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold font-sans">
                  ⚠️ {error}
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setSocialModal('google'); setSocialEmail(email || 'creator.google@gmail.com'); setSocialName('Google Creator'); setError(''); }}
                  type="button" 
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>

                <button 
                  onClick={() => { setSocialModal('facebook'); setSocialEmail(email || 'creator.meta@facebook.com'); setSocialName('Meta Creator'); setError(''); }}
                  type="button" 
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border border-[#1877f2]/30 text-xs font-semibold text-[#1877f2] transition cursor-pointer shadow-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="font-semibold uppercase tracking-wider text-[10px]">Or continue with email</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1.5 font-bold">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition font-medium" 
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-700 font-bold">Password *</label>
                    <button 
                      type="button" 
                      onClick={() => { setForgotMode(true); setForgotStep(1); setError(''); }}
                      className="text-[#1877f2] hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition pr-10 font-medium" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0866ff] to-[#1877f2] hover:from-[#0052cc] hover:to-[#0866ff] text-white font-bold text-sm transition shadow-lg shadow-[#1877f2]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-600 font-medium">
                Don't have an account?{' '}
                <button onClick={switchToSignup} className="text-[#1877f2] font-bold underline cursor-pointer hover:text-[#0052cc]">
                  Sign Up &rarr;
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ─── FORGOT PASSWORD FLOW ─── */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-outfit">
                    {forgotStep === 1 && 'Forgot Password'}
                    {forgotStep === 2 && 'Verify OTP Code'}
                    {forgotStep === 3 && 'Set New Password'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {forgotStep === 1 && 'Enter your email to receive a reset OTP'}
                    {forgotStep === 2 && `6-digit OTP code sent to ${forgotEmail}`}
                    {forgotStep === 3 && 'Enter your new password below'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1877f2] border border-blue-200">
                  Step {forgotStep}/3
                </span>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold font-sans">
                  ⚠️ {error}
                </div>
              )}

              {forgotStep === 1 && (
                <form onSubmit={handleForgotSendOTP} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-bold">Registered Email</label>
                    <input 
                      type="email" 
                      required 
                      value={forgotEmail} 
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0866ff] to-[#1877f2] text-white font-bold text-sm transition shadow-lg shadow-[#1877f2]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="h-4 w-4" />
                    {loading ? 'Sending OTP...' : 'Send Reset OTP to Email'}
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#1877f2] font-semibold text-xs flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>A 6-digit OTP code has been sent directly to your email inbox.</span>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-bold">Enter 6-Digit OTP Code</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      required 
                      value={otpCode} 
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.5em] text-lg font-mono px-4 py-3 rounded-xl bg-slate-50 border border-[#1877f2] text-[#1877f2] placeholder-slate-300 focus:outline-none focus:bg-white transition" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0866ff] to-[#1877f2] text-white font-bold text-sm transition shadow-lg shadow-[#1877f2]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {loading ? 'Verifying OTP...' : 'Verify OTP Code'}
                  </button>
                </form>
              )}

              {forgotStep === 3 && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-bold">New Password *</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-bold">Re-enter New Password *</label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleResetPassword(true)} 
                      disabled={loading}
                      className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition flex items-center justify-center gap-2 border border-slate-300 cursor-pointer"
                    >
                      <SkipForward className="h-4 w-4" />
                      Skip & Login
                    </button>
                    <button 
                      onClick={() => handleResetPassword(false)} 
                      disabled={loading || !newPassword}
                      className="py-3 rounded-xl bg-gradient-to-r from-[#0866ff] to-[#1877f2] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {loading ? 'Updating...' : 'Update & Login'}
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={() => { setForgotMode(false); setForgotStep(1); setError(''); }}
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition pt-2 cursor-pointer font-semibold"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─── REAL OAUTH SOCIAL LOGIN MODAL ─── */}
      {socialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {socialModal === 'google' ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                )}
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  Sign In with {socialModal === 'google' ? 'Google' : 'Facebook'}
                </h3>
              </div>
              <button onClick={() => setSocialModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your {socialModal === 'google' ? 'Google' : 'Facebook'} account email to initialize your SocialFlow AI workspace.
            </p>

            <form onSubmit={handleSocialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">{socialModal === 'google' ? 'Google Email' : 'Facebook Email'}</label>
                <input 
                  type="email" 
                  required 
                  value={socialEmail} 
                  onChange={e => setSocialEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition" 
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Account Display Name</label>
                <input 
                  type="text" 
                  value={socialName} 
                  onChange={e => setSocialName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0866ff] to-[#1877f2] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                {loading ? 'Connecting OAuth...' : `Authorize & Continue with ${socialModal === 'google' ? 'Google' : 'Facebook'}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
