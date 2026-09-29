import React, { useState, useRef } from 'react';
import { 
  Settings, Save, User, BrainCircuit, ShieldCheck, CheckCircle2, 
  Camera, Upload, Trash2, Globe, MapPin, Layers, Link2, Sparkles, Lock, X, Check, ExternalLink,
  KeyRound, Mail, Eye, Phone, Edit3
} from 'lucide-react';
import { api } from '../services/api';

// Helper function to render social platform logo badges with official SVG brand logos
const renderSocialPlatformLogo = (platName) => {
  const p = (platName || '').toLowerCase();
  if (p.includes('instagram') || p.includes('ig')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('youtube') || p.includes('yt')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('facebook') || p.includes('fb')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('twitter') || p.includes('x')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-slate-900 border border-blue-400/40 flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('tiktok')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-slate-950 border border-pink-500/50 flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525 0h3.08c.012 1.348.552 2.658 1.503 3.567.951.908 2.235 1.413 3.567 1.415v3.13c-1.849.002-3.626-.647-5.07-1.837v8.528c0 4.14-3.36 7.5-7.5 7.5S.605 18.943.605 14.803c0-4.14 3.36-7.5 7.5-7.5.344 0 .687.023 1.025.07v3.167c-.341-.103-.695-.156-1.025-.156-2.42 0-4.38 1.96-4.38 4.38s1.96 4.38 4.38 4.38 4.38-1.96 4.38-4.38V0z"/>
        </svg>
      </div>
    );
  }
  return (
    <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
      <Link2 className="h-4 w-4" />
    </div>
  );
};

