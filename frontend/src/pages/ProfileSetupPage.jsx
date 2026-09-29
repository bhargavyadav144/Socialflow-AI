import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, Sparkles, UserCircle, Palette,
  Instagram, Youtube, Facebook, Twitter, Layers, Save
} from 'lucide-react';
import { api } from '../services/api';

const ALL_CONTENT_TYPES = [
  'Reels', 'Shorts', 'Stories', 'Carousel Posts', 'Single Image Posts',
  'Vlogs', 'Tutorials', 'Podcasts', 'Live Streams', 'Blog Articles',
  'Memes', 'Infographics', 'Product Reviews', 'Unboxing', 'Behind the Scenes',
  'Q&A / AMA', 'Challenges', 'Collaborations', 'Threads', 'Newsletters'
];

const ALL_PLATFORMS = [
  { name: 'Instagram', color: 'from-pink-500 to-purple-600', icon: '📸' },
  { name: 'YouTube', color: 'from-red-500 to-red-700', icon: '🎬' },
  { name: 'TikTok', color: 'from-black to-slate-800', icon: '🎵' },
  { name: 'X / Twitter', color: 'from-slate-700 to-slate-900', icon: '𝕏' },
  { name: 'LinkedIn', color: 'from-blue-600 to-blue-800', icon: '💼' },
  { name: 'Facebook', color: 'from-blue-500 to-blue-700', icon: '📘' },
  { name: 'Pinterest', color: 'from-red-600 to-rose-700', icon: '📌' },
  { name: 'Snapchat', color: 'from-yellow-400 to-yellow-600', icon: '👻' },
  { name: 'Threads', color: 'from-slate-600 to-slate-800', icon: '🧵' },
  { name: 'Reddit', color: 'from-orange-500 to-orange-700', icon: '🔴' },
];

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function ProfileSetupPage({ currentUser, onComplete }) {
  const [selectedContentTypes, setSelectedContentTypes] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [gender, setGender] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleContentType = (type) => {
    setSelectedContentTypes(prev => {
      if (prev.includes(type)) return prev.filter(t => t !== type);
      if (prev.length >= 5) { setError('You can select up to 5 content types.'); return prev; }
      setError('');
      return [...prev, type];
    });
  };

  const togglePlatform = (name) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(name)) return prev.filter(p => p !== name);
      if (prev.length >= 10) return prev;
      return [...prev, name];
    });
  };

  const handleSubmit = async () => {
    setError('');
    if (selectedContentTypes.length === 0) { setError('Please select at least 1 content type.'); return; }
    if (selectedPlatforms.length === 0) { setError('Please select at least 1 platform.'); return; }
    if (!gender) { setError('Please select your gender.'); return; }
    if (newPassword && newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const profileData = {
        content_types: selectedContentTypes,
        connected_platforms: selectedPlatforms,
        gender: gender,
      };
      if (newPassword) profileData.password = newPassword;

      const res = await api.updateProfile(currentUser.id, profileData);
      onComplete(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl space-y-6 z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600/30 to-cyan-500/30 p-1 border border-purple-500/30 shadow-xl">
            <img src="/logo.png" alt="SocialFlow AI" className="h-full w-full object-contain rounded-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Welcome, <span className="purple-gradient-text">{currentUser?.name || 'Creator'}</span>!
          </h1>
          <p className="text-sm text-slate-400">Let's set up your profile so our AI can serve you better.</p>
        </div>

        {/* Main Card */}
        <div className="p-8 rounded-2xl glass-panel border border-purple-500/30 shadow-2xl space-y-8">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300 font-mono">⚠️ {error}</div>
          )}

          {/* ─── Content Types (select up to 5) ─── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-400" />
                Content Types You Create
              </h3>
              <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                {selectedContentTypes.length}/5 selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_CONTENT_TYPES.map(type => {
                const selected = selectedContentTypes.includes(type);
                return (
                  <button key={type} onClick={() => toggleContentType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selected
                        ? 'bg-purple-600 text-white border border-purple-400 shadow-md shadow-purple-600/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-purple-500/40 hover:text-slate-200'
                    }`}>
                    {selected && <span className="mr-1">✓</span>}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Social Platforms (select up to 10) ─── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                Your Social Media Platforms
              </h3>
              <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                {selectedPlatforms.length}/10 selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {ALL_PLATFORMS.map(p => {
                const selected = selectedPlatforms.includes(p.name);
                return (
                  <button key={p.name} onClick={() => togglePlatform(p.name)}
                    className={`p-3 rounded-xl text-xs font-semibold transition-all text-center ${
                      selected
                        ? `bg-gradient-to-br ${p.color} text-white border border-white/20 shadow-lg`
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-purple-500/40'
                    }`}>
                    <span className="text-lg block mb-1">{p.icon}</span>
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Gender Selection ─── */}
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <UserCircle className="h-4 w-4 text-emerald-400" />
              Gender
            </h3>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    gender === g
                      ? 'bg-emerald-600 text-white border border-emerald-400'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-emerald-500/40'
                  }`}>
                  {gender === g && '✓ '}{g}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Change Password (Optional) ─── */}
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Save className="h-4 w-4 text-amber-400" />
              Change Password <span className="text-slate-500 font-normal">(optional)</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="New password"
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition" />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition" />
            </div>
          </div>

          {/* ─── Submit ─── */}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-2xl shadow-purple-600/30 disabled:opacity-50">
            <Sparkles className="h-5 w-5" />
            {loading ? 'Saving Profile...' : 'Complete Setup & Enter Dashboard'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
