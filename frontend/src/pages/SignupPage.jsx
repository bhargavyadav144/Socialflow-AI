import React, { useState } from 'react';
import { 
  UserPlus, ShieldCheck, Mail, KeyRound, CheckCircle2, ArrowLeft,
  Eye, EyeOff, Phone, BadgeCheck, X, Sparkles, BrainCircuit
} from 'lucide-react';
import { api } from '../services/api';
import TermsModal from '../components/TermsModal';

export default function SignupPage({ onSignupSuccess, switchToLogin, switchToHome }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Email verification flow
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Social OAuth Modal states
  const [socialModal, setSocialModal] = useState(null); // 'google' | 'facebook' | null
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const countryCodes = [
    { code: '+91', country: '🇮🇳 India (+91)' },
    { code: '+1', country: '🇺🇸 USA / Canada (+1)' },
    { code: '+44', country: '🇬🇧 UK (+44)' },
    { code: '+61', country: '🇦🇺 Australia (+61)' },
    { code: '+971', country: '🇦🇪 UAE (+971)' },
    { code: '+65', country: '🇸🇬 Singapore (+65)' },
    { code: '+49', country: '🇩🇪 Germany (+49)' },
    { code: '+33', country: '🇫🇷 France (+33)' },
    { code: '+81', country: '🇯🇵 Japan (+81)' },
    { code: '+55', country: '🇧🇷 Brazil (+55)' },
  ];

  // Step 1: Send OTP to email
  const handleSendOTP = async () => {
    if (!email) { setError('Please enter your email first.'); return; }
    setError('');
    setVerifyLoading(true);
    try {
      await api.sendOTP(email);
      setOtpSent(true);
      setSuccess('Verification OTP code sent to your email inbox!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otpCode) { setError('Please enter the 6-digit OTP code.'); return; }
    setError('');
    setVerifyLoading(true);
    try {
      await api.verifyOTP(email, otpCode);
      setEmailVerified(true);
      setSuccess('Email verified successfully!');
      setOtpSent(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP code.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) { setError('Full Name is required.'); return; }
    if (!emailVerified) { setError('Please verify your email address via OTP first.'); return; }
    if (!phoneNumber.trim()) { setError('Phone Number is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreeTerms) { setError('You must accept the Terms of Service & Privacy Policy.'); return; }

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

    setLoading(true);
    try {
      const res = await api.register({
        name: fullName,
        email,
        phone: fullPhone,
        password,
        terms_accepted: agreeTerms
      });
      onSignupSuccess(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    if (!socialEmail) { setError('Please enter your email address.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await api.socialLogin(socialModal, {
        email: socialEmail,
        name: socialName
      });
      setSocialModal(null);
      onSignupSuccess(res);
    } catch (err) {
      setError(err.response?.data?.detail || `${socialModal} signup failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans py-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        
        {/* ─── LEFT PANEL: FACEBOOK META ELECTRIC BLUE HERO ─── */}
        <div className="bg-gradient-to-br from-[#0866ff] via-[#1877f2] to-[#0052cc] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

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
              Join<br />SocialFlow
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed font-sans">
              Create your creator workspace to connect your social channels, organize your niches, and activate Vectorize Hindsight memory.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-100 font-mono">
              <BrainCircuit className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span>Isolated Hindsight Memory Bank</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-blue-100/80 border-t border-white/15 pt-4 z-10 font-sans">
            © 2026 SocialFlow AI • Creator Registration
          </div>
        </div>

        {/* ─── RIGHT PANEL: CRISP WHITE FORM ─── */}
        <div className="p-8 sm:p-10 bg-white flex flex-col justify-center space-y-5 font-sans overflow-y-auto max-h-[85vh]">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 font-outfit">Create Account</h2>
            <p className="text-xs text-slate-500">Fill in your information to initialize your workspace</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold font-sans">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold font-sans">
              ✓ {success}
            </div>
          )}

          {/* Google & Facebook Fast OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { setSocialModal('google'); setSocialEmail(email || 'newcreator.google@gmail.com'); setSocialName('Google Creator'); setError(''); }}
              type="button" 
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button 
              onClick={() => { setSocialModal('facebook'); setSocialEmail(email || 'newcreator.meta@facebook.com'); setSocialName('Meta Creator'); setError(''); }}
              type="button" 
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border border-[#1877f2]/30 text-xs font-semibold text-[#1877f2] transition cursor-pointer shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="font-semibold uppercase tracking-wider text-[10px]">Or register with email</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <form onSubmit={handleSignup} className="space-y-3.5 text-xs">
            {/* Full Name */}
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition" />
            </div>

            {/* Email Address + Verify OTP Flow */}
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input type="email" required value={email} onChange={e => { setEmail(e.target.value); setEmailVerified(false); }}
                    disabled={emailVerified}
                    placeholder="creator@channel.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:bg-white transition disabled:opacity-60" />
                  {emailVerified && (
                    <BadgeCheck className="h-4 w-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {!emailVerified && (
                  <button type="button" onClick={handleSendOTP} disabled={verifyLoading || !email}
                    className="px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1877f2] border border-blue-200 text-[11px] font-bold transition shrink-0 cursor-pointer">
                    {verifyLoading ? 'Sending...' : otpSent ? 'Resend' : 'Verify Email'}
                  </button>
                )}
              </div>
            </div>

            {/* OTP Verification Input Box */}
            {otpSent && !emailVerified && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="text-[11px] text-[#1877f2] font-semibold flex items-center gap-1.5 font-sans">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span>Check your email inbox for the 6-digit OTP code.</span>
                </div>
                <div className="flex gap-2">
                  <input type="text" maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-blue-300 text-[#1877f2] font-mono text-center tracking-widest text-xs focus:outline-none" />
                  <button type="button" onClick={handleVerifyOTP} disabled={verifyLoading}
                    className="px-3 py-2 rounded-lg bg-[#1877f2] text-white text-xs font-bold transition cursor-pointer">
                    Confirm OTP
                  </button>
                </div>
              </div>
            )}

            {/* Phone Number with Country Code Dropdown */}
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select 
                  value={countryCode} 
                  onChange={e => setCountryCode(e.target.value)}
                  className="px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#1877f2] cursor-pointer max-w-[130px]"
                >
                  {countryCodes.map(c => (
                    <option key={c.code} value={c.code} className="bg-white text-slate-900">
                      {c.country}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="tel" 
                    required 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] transition" 
                  />
                </div>
              </div>
            </div>

            {/* Password Field 1 */}
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] transition pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Field 2: Re-enter Password */}
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                Re-enter Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 placeholder-slate-400 focus:outline-none transition pr-10 ${
                    confirmPassword && confirmPassword !== password 
                      ? 'border-rose-500 focus:border-rose-500' 
                      : confirmPassword && confirmPassword === password 
                      ? 'border-emerald-500 focus:border-emerald-500' 
                      : 'border-slate-300 focus:border-[#1877f2]'
                  }`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms of Service Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" required checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 bg-slate-50 text-[#1877f2] focus:ring-[#1877f2]" />
              <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight font-medium">
                I agree to the{' '}
                <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#1877f2] font-bold underline cursor-pointer hover:text-[#0052cc]">
                  Terms of Service & Privacy Policy
                </button>
                <span className="text-rose-500"> *</span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0866ff] to-[#1877f2] hover:from-[#0052cc] hover:to-[#0866ff] text-white font-bold text-sm transition shadow-lg shadow-[#1877f2]/25 flex items-center justify-center gap-2 cursor-pointer">
              <UserPlus className="h-4 w-4" />
              {loading ? 'Creating Workspace...' : 'Create Creator Workspace'}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-600 font-medium border-t border-slate-100">
            Already have an account?{' '}
            <button onClick={switchToLogin} className="text-[#1877f2] font-bold underline cursor-pointer hover:text-[#0052cc]">
              Sign In &rarr;
            </button>
          </div>
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
                  Register with {socialModal === 'google' ? 'Google' : 'Facebook'}
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

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}