export default function SettingsPage({ currentUser, setCurrentUser, setActivePage }) {
  const [activeTab, setActiveTab] = useState('view_profile');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Password & Security flow states
  const [passwordMode, setPasswordMode] = useState('standard'); // 'standard' | 'otp'
  const [otpStep, setOtpStep] = useState(1); // 1=send OTP, 2=verify OTP, 3=set new password
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    countryCode: '+91',
    phoneNumber: currentUser?.phone ? currentUser.phone.replace(/^\+\d+\s*/, '') : '',
    gender: currentUser?.gender || '',
    dob: currentUser?.dob || '',
    bio: currentUser?.bio || '',
    website: currentUser?.website || '',
    location: currentUser?.location || '',
    avatar_url: currentUser?.avatar_url || '',
    niche: currentUser?.niche || 'Tech & AI',
    target_audience: currentUser?.target_audience || 'Creators & Tech Enthusiasts',
    brand_voice: currentUser?.brand_voice || 'Authentic, engaging, analytical',
    content_goals: currentUser?.content_goals || 'Increase channel reach and engagement',
    logo_url: currentUser?.logo_url || '',
    content_types: currentUser?.content_types || ['Lifestyle', 'Tech & AI', 'Fashion'],
    connected_platforms: currentUser?.connected_platforms || [],
    platform_urls: currentUser?.platform_urls || {},
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const allCategories = [
    'Lifestyle',
    'Fashion',
    'Tech & AI',
    'Fitness & Health',
    'Gaming & Esports',
    'Travel & Adventure',
    'Business & Finance',
    'Food & Cooking',
    'Beauty & Makeup',
    'Education & Tutorials',
    'Entertainment & Vlogs',
    'Music & Audio',
    'Art & Design',
    'Automotive & Cars',
    'Real Estate & Living'
  ];

  const availablePlatforms = [
    { name: 'Instagram', domain: 'instagram.com', placeholder: 'https://instagram.com/your_handle' },
    { name: 'YouTube', domain: 'youtube.com', placeholder: 'https://youtube.com/@your_channel' },
    { name: 'X / Twitter', domain: 'x.com', placeholder: 'https://x.com/your_handle' },
    { name: 'LinkedIn', domain: 'linkedin.com', placeholder: 'https://linkedin.com/in/your_name' },
    { name: 'Facebook', domain: 'facebook.com', placeholder: 'https://facebook.com/your_page' }
  ];

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError('Image file size must be less than 15MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 400;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_DIM) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setFormData(prev => ({ ...prev, avatar_url: compressedDataUrl }));
            setError('');
          } catch (err) {
            setFormData(prev => ({ ...prev, avatar_url: event.target.result }));
            setError('');
          }
        };
        img.onerror = () => {
          setError('Failed to load image file. Please try another image.');
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, avatar_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCategorySelect = (e) => {
    const category = e.target.value;
    if (!category) return;

    if (!formData.content_types.includes(category)) {
      setFormData(prev => ({
        ...prev,
        content_types: [...prev.content_types, category]
      }));
    }
    e.target.value = '';
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData(prev => ({
      ...prev,
      content_types: prev.content_types.filter(c => c !== categoryToRemove)
    }));
  };

  const togglePlatform = (platName) => {
    setFormData(prev => {
      const exists = prev.connected_platforms.includes(platName);
      if (exists) {
        const updatedPlatforms = prev.connected_platforms.filter(p => p !== platName);
        const updatedUrls = { ...prev.platform_urls };
        delete updatedUrls[platName];
        return { ...prev, connected_platforms: updatedPlatforms, platform_urls: updatedUrls };
      } else {
        const updatedPlatforms = [...prev.connected_platforms, platName];
        const updatedUrls = {
          ...prev.platform_urls,
          [platName]: prev.platform_urls?.[platName] || ''
        };
        return { ...prev, connected_platforms: updatedPlatforms, platform_urls: updatedUrls };
      }
    });
  };

  const handlePlatformUrlChange = (platName, url) => {
    setFormData(prev => ({
      ...prev,
      platform_urls: {
        ...prev.platform_urls,
        [platName]: url
      }
    }));
  };

  // Option 1: Standard Password Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.new_password) {
      if (!formData.current_password) {
        setError('Please enter your Current Password to set a new password.');
        return;
      }
      if (formData.new_password !== formData.confirm_password) {
        setError('New password and Re-entered password do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      const fullPhone = formData.phoneNumber ? `${formData.countryCode} ${formData.phoneNumber.trim()}` : null;
      
      const payload = {
        name: formData.name,
        phone: fullPhone,
        gender: formData.gender,
        dob: formData.dob,
        bio: formData.bio,
        website: formData.website,
        location: formData.location,
        avatar_url: formData.avatar_url,
        platform_urls: formData.platform_urls,
        niche: formData.niche,
        target_audience: formData.target_audience,
        brand_voice: formData.brand_voice,
        content_goals: formData.content_goals,
        content_types: formData.content_types,
        connected_platforms: formData.connected_platforms,
        logo_url: formData.logo_url,
        current_password: formData.current_password || undefined,
        password: formData.new_password || undefined
      };

      const res = await api.updateProfile(currentUser?.id || 1, payload);
      
      const updatedUser = {
        ...currentUser,
        ...res,
        avatar_url: formData.avatar_url,
        bio: formData.bio,
        website: formData.website,
        location: formData.location,
        gender: formData.gender,
        dob: formData.dob,
        platform_urls: formData.platform_urls
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('socialflow_user', JSON.stringify(updatedUser));

      // Reset password fields
      setFormData(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  // Option 2: Forgot Password via Email OTP
  const handleSendResetOTP = async () => {
    setError('');
    setOtpSuccessMsg('');
    setLoading(true);
    try {
      await api.forgotPassword(formData.email);
      setOtpSent(true);
      setOtpStep(2);
      setOtpSuccessMsg(`Reset 6-digit OTP code sent to your email inbox (${formData.email}).`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOTP = async () => {
    if (!otpCode) { setError('Please enter the 6-digit OTP code.'); return; }
    setError('');
    setLoading(true);
    try {
      await api.verifyOTP(formData.email, otpCode);
      setOtpVerified(true);
      setOtpStep(3);
      setOtpSuccessMsg('OTP verified successfully! Set your new password below.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.new_password || formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match. Please enter matching passwords.');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword({
        email: formData.email,
        otp_code: otpCode,
        new_password: formData.new_password
      });
      setSaved(true);
      setPasswordMode('standard');
      setOtpStep(1);
      setOtpCode('');
      setFormData(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const unselectedCategories = allCategories.filter(c => !formData.content_types.includes(c));

  return (
    <div className="max-w-5xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Creator Profile & Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your photo, bio, niche categories, platform URLs, and password</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActivePage && setActivePage('memory')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-blue-500/30 text-xs text-slate-700 dark:text-slate-200 transition cursor-pointer group shadow-sm self-start sm:self-auto"
          title="Click to view & manage AI Memory Vault"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="font-semibold font-outfit">AI Memory Bank</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-mono border border-blue-200 dark:border-blue-500/20">Vectorize Synced</span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white" />
        </button>
      </div>

      {/* Executive AI Memory Explanation Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-500/30 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 mt-0.5">
            <BrainCircuit className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs font-outfit flex items-center gap-2">
              What is the AI Memory Bank (Vectorize Hindsight)?
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono font-semibold">Active & Synced</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              The Memory Bank acts as your AI assistant's long-term brain. It automatically retains your creator niches, audience targets, brand voice, and connected platforms so that every AI post script, viral idea, and strategic recommendation is 100% personalized to you without re-explaining yourself.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActivePage && setActivePage('memory')}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 transition shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" /> View Memory Vault
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-sans shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Profile & password updated successfully! Synchronized with Hindsight memory.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 font-sans shadow-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
        {[
          { id: 'view_profile', label: '👁️ View Profile Summary', icon: Eye },
          { id: 'profile', label: '✏️ Edit Profile & Bio', icon: User },
          { id: 'content', label: '🏷️ Niche & Categories', icon: Layers },
          { id: 'platforms', label: '🔗 Social Platform URLs', icon: Link2 },
          { id: 'security', label: '🔒 Password & Security', icon: Lock },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-6">
        {/* TAB 0: READ-ONLY VIEW PROFILE SUMMARY */}
        {activeTab === 'view_profile' && (
          <div className="p-4 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-6 text-xs font-sans shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Creator Profile Summary (Read-Only)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  This is your active public profile. Click any edit button below to change your information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile & Bio
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt={formData.name} className="h-20 w-20 rounded-2xl object-cover border-2 border-blue-500 shadow-xl shrink-0" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-blue-400 shadow-xl shrink-0">
                    {formData.name?.charAt(0) || 'C'}
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">{formData.name || 'Creator'}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-mono font-semibold">
                      Verified Creator
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">📧 {formData.email}</p>
                  
                  {formData.bio ? (
                    <p className="text-xs text-slate-700 dark:text-slate-300 pt-1 leading-relaxed italic">
                      "{formData.bio}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic pt-1">No bio written yet. Click 'Edit Profile' to add a creator bio.</p>
                  )}
                </div>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs font-sans">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Phone Number</span>
                  <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5 mt-0.5 font-mono truncate">
                    <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    {formData.phoneNumber ? `${formData.countryCode} ${formData.phoneNumber}` : 'Not provided'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Gender</span>
                  <span className="text-slate-900 dark:text-white font-semibold mt-0.5 block truncate">
                    {formData.gender || 'Not provided'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Date of Birth</span>
                  <span className="text-slate-900 dark:text-white font-semibold mt-0.5 block font-mono truncate">
                    {formData.dob || 'Not provided'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Location</span>
                  <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5 mt-0.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                    {formData.location || 'Not provided'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 col-span-2 shadow-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Website / Portfolio</span>
                  {formData.website ? (
                    <a href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 mt-0.5 truncate">
                      <Globe className="h-3.5 w-3.5 shrink-0" /> {formData.website}
                    </a>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 mt-0.5 block">Not provided</span>
                  )}
                </div>
              </div>

              {/* Niche Categories Badges */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Active Niche Categories ({formData.content_types.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    Edit Niches &rarr;
                  </button>
                </div>
                {formData.content_types.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 italic text-[11px]">No niche categories selected.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.content_types.map(cat => (
                      <span key={cat} className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs border border-blue-400/40 shadow-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Connected Social Channel URLs & Direct Profile Redirection */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-1.5">
                    <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Connected Social Platform Profiles
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('platforms')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    Edit Social URLs &rarr;
                  </button>
                </div>
                {formData.connected_platforms.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 italic text-[11px]">No social platforms connected yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {formData.connected_platforms.map(plat => {
                      const url = formData.platform_urls?.[plat] || '';
                      return url ? (
                        <a 
                          key={plat} 
                          href={url.startsWith('http') ? url : `https://${url}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 text-xs flex items-center justify-between transition group shadow-xs"
                          title={`Click to open your official ${plat} profile in a new tab`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {renderSocialPlatformLogo(plat)}
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 dark:text-white font-outfit block text-xs group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                                {plat}
                              </span>
                              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono truncate block max-w-[170px]">
                                {url}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition shrink-0 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-500/20">
                            <span>Visit</span>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </a>
                      ) : (
                        <div key={plat} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between opacity-70">
                          <div className="flex items-center gap-2.5">
                            {renderSocialPlatformLogo(plat)}
                            <span className="font-bold text-slate-700 dark:text-slate-300 font-outfit">{plat}</span>
                          </div>
                          <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">No URL entered</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: PROFILE, PHOTO UPLOAD & BIO */}
        {activeTab === 'profile' && (
          <div className="p-4 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-6 text-xs shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center gap-2">
              <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Photo Upload & Personal Information
            </h3>

            {/* Photo Upload Area */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-4">
              <span className="block text-slate-800 dark:text-slate-200 font-semibold">Profile Photo / Logo</span>
              
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Active Photo Preview */}
                <div className="relative group shrink-0">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Profile Photo" className="h-24 w-24 rounded-2xl object-cover border-2 border-blue-500 shadow-xl" />
                  ) : (
                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-blue-400 shadow-xl">
                      {formData.name?.charAt(0) || 'C'}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <Upload className="h-4 w-4" /> Upload Profile Photo
                    </button>

                    {formData.avatar_url && (
                      <button 
                        type="button" 
                        onClick={handleRemovePhoto}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" /> Remove Photo
                      </button>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Upload PNG, JPG, or GIF image (Max 5MB). Photo updates automatically across your workspace header & reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Creator Bio & Info */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Creator Bio / About Me</label>
              <textarea 
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Write a short bio about your channel, content style, and creative mission..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition" 
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Email Address (Primary)</label>
                <input 
                  type="email" 
                  disabled 
                  value={formData.email} 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-70 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Phone Number</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.countryCode} 
                    onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                    className="px-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 max-w-[120px]"
                  >
                    {countryCodes.map(c => (
                      <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c.country}</option>
                    ))}
                  </select>
                  <input 
                    type="tel" 
                    value={formData.phoneNumber} 
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="98765 43210"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Website / Portfolio</label>
                <div className="relative">
                  <Globe className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="url" 
                    value={formData.website} 
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourdomain.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Location / City</label>
                <div className="relative">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Mumbai, India"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition" 
                  />
                </div>
              </div>
            </div>

            {/* Gender & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 cursor-pointer transition"
                >
                  <option value="" className="bg-white dark:bg-slate-900">-- Select Gender --</option>
                  <option value="Male" className="bg-white dark:bg-slate-900">Male</option>
                  <option value="Female" className="bg-white dark:bg-slate-900">Female</option>
                  <option value="Non-binary" className="bg-white dark:bg-slate-900">Non-binary</option>
                  <option value="Prefer not to say" className="bg-white dark:bg-slate-900">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 cursor-pointer transition"
                />
                {formData.dob && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Age: {Math.floor((new Date() - new Date(formData.dob)) / (365.25 * 24 * 60 * 60 * 1000))} years old
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NICHE CATEGORIES WITH DROPDOWN + BADGE REMOVE */}
        {activeTab === 'content' && (
          <div className="p-4 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-6 text-xs shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Niche & Content Categories (Dropdown Selection)
            </h3>

            <p className="text-slate-600 dark:text-slate-400">
              Select content niches (e.g. Lifestyle, Fashion, Tech). Selected categories appear below with an <span className="text-rose-500 font-bold">X</span> button to remove. Selected niches automatically hide from the dropdown options.
            </p>

            {/* Category Dropdown Selector */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-semibold">Add Niche Category from Dropdown</label>
              <select 
                onChange={handleCategorySelect}
                defaultValue=""
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-blue-400/60 dark:border-blue-500/40 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition cursor-pointer"
              >
                <option value="" disabled>-- Select a category to add (e.g. Lifestyle, Fashion, Tech) --</option>
                {unselectedCategories.map(cat => (
                  <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-1">
                    + {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Categories Badge Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-outfit">Active Selected Niche Categories</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px] font-semibold">{formData.content_types.length} selected</span>
              </div>

              {formData.content_types.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 italic text-[11px] pt-1">No categories selected yet. Use the dropdown above to add niches.</p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.content_types.map(cat => (
                    <div 
                      key={cat}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs flex items-center gap-2 border border-blue-400/40"
                    >
                      <span>{cat}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveCategory(cat)}
                        className="h-4 w-4 rounded-full bg-black/30 hover:bg-rose-500 text-white flex items-center justify-center transition cursor-pointer"
                        title={`Remove ${cat}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Niche & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Primary Channel Niche</label>
                <input 
                  type="text" 
                  value={formData.niche} 
                  onChange={e => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="e.g. Lifestyle & Tech Reviews"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition" 
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Target Audience Demographic</label>
                <input 
                  type="text" 
                  value={formData.target_audience} 
                  onChange={e => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="e.g. Young professionals & tech lovers (aged 18-35)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition" 
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONNECTED PLATFORMS WITH PROFILE URLS */}
        {activeTab === 'platforms' && (
          <div className="p-4 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-6 text-xs shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Connected Social Channels & Profile URLs
            </h3>

            <p className="text-slate-600 dark:text-slate-400">
              Select your active social platforms and enter your specific Profile URL or handle. Connected URLs are displayed on your profile and synchronized with the Social Channels page.
            </p>

            <div className="space-y-3 sm:space-y-4">
              {availablePlatforms.map(plat => {
                const isConnected = formData.connected_platforms.includes(plat.name);
                const profileUrl = formData.platform_urls?.[plat.name] || '';

                return (
                  <div key={plat.name} className={`p-4 rounded-2xl border transition ${
                    isConnected ? 'bg-slate-50 dark:bg-slate-900/90 border-blue-400/50 dark:border-blue-500/40 shadow-xs' : 'bg-slate-100/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          id={`plat-${plat.name}`}
                          checked={isConnected} 
                          onChange={() => togglePlatform(plat.name)}
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        />
                        <label htmlFor={`plat-${plat.name}`} className="font-bold text-slate-900 dark:text-white text-sm cursor-pointer flex items-center gap-2 font-outfit">
                          {plat.name}
                          {isConnected && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono">Connected</span>
                          )}
                        </label>
                      </div>

                      {isConnected && profileUrl && (
                        <a 
                          href={profileUrl.startsWith('http') ? profileUrl : `https://${profileUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Visit Profile
                        </a>
                      )}
                    </div>

                    {isConnected && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                          Submit Profile URL / Handle for {plat.name} *
                        </label>
                        <input 
                          type="text" 
                          required={isConnected}
                          value={profileUrl}
                          onChange={e => handlePlatformUrlChange(plat.name, e.target.value)}
                          placeholder={plat.placeholder}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PASSWORD & SECURITY (BOTH STANDARD & EMAIL OTP OPTIONS) */}
        {activeTab === 'security' && (
          <div className="p-4 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-6 text-xs font-sans shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Password & Account Security
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Change password using your current password OR reset via Email OTP if forgotten.
                </p>
              </div>

              {/* Password Option Switcher Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => { setPasswordMode('standard'); setError(''); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    passwordMode === 'standard'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Standard Change
                </button>
                <button
                  type="button"
                  onClick={() => { setPasswordMode('otp'); setError(''); setOtpStep(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    passwordMode === 'otp'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Reset via Email OTP
                </button>
              </div>
            </div>

            {otpSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2 font-sans shadow-xs">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{otpSuccessMsg}</span>
              </div>
            )}

            {/* OPTION 1: STANDARD PASSWORD CHANGE */}
            {passwordMode === 'standard' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs font-outfit">Option 1: Standard Password Update</h4>
                  
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Current Password *</label>
                    <input 
                      type="password" 
                      value={formData.current_password} 
                      onChange={e => setFormData({ ...formData, current_password: e.target.value })}
                      placeholder="Enter your current password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">New Password *</label>
                      <input 
                        type="password" 
                        value={formData.new_password} 
                        onChange={e => setFormData({ ...formData, new_password: e.target.value })}
                        placeholder="At least 6 characters"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Re-enter New Password *</label>
                      <input 
                        type="password" 
                        value={formData.confirm_password} 
                        onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                        placeholder="Confirm new password"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border text-slate-900 dark:text-white focus:outline-none transition ${
                          formData.confirm_password && formData.confirm_password !== formData.new_password
                            ? 'border-rose-500'
                            : formData.confirm_password && formData.confirm_password === formData.new_password
                            ? 'border-emerald-500'
                            : 'border-slate-300 dark:border-slate-800 focus:border-blue-500'
                        }`} 
                      />
                    </div>
                  </div>

                  {formData.confirm_password && formData.confirm_password === formData.new_password && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans">✓ Passwords match</p>
                  )}
                  {formData.confirm_password && formData.confirm_password !== formData.new_password && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-sans">⚠️ Passwords do not match</p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Forgot your current password?</span>
                  <button
                    type="button"
                    onClick={() => { setPasswordMode('otp'); setOtpStep(1); setError(''); }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline text-xs cursor-pointer"
                  >
                    Reset via Email OTP &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* OPTION 2: FORGOT CURRENT PASSWORD (RESET VIA EMAIL OTP) */}
            {passwordMode === 'otp' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-blue-300 dark:border-blue-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs font-outfit flex items-center gap-1.5">
                    <KeyRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Option 2: Reset Password via Email OTP
                  </h4>
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">Step {otpStep}/3</span>
                </div>

                {otpStep === 1 && (
                  <div className="space-y-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      We will send a 6-digit password reset OTP code directly to your registered email inbox:
                    </p>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-blue-600 dark:text-blue-300 font-semibold">
                      📧 {formData.email}
                    </div>
                    <button
                      type="button"
                      onClick={handleSendResetOTP}
                      disabled={loading}
                      className="w-full py-3 rounded-xl brand-gradient-btn text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Mail className="h-4 w-4" />
                      {loading ? 'Sending OTP to Email...' : 'Send Reset OTP to My Email Inbox'}
                    </button>
                  </div>
                )}

                {otpStep === 2 && (
                  <div className="space-y-3">
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold">Enter 6-Digit OTP Code</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      value={otpCode} 
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.5em] text-lg font-mono px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-blue-400/60 dark:border-blue-500/50 text-blue-600 dark:text-blue-300 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition" 
                    />
                    <button
                      type="button"
                      onClick={handleVerifyResetOTP}
                      disabled={loading}
                      className="w-full py-3 rounded-xl brand-gradient-btn text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {loading ? 'Verifying OTP...' : 'Verify OTP Code'}
                    </button>
                  </div>
                )}

                {otpStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">New Password *</label>
                        <input 
                          type="password" 
                          value={formData.new_password} 
                          onChange={e => setFormData({ ...formData, new_password: e.target.value })}
                          placeholder="At least 6 characters"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition" 
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Re-enter New Password *</label>
                        <input 
                          type="password" 
                          value={formData.confirm_password} 
                          onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                          placeholder="Confirm new password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition" 
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetPasswordOTP}
                      disabled={loading}
                      className="w-full py-3 rounded-xl brand-gradient-btn text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {loading ? 'Resetting Password...' : 'Reset Password via OTP'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Save Changes Button for Standard Flow */}
        {passwordMode === 'standard' && (
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-7 py-3 rounded-xl brand-gradient-btn text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
