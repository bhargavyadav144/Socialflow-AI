import React, { useState } from 'react';
import { X, UserPlus, LogIn, Sparkles, BrainCircuit, KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import TermsModal from './TermsModal';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Enter details/email, 2: Enter OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp_code: '',
    niche: 'Tech & Coding',
    target_audience: 'Developer audience',
    brand_voice: 'Educational',
    content_goals: 'Increase video engagement',
    terms_accepted: true
  });

  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (!isOpen) return null;

  const handleSendOTP = async () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.sendOTP(formData.email);
      setOtpSent(true);
      setDemoOtp(res.demo_otp_code || '');
      setInfoMsg(`Verification 6-digit OTP sent to ${formData.email}! (Demo OTP Code: ${res.demo_otp_code})`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp_code.trim()) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.verifyOTP(formData.email, formData.otp_code);
      setOtpVerified(true);
      setInfoMsg('Email address verified successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login({ email: formData.email, password: formData.password });
        onAuthSuccess(res);
        onClose();
      } else {
        if (!otpVerified) {
          setError('Please verify your email with the 6-digit OTP code first');
          setLoading(false);
          return;
        }
        if (!formData.terms_accepted) {
          setError('You must accept the Terms & Conditions');
          setLoading(false);
          return;
        }
        const res = await api.register(formData);
        onAuthSuccess(res);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#0f172a] border border-purple-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white font-outfit">
                {isLogin ? 'Sign In to SocialFlow AI' : 'Create Creator Workspace'}
              </h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {!isLogin && (
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@creator.com"
                  className="flex-1 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                {!isLogin && !otpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading || !formData.email}
                    className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shrink-0"
                  >
                    Send OTP
                  </button>
                )}
              </div>
            </div>

            {/* Registration OTP verification step */}
            {!isLogin && otpSent && !otpVerified && (
              <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 space-y-2">
                <label className="block text-purple-300 font-semibold flex items-center gap-1">
                  <KeyRound className="h-3.5 w-3.5" />
                  Enter 6-Digit Email Verification OTP Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.otp_code}
                    onChange={e => setFormData({ ...formData, otp_code: e.target.value })}
                    placeholder="e.g. 849201"
                    className="flex-1 p-2 rounded-lg bg-slate-950 border border-purple-500/40 text-white font-mono tracking-widest text-center text-sm font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={loading || !formData.otp_code}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Niche</label>
                    <input
                      type="text"
                      value={formData.niche}
                      onChange={e => setFormData({ ...formData, niche: e.target.value })}
                      placeholder="e.g. Fitness, Coding"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Target Audience</label>
                    <input
                      type="text"
                      value={formData.target_audience}
                      onChange={e => setFormData({ ...formData, target_audience: e.target.value })}
                      placeholder="e.g. College CS students"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.terms_accepted}
                    onChange={e => setFormData({ ...formData, terms_accepted: e.target.checked })}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 h-4 w-4 bg-slate-900"
                  />
                  <label htmlFor="terms" className="text-slate-400 text-[11px]">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-purple-400 hover:text-purple-300 font-semibold underline"
                    >
                      Terms of Service & Privacy Policy
                    </button>
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 mt-2"
            >
              {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Verified Creator Account'}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
            {isLogin ? "Don't have an account?" : "Already registered?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setInfoMsg('');
              }}
              className="text-purple-400 hover:text-purple-300 font-semibold underline"
            >
              {isLogin ? 'Register with Email OTP' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </>
  );
}
