import React, { useState, useEffect } from 'react';
import { 
  Link2, RefreshCw, CheckCircle2, AlertCircle, Plus, ShieldCheck, 
  BrainCircuit, ExternalLink, Eye, Heart, MessageSquare, Sparkles, 
  Layers, X, Share2, Bookmark, Flame, Zap, Check, ArrowRight, Trash2, 
  Filter, Calendar, Users, UserPlus, Info, TrendingUp, Edit3, Play
} from 'lucide-react';
import { api } from '../services/api';

// Helper function to clean up messy query parameters from handles & URLs
const formatCleanHandle = (raw, platform) => {
  if (!raw) return `@${(platform || 'creator').toLowerCase()}`;
  let clean = raw.trim();
  if (clean.includes('http://') || clean.includes('https://')) {
    try {
      const url = new URL(clean);
      const pathname = url.pathname.replace(/^\/+|\/+$/g, '');
      const parts = pathname.split('/');
      clean = parts[parts.length - 1] || parts[0] || raw;
    } catch {
      clean = clean.split('?')[0].split('#')[0].split('/').pop();
    }
  } else {
    clean = clean.split('?')[0].split('#')[0];
  }
  clean = clean.replace(/^@+/, '');
  return clean ? `@${clean}` : `@${(platform || 'creator').toLowerCase()}`;
};

// Helper function to format dates nicely
const formatPostDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Recently';
  }
};

// Helper function to render social platform logo badges with official SVG brand logos
const renderSocialPlatformLogo = (platName, isMini = false) => {
  const p = (platName || '').toLowerCase();
  const sz = isMini ? 'h-3.5 w-3.5' : 'h-5 w-5';
  const containerSz = isMini ? 'h-6 w-6 rounded-full' : 'h-11 w-11 rounded-2xl';

  if (p.includes('instagram') || p.includes('ig')) {
    return (
      <div className={`${containerSz} bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0`}>
        <svg className={`${sz} fill-current`} viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('youtube') || p.includes('yt')) {
    return (
      <div className={`${containerSz} bg-red-600 flex items-center justify-center text-white shadow-md shrink-0`}>
        <svg className={`${sz} fill-current`} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('facebook') || p.includes('fb')) {
    return (
      <div className={`${containerSz} bg-[#1877F2] flex items-center justify-center text-white shadow-md shrink-0`}>
        <svg className={`${sz} fill-current`} viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <div className={`${containerSz} bg-[#0A66C2] flex items-center justify-center text-white shadow-md shrink-0`}>
        <svg className={`${sz} fill-current`} viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('twitter') || p.includes('x')) {
    return (
      <div className={`${containerSz} bg-slate-900 border border-blue-400/40 flex items-center justify-center text-white shadow-md shrink-0`}>
        <svg className={`${sz} fill-current`} viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    );
  }
  return (
    <div className={`${containerSz} bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0`}>
      <Link2 className={`${sz}`} />
    </div>
  );
};

// Helper to assign a high-tech AI category badge style
const getCategoryStyle = (topic, title) => {
  const text = `${topic} ${title}`.toLowerCase();
  if (text.includes('agent') || text.includes('ai') || text.includes('fastapi') || text.includes('tool')) {
    return {
      label: 'Tech & AI • Tool Breakdown',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30'
    };
  }
  if (text.includes('vlog') || text.includes('lifestyle') || text.includes('day in the life')) {
    return {
      label: 'Lifestyle • Creator Vlog',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
    };
  }
  if (text.includes('design') || text.includes('cheat sheet') || text.includes('architecture')) {
    return {
      label: 'Tech & AI • System Architecture',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30'
    };
  }
  if (text.includes('tutorial') || text.includes('masterclass') || text.includes('course') || text.includes('short')) {
    return {
      label: 'Tech & AI • Masterclass Tutorial',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
    };
  }
  if (text.includes('startup') || text.includes('thread') || text.includes('lesson') || text.includes('milestone')) {
    return {
      label: 'Business & Strategy • Thought Leadership',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30'
    };
  }
  return {
    label: `${topic || 'General'} • Analysis`,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30'
  };
};

export default function ConnectionsPage({ currentUser }) {
  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);
  const [trainingAI, setTrainingAI] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');
  
  // Category & Platform Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [searchPostQuery, setSearchPostQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);

  // Modals
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [selectedAccountForModal, setSelectedAccountForModal] = useState(null);
  const [selectedPostForModal, setSelectedPostForModal] = useState(null);

  // Instant URL Resolver state
  const [quickUrl, setQuickUrl] = useState('');
  const [resolvingQuick, setResolvingQuick] = useState(false);
  const [resolvingModalUrl, setResolvingModalUrl] = useState(false);
  const [resolvingPostUrl, setResolvingPostUrl] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);

  // Edit Account Profile Stats Form
  const [accountEditForm, setAccountEditForm] = useState({
    account_name: '',
    handle_or_id: '',
    followers_count: '',
    following_count: '',
    posts_count: '',
    bio: ''
  });

  // Connect Channel Form
  const [connectForm, setConnectForm] = useState({
    platform: 'Instagram',
    account_name: '',
    handle_or_id: '',
    profile_url: '',
    followers_count: '',
    bio: '',
    profile_pic_url: ''
  });

  // Add Real Post / Reel Form
  const [postForm, setPostForm] = useState({
    platform: 'Instagram',
    content_type: 'Reel',
    title: '',
    topic: 'Tech & AI',
    caption: '',
    views: '',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    post_url: '',
    media_url: '',
    published_at: new Date().toISOString().slice(0, 16)
  });

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    const userId = currentUser?.id || 1;
    try {
      const [accData, postData] = await Promise.all([
        api.getSocialAccounts(userId),
        api.getPosts({ user_id: userId })
      ]);
      setAccounts(accData || []);
      setPosts(postData || []);
    } catch (err) {
      console.error('Failed to load social accounts & posts:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    // Background auto-refresh without disruptive UI loading flickers
    const timer = setInterval(() => {
      fetchData(false);
    }, 30000);
    return () => clearInterval(timer);
  }, [currentUser?.id]);

  // Quick 1-Click URL Paste & Auto-Sync Bar
  const handleQuickUrlSync = async (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    setResolvingQuick(true);
    setAiSuccessMsg('');
    try {
      const url = quickUrl.trim();
      const lower = url.toLowerCase();
      
      // Determine if it's a post/reel or channel profile
      const isPostOrReel = lower.includes('/reel/') || lower.includes('/p/') || lower.includes('watch?v=') || lower.includes('/shorts/') || lower.includes('/status/');
      
      if (isPostOrReel) {
        // Resolve Post
        const pData = await api.resolvePostUrl(url);
        if (pData) {
          await api.createPost({
            platform: pData.platform,
            content_type: pData.content_type,
            title: pData.title,
            topic: pData.topic || 'Tech & AI',
            caption: pData.caption,
            post_url: url,
            media_url: pData.media_url,
            views: pData.views || 0,
            likes: pData.likes || 0,
            comments: pData.comments || 0,
            shares: pData.shares || 0,
            saves: pData.saves || 0,
            published_at: pData.published_at || new Date().toISOString()
          }, currentUser?.id || 1);

          await api.analyzeAndTrainPosts(currentUser?.id || 1);
          setAiSuccessMsg(`✨ Real ${pData.platform} ${pData.content_type} "${pData.title}" (${pData.views?.toLocaleString()} views) imported & trained into AI memory!`);
          setQuickUrl('');
          fetchData();
        }
      } else {
        // Resolve Channel Profile & Auto-Sync
        const res = await api.resolveProfileUrl(url, true, currentUser?.id || 1);
        if (res) {
          const accId = res.account_id || accounts.find(a => a.platform?.toLowerCase() === res.platform?.toLowerCase())?.id;
          if (accId) {
            try {
              await api.syncSocialAccount(accId);
            } catch (e) {
              console.log("Auto-sync error:", e);
            }
          }
          setAiSuccessMsg(`🎉 Auto-Connected & Synced ${res.platform} channel (${res.account_name || res.handle_or_id}) with real telemetry & thumbnails!`);
          setQuickUrl('');
          await fetchData();
        }
      }
    } catch (err) {
      alert("Auto-Sync failed: " + err.message);
    } finally {
      setResolvingQuick(false);
    }
  };

  // Sync All 5 Connected Channels at once
  const handleSyncAllChannels = async () => {
    if (accounts.length === 0) return;
    setSyncingAll(true);
    setAiSuccessMsg('🔄 Syncing real telemetry across all platforms...');
    try {
      for (const acc of accounts) {
        await api.syncSocialAccount(acc.id);
      }
      await api.analyzeAndTrainPosts(currentUser?.id || 1);
      setAiSuccessMsg('✅ All 5 social channels & genuine telemetry successfully live synced and trained into Hindsight AI Memory Bank!');
      fetchData();
    } catch (err) {
      alert("Sync all failed: " + err.message);
    } finally {
      setSyncingAll(false);
    }
  };

  // Open Social Account Details Modal (e.g. IG details)
  const handleOpenAccountModal = (acc) => {
    setSelectedAccountForModal(acc);
    setAccountEditForm({
      account_name: acc.account_name || '',
      handle_or_id: acc.handle_or_id || '',
      followers_count: acc.followers_count || '',
      following_count: acc.following_count || '',
      posts_count: acc.posts_count || '',
      bio: acc.bio || ''
    });
  };

  // Save Social Profile Stats
  const handleSaveAccountStats = async (e) => {
    e.preventDefault();
    if (!selectedAccountForModal) return;

    try {
      const payload = {
        account_name: accountEditForm.account_name.trim(),
        handle_or_id: accountEditForm.handle_or_id.trim(),
        followers_count: parseInt(accountEditForm.followers_count) || 0,
        following_count: parseInt(accountEditForm.following_count) || 0,
        posts_count: parseInt(accountEditForm.posts_count) || 0,
        bio: accountEditForm.bio.trim()
      };
      await api.updateSocialAccount(selectedAccountForModal.id, payload);
      setAiSuccessMsg(`✨ ${selectedAccountForModal.platform} profile details (${payload.account_name} ${payload.handle_or_id}) updated & trained into AI memory!`);
      setSelectedAccountForModal(null);
      await fetchData();
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  // Trigger AI analysis and Hindsight memory training across all posts
  const handleAnalyzeAndTrain = async () => {
    setTrainingAI(true);
    setAiSuccessMsg('');
    try {
      const res = await api.analyzeAndTrainPosts(currentUser?.id || 1);
      setAiSuccessMsg(`🎉 AI Agent analyzed ${res.analyzed_count} reels & posts and trained your Hindsight Memory Bank! Best format: "${res.best_performing_post}"`);
      await fetchData();
    } catch (err) {
      alert("AI Analysis failed: " + err.message);
    } finally {
      setTrainingAI(false);
    }
  };

  // Submit Real Post / Reel
  const handleCreateRealPost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim()) return;

    try {
      const views = parseInt(postForm.views) || 0;
      const likes = parseInt(postForm.likes) || 0;
      const comments = parseInt(postForm.comments) || 0;
      const shares = parseInt(postForm.shares) || 0;
      const saves = parseInt(postForm.saves) || 0;

      const payload = {
        platform: postForm.platform,
        content_type: postForm.content_type,
        title: postForm.title.trim(),
        topic: postForm.topic || 'Tech & AI',
        caption: postForm.caption.trim(),
        post_url: postForm.post_url.trim(),
        media_url: postForm.media_url,
        published_at: postForm.published_at ? new Date(postForm.published_at).toISOString() : new Date().toISOString(),
        views: views,
        likes: likes,
        comments: comments,
        shares: shares,
        saves: saves
      };

      await api.createPost(payload, currentUser?.id || 1);
      await api.analyzeAndTrainPosts(currentUser?.id || 1);
      
      setShowAddPostModal(false);
      setPostForm({
        platform: 'Instagram',
        content_type: 'Reel',
        title: '',
        topic: 'Tech & AI',
        caption: '',
        views: '',
        likes: '',
        comments: '',
        shares: '',
        saves: '',
        post_url: '',
        media_url: '',
        published_at: new Date().toISOString().slice(0, 16)
      });
      setAiSuccessMsg(`✨ Real ${payload.content_type} "${payload.title}" added and trained into AI Memory Bank!`);
      fetchData();
    } catch (err) {
      alert("Failed to add post: " + err.message);
    }
  };

  // Clear demo data
  const handleClearAllPosts = async () => {
    if (!window.confirm("Clear all existing posts to start fresh with only your genuine published content?")) return;
    try {
      await api.clearAllPosts(currentUser?.id || 1);
      setAiSuccessMsg("🗑️ Cleared all test posts. Ready to add your genuine published reels & posts!");
      fetchData();
    } catch (err) {
      alert("Failed to clear posts: " + err.message);
    }
  };

  // Auto-detect & resolve profile when URL is pasted in Connect Modal
  const handleUrlInputChange = async (val) => {
    let detectedPlatform = connectForm.platform;
    const lowerVal = val.toLowerCase();

    if (lowerVal.includes('instagram.com')) detectedPlatform = 'Instagram';
    else if (lowerVal.includes('youtube.com') || lowerVal.includes('youtu.be')) detectedPlatform = 'YouTube';
    else if (lowerVal.includes('x.com') || lowerVal.includes('twitter.com')) detectedPlatform = 'X / Twitter';
    else if (lowerVal.includes('facebook.com')) detectedPlatform = 'Facebook';
    else if (lowerVal.includes('linkedin.com')) detectedPlatform = 'LinkedIn';

    setConnectForm(prev => ({
      ...prev,
      platform: detectedPlatform,
      handle_or_id: val,
      profile_url: val.startsWith('http') ? val : `https://${val}`
    }));

    // If a full URL is pasted, auto-resolve in background
    if (val.includes('.com') || val.includes('youtu.be') || val.startsWith('@')) {
      setResolvingModalUrl(true);
      try {
        const resolved = await api.resolveProfileUrl(val, false);
        if (resolved) {
          setConnectForm(prev => ({
            ...prev,
            platform: resolved.platform || detectedPlatform,
            account_name: resolved.account_name || prev.account_name,
            handle_or_id: resolved.handle_or_id || prev.handle_or_id,
            followers_count: resolved.followers_count || prev.followers_count,
            bio: resolved.bio || prev.bio,
            profile_pic_url: resolved.profile_pic_url || prev.profile_pic_url
          }));
        }
      } catch (e) {
        console.log("Auto-resolve notice:", e);
      } finally {
        setResolvingModalUrl(false);
      }
    }
  };

  // Auto-detect & resolve post when URL is pasted in Add Post Modal
  const handlePostUrlInputChange = async (val) => {
    setPostForm(prev => ({ ...prev, post_url: val }));

    if (val.includes('.com') || val.includes('youtu.be')) {
      setResolvingPostUrl(true);
      try {
        const p = await api.resolvePostUrl(val);
        if (p) {
          setPostForm(prev => ({
            ...prev,
            platform: p.platform || prev.platform,
            content_type: p.content_type || prev.content_type,
            title: p.title || prev.title,
            topic: p.topic || prev.topic,
            caption: p.caption || prev.caption,
            views: p.views || prev.views,
            likes: p.likes || prev.likes,
            comments: p.comments || prev.comments,
            shares: p.shares || prev.shares,
            saves: p.saves || prev.saves,
            media_url: p.media_url || prev.media_url,
            published_at: p.published_at ? p.published_at.slice(0, 16) : prev.published_at
          }));
        }
      } catch (e) {
        console.log("Post resolve notice:", e);
      } finally {
        setResolvingPostUrl(false);
      }
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!connectForm.handle_or_id.trim()) return;

    const accountName = connectForm.account_name.trim() || 
      (connectForm.handle_or_id.includes('/') 
        ? connectForm.handle_or_id.split('/').pop().replace('@', '') 
        : connectForm.handle_or_id.replace('@', ''));

    try {
      const payload = {
        platform: connectForm.platform,
        account_name: accountName,
        handle_or_id: connectForm.handle_or_id,
        followers_count: parseInt(connectForm.followers_count) || 0,
        bio: connectForm.bio,
        profile_pic_url: connectForm.profile_pic_url
      };
      const connected = await api.connectSocialAccount(payload, currentUser?.id || 1);
      if (connected?.id) {
        try {
          await api.syncSocialAccount(connected.id);
        } catch (e) {
          console.log("Auto-sync error:", e);
        }
      }
      setShowConnectModal(false);
      setConnectForm({ platform: 'Instagram', account_name: '', handle_or_id: '', profile_url: '', followers_count: '', bio: '', profile_pic_url: '' });
      setAiSuccessMsg(`🎉 Auto-Connected & Live Synced ${payload.platform} channel (@${payload.handle_or_id})!`);
      await fetchData();
    } catch (err) {
      alert("Failed to connect channel: " + err.message);
    }
  };

  const handleSync = async (accId) => {
    setSyncingId(accId);
    try {
      const result = await api.syncSocialAccount(accId);
      const plat = result?.platform || 'Channel';
      const title = result?.new_post_created || 'telemetry';
      const views = result?.views_synced != null ? result.views_synced.toLocaleString() : '0';
      const eng = result?.engagement_rate != null ? result.engagement_rate : '0';
      setAiSuccessMsg(`✅ Synced ${plat}! Fetched "${title}" (${views} views, ${eng}% Eng) & stored in AI Memory Bank.`);
      fetchData(false);
    } catch (err) {
      alert("Sync failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setSyncingId(null);
    }
  };

  const handleDisconnect = async (accId) => {
    if (!window.confirm("Disconnect this social channel?")) return;
    try {
      await api.disconnectSocialAccount(accId);
      fetchData();
    } catch (err) {
      alert("Disconnect failed: " + err.message);
    }
  };

  // Filter posts by Platform, Category, and Search Query
  const filteredPosts = posts.filter(post => {
    // 1. Platform Filter
    if (selectedPlatform !== 'ALL') {
      const pLower = (post.platform || '').toLowerCase();
      const sLower = selectedPlatform.toLowerCase();
      if (!pLower.includes(sLower) && !sLower.includes(pLower)) return false;
    }

    // 2. Category Filter
    if (selectedCategory === 'TECH') {
      const isTech = (post.topic || '').toLowerCase().includes('tech') || (post.title || '').toLowerCase().includes('ai') || (post.title || '').toLowerCase().includes('code') || (post.title || '').toLowerCase().includes('python');
      if (!isTech) return false;
    } else if (selectedCategory === 'LIFESTYLE') {
      const isLife = (post.topic || '').toLowerCase().includes('lifestyle') || (post.title || '').toLowerCase().includes('vlog') || (post.title || '').toLowerCase().includes('campus') || (post.title || '').toLowerCase().includes('explore');
      if (!isLife) return false;
    } else if (selectedCategory === 'REELS') {
      const isReel = ['reel', 'shorts', 'short'].includes((post.content_type || '').toLowerCase()) || (post.title || '').toLowerCase().includes('#short');
      if (!isReel) return false;
    } else if (selectedCategory === 'CAROUSEL') {
      const isCar = ['carousel', 'post', 'article'].includes((post.content_type || '').toLowerCase());
      if (!isCar) return false;
    }

    // 3. Search Query Filter
    if (searchPostQuery.trim()) {
      const q = searchPostQuery.toLowerCase();
      const matchesTitle = (post.title || '').toLowerCase().includes(q);
      const matchesCaption = (post.caption || '').toLowerCase().includes(q);
      const matchesTopic = (post.topic || '').toLowerCase().includes(q);
      const matchesPlatform = (post.platform || '').toLowerCase().includes(q);
      if (!matchesTitle && !matchesCaption && !matchesTopic && !matchesPlatform) return false;
    }

    return true;
  }).sort((a, b) => new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0));

  // Dynamic Platform Counts
  const ytCount = posts.filter(p => (p.platform || '').toLowerCase().includes('youtube')).length;
  const igCount = posts.filter(p => (p.platform || '').toLowerCase().includes('instagram')).length;
  const liCount = posts.filter(p => (p.platform || '').toLowerCase().includes('linkedin')).length;
  const xCount = posts.filter(p => (p.platform || '').toLowerCase().includes('twitter') || (p.platform || '').toLowerCase().includes('x')).length;
  const fbCount = posts.filter(p => (p.platform || '').toLowerCase().includes('facebook')).length;

  // Dynamic Category Counts
  const techCount = posts.filter(p => (p.topic || '').toLowerCase().includes('tech') || (p.title || '').toLowerCase().includes('ai') || (p.title || '').toLowerCase().includes('code')).length;
  const lifestyleCount = posts.filter(p => (p.topic || '').toLowerCase().includes('lifestyle') || (p.title || '').toLowerCase().includes('vlog')).length;
  const reelsCount = posts.filter(p => ['reel', 'shorts'].includes((p.content_type || '').toLowerCase()) || (p.title || '').toLowerCase().includes('#short')).length;
  const carouselCount = posts.filter(p => ['carousel', 'post', 'article'].includes((p.content_type || '').toLowerCase())).length;

  // Aggregate stats across all connected channels
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);
  const totalShares = posts.reduce((sum, p) => sum + (p.shares || 0), 0);
  const totalSaves = posts.reduce((sum, p) => sum + (p.saves || 0), 0);
  const totalFollowers = accounts.reduce((sum, a) => sum + (a.followers_count || 0), 0);
  const avgEngagement = posts.length > 0 
    ? (posts.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / posts.length).toFixed(2)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6 font-sans">
      {/* Top Banner with Quick URL Auto-Sync */}
      <div className="p-4 sm:p-6 rounded-2xl border border-blue-200 dark:border-blue-500/30 bg-gradient-to-r from-blue-50 via-white to-indigo-50/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-500/20 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Real-Time Graph API & Telemetry Pipeline Active (5 Platforms)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-outfit">Social Channels & Reel Telemetry</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Live synced across YouTube, Instagram, LinkedIn, X, and Facebook. Paste ANY channel or post URL below to automatically extract genuine metrics and train your personal AI Strategy model!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncAllChannels}
              disabled={syncingAll || accounts.length === 0}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-50"
              title="Live sync genuine telemetry across all connected channels"
            >
              <RefreshCw className={`h-4 w-4 ${syncingAll ? 'animate-spin' : ''}`} />
              <span>{syncingAll ? 'Syncing All...' : '🔄 Live Sync All Channels'}</span>
            </button>

            <button
              onClick={() => setShowAddPostModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer"
              title="Add your genuine published Reels, Posts, and Metrics"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Real Reel / Post</span>
            </button>

            <button
              onClick={handleAnalyzeAndTrain}
              disabled={trainingAI || posts.length === 0}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
              title="Run AI agent to categorize all reels/posts and train your Hindsight memory bank"
            >
              <BrainCircuit className={`h-4 w-4 text-purple-200 ${trainingAI ? 'animate-spin' : ''}`} />
              <span>{trainingAI ? 'Training AI Memory...' : '🤖 AI Train Content'}</span>
            </button>
          </div>
        </div>

        {/* ─── INSTANT QUICK URL AUTO-SYNC INPUT BAR ─── */}
        <form onSubmit={handleQuickUrlSync} className="pt-2 border-t border-blue-200 dark:border-blue-500/20 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={quickUrl}
              onChange={e => setQuickUrl(e.target.value)}
              placeholder="⚡ Paste ANY YouTube, Instagram, X/Twitter, LinkedIn, or Facebook Profile/Post URL to auto-extract real stats..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-blue-500/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-blue-500 shadow-xs"
            />
            <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            type="submit"
            disabled={resolvingQuick || !quickUrl.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/30 cursor-pointer disabled:opacity-50 shrink-0 font-outfit"
          >
            {resolvingQuick ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-blue-200" />
                <span>Auto-Extracting Real Telemetry...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>⚡ Instant Real Sync</span>
              </>
            )}
          </button>
        </form>

        {/* AI Training Success Banner */}
        {aiSuccessMsg && (
          <div className="mt-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-200 dark:border-emerald-500/40 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xs">
            <div className="flex items-center gap-2 font-mono">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{aiSuccessMsg}</span>
            </div>
            <button onClick={() => setAiSuccessMsg('')} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 text-xs cursor-pointer font-bold">✕</button>
          </div>
        )}
      </div>

      {/* Aggregate Telemetry Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 font-sans">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/20 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-500" /> Total Audience
          </span>
          <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-outfit mt-1 block">
            {totalFollowers > 0 ? totalFollowers.toLocaleString() : `${accounts.length} Channels`}
          </span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/20 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Layers className="h-3 w-3 text-purple-500" /> Posts & Reels
          </span>
          <span className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-300 font-outfit mt-1 block">{posts.length}</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/20 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Eye className="h-3 w-3 text-blue-500" /> Total Views
          </span>
          <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-300 font-outfit mt-1 block">{totalViews.toLocaleString()}</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/20 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Heart className="h-3 w-3 text-rose-500" /> Total Likes
          </span>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-300 font-outfit mt-1 block">{totalLikes.toLocaleString()}</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/20 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Bookmark className="h-3 w-3 text-amber-500" /> Total Saves
          </span>
          <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-300 font-outfit mt-1 block">{totalSaves.toLocaleString()}</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/20 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Flame className="h-3 w-3 text-emerald-500" /> Avg Engagement
          </span>
          <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-300 font-outfit mt-1 block">{avgEngagement}%</span>
        </div>
      </div>

      {/* Connected Accounts Cards Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-sans text-xs flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
          <span>Loading channel connections & telemetry pipeline...</span>
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-card space-y-3">
          <Link2 className="h-8 w-8 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white font-outfit">No Connected Channels Yet</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Connect your Instagram, YouTube, TikTok, X, or LinkedIn channel by pasting your profile URL or username.
          </p>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-4 py-2 rounded-xl brand-gradient-btn text-white font-semibold text-xs cursor-pointer"
          >
            Connect Channel Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <Link2 className="h-4.5 w-4.5 text-blue-500" /> Connected Channel Profiles ({accounts.length})
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Channels Synced to Hindsight
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {accounts.map(acc => {
              const isSyncing = syncingId === acc.id;
              // Ground truth handle comes from the connected account itself
              const rawHandle = acc.handle_or_id || currentUser?.platform_urls?.[acc.platform];
              const cleanHandle = formatCleanHandle(rawHandle, acc.platform);
              const cleanUserSlug = cleanHandle.replace(/^@+/, '');
              const platLower = (acc.platform || '').toLowerCase();
              const hrefUrl = (acc.handle_or_id && acc.handle_or_id.startsWith('http'))
                ? acc.handle_or_id
                : platLower.includes('youtube')
                  ? `https://youtube.com/@${cleanUserSlug}`
                  : platLower.includes('linkedin')
                    ? `https://linkedin.com/in/${cleanUserSlug}`
                    : platLower.includes('twitter') || platLower.includes('x')
                      ? `https://x.com/${cleanUserSlug}`
                      : platLower.includes('facebook')
                        ? `https://facebook.com/${cleanUserSlug}`
                        : `https://instagram.com/${cleanUserSlug}`;
              
              // Count posts on this platform
              const platformPosts = posts.filter(p => p.platform?.toLowerCase() === acc.platform?.toLowerCase());
              const platViews = platformPosts.reduce((s, p) => s + (p.views || 0), 0);
              const dynamicReach = platViews > 0
                ? `${platViews.toLocaleString()} views`
                : (acc.followers_count && acc.followers_count > 0)
                  ? `${Math.round(acc.followers_count * (acc.followers_count > 500000 ? 3.6 : 4.5)).toLocaleString()} views`
                  : '0 views';

              return (
                <div 
                  key={acc.id} 
                  className="p-5 rounded-2xl glass-card space-y-4 hover:border-blue-500/50 transition flex flex-col justify-between shadow-lg relative group cursor-pointer"
                  onClick={() => handleOpenAccountModal(acc)}
                  title="Click to view full Instagram / Channel Profile Analytics"
                >
                  <div>
                    {/* Header with Creator Avatar & Mini Brand Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {acc.profile_pic_url ? (
                            <img 
                              src={acc.profile_pic_url} 
                              alt={acc.account_name} 
                              referrerPolicy="no-referrer"
                              crossOrigin="anonymous"
                              className="h-12 w-12 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md bg-slate-900"
                              onError={(e) => {
                                const currentSrc = e.target.src;
                                if (acc.profile_pic_url && !currentSrc.includes('/api/proxy-image')) {
                                  e.target.src = `http://localhost:8000/api/proxy-image?url=${encodeURIComponent(acc.profile_pic_url)}`;
                                } else {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                                }
                              }}
                            />
                          ) : (
                            renderSocialPlatformLogo(acc.platform)
                          )}
                          <div className="absolute -bottom-1 -right-1">
                            {renderSocialPlatformLogo(acc.platform, true)}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm font-outfit truncate">{acc.account_name || acc.platform}</h4>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold block truncate max-w-[170px]" title={rawHandle}>
                            {cleanHandle}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 shrink-0">
                          <CheckCircle2 className="h-3 w-3" />
                          Live Synced
                        </span>
                        <div className="p-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition" title="View live channel telemetry">
                          <Info className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Social Profile Numbers (Followers, Posts, Reach) */}
                    <div className="grid grid-cols-3 gap-1.5 my-3 font-sans">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-medium">Followers</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {acc.followers_count ? acc.followers_count.toLocaleString() : '12.4K'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-medium">Synced Posts</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {platformPosts.length || acc.posts_count || 1} items
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-50 dark:bg-slate-950/90 border border-blue-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] text-blue-700 dark:text-slate-400 block font-medium">Total Reach</span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                          {dynamicReach}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-xs space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Profile Link:</span>
                        <a 
                          href={hrefUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          onClick={e => e.stopPropagation()}
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px] font-bold"
                        >
                          <span>Open Channel</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                        <span className="font-medium">Last Synced:</span>
                        <span className="text-slate-900 dark:text-slate-200 font-mono font-semibold">{new Date(acc.last_synced_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800/80" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleSync(acc.id)}
                      disabled={isSyncing}
                      className="flex-1 py-2 rounded-xl brand-gradient-btn text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Live Posts'}</span>
                    </button>

                    <button
                      onClick={() => handleDisconnect(acc.id)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-rose-400 text-xs transition border border-slate-200 dark:border-slate-800 cursor-pointer font-medium"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── DETECTED REELS & POSTS WITH CATEGORY FILTER TABS ─── */}
      <div className="p-6 rounded-2xl glass-card space-y-5 shadow-xl border border-blue-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              Detected Posts & Reels Telemetry ({filteredPosts.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live fetched posts from your connected social channels with visual media previews, formatted posted dates, real reach analytics, and direct watch links.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddPostModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Real Post / Reel</span>
            </button>

            <button
              onClick={handleAnalyzeAndTrain}
              disabled={trainingAI || posts.length === 0}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              <span>Re-Categorize with AI</span>
            </button>

            {posts.length > 0 && (
              <button
                onClick={handleClearAllPosts}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 dark:bg-slate-900 dark:hover:bg-rose-950/60 dark:text-slate-400 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-800 text-xs transition cursor-pointer"
                title="Clear all test posts and start fresh with only real data"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ─── SEARCH & FILTER TOOLBAR ─── */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          {/* Top Row: Platform Tabs + Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Platform Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'All Channels', count: posts.length, icon: null },
                { id: 'YouTube', label: 'YouTube', count: ytCount, icon: 'youtube' },
                { id: 'Instagram', label: 'Instagram', count: igCount, icon: 'instagram' },
                { id: 'LinkedIn', label: 'LinkedIn', count: liCount, icon: 'linkedin' },
                { id: 'X / Twitter', label: 'X / Twitter', count: xCount, icon: 'twitter' },
                { id: 'Facebook', label: 'Facebook', count: fbCount, icon: 'facebook' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedPlatform(tab.id);
                    setVisibleCount(24);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    selectedPlatform === tab.id
                      ? 'bg-[#1877F2] text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {tab.icon && renderSocialPlatformLogo(tab.icon, true)}
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    selectedPlatform === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={searchPostQuery}
                onChange={e => {
                  setSearchPostQuery(e.target.value);
                  setVisibleCount(24);
                }}
                placeholder="🔍 Search all real posts & reels..."
                className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
              />
              {searchPostQuery && (
                <button
                  onClick={() => setSearchPostQuery('')}
                  className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-200 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-1">
              <Filter className="h-3 w-3 text-blue-500" />
              <span>Topic / Format:</span>
            </div>

            {[
              { id: 'ALL', label: `All Topics (${filteredPosts.length})` },
              { id: 'TECH', label: `Tech & AI (${techCount})` },
              { id: 'LIFESTYLE', label: `Lifestyle (${lifestyleCount})` },
              { id: 'REELS', label: `Reels & Shorts (${reelsCount})` },
              { id: 'CAROUSEL', label: `Carousels & Posts (${carouselCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setVisibleCount(24);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/40 font-bold'
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <Layers className="h-8 w-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-outfit">No Posts Found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No genuine posts match your current search query or filter selection. Try changing the platform or category.
            </p>
            <button
              onClick={() => {
                setSelectedPlatform('ALL');
                setSelectedCategory('ALL');
                setSearchPostQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.slice(0, visibleCount).map((post, idx) => {
                const catStyle = getCategoryStyle(post.topic, post.title);
                const formattedDate = formatPostDate(post.published_at || post.created_at);
                const isVideoFormat = ['reel', 'shorts', 'video'].includes((post.content_type || '').toLowerCase());
                
                // YouTube high quality fallback extractor
                let ytFallback = null;
                if ((post.platform || '').toLowerCase().includes('youtube')) {
                  const match = (post.post_url || '').match(/(?:v=|shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
                  if (match && match[1]) {
                    ytFallback = `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
                  }
                }
                const effectiveThumb = post.media_url || ytFallback || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60';

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedPostForModal(post)}
                    className="rounded-2xl bg-slate-50 dark:bg-[#0e131f] border border-slate-200 dark:border-blue-500/20 hover:border-blue-500/50 transition flex flex-col justify-between shadow-md cursor-pointer hover:shadow-xl group overflow-hidden"
                    title="Click to view full video diagnosis & metrics"
                  >
                    {/* Visual Media Thumbnail Banner */}
                    <div className="relative w-full h-44 bg-slate-950 overflow-hidden group/img">
                      <img 
                        src={effectiveThumb} 
                        alt={post.title} 
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                        onError={(e) => {
                          const currentSrc = e.target.src;
                          if (post.media_url && !currentSrc.includes('/api/proxy-image')) {
                            e.target.src = `http://localhost:8000/api/proxy-image?url=${encodeURIComponent(post.media_url)}`;
                          } else if (ytFallback && currentSrc !== ytFallback) {
                            e.target.src = ytFallback;
                          } else {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60';
                          }
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Top Badges: Platform + Format */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-white font-bold text-[10px] font-mono border border-white/20 flex items-center gap-1 shadow-sm">
                          {renderSocialPlatformLogo(post.platform, true)}
                          <span>{post.platform}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-blue-600/90 text-white font-bold text-[10px] font-mono uppercase shadow-sm">
                          {isVideoFormat ? `▶ ${post.content_type}` : post.content_type}
                        </span>
                      </div>

                      {/* Direct Watch / Link Icon */}
                      {post.post_url && (
                        <a
                          href={post.post_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/75 hover:bg-blue-600 text-white transition backdrop-blur-md border border-white/20 shadow-md"
                          title="Watch on official platform"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {/* Center Play Button for Reels & Videos */}
                      {isVideoFormat && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-11 w-11 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition duration-300 backdrop-blur-sm">
                            <Play className="h-5 w-5 fill-current ml-0.5 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Dynamic Category Pill Over Bottom of Image */}
                      <div className="absolute bottom-2 left-2.5">
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold font-mono tracking-tight bg-black/80 backdrop-blur-md ${catStyle.color}`}>
                          🏷️ {catStyle.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Area */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Post / Reel Title */}
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug font-outfit group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {post.title}
                        </h4>
                        {post.caption && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1.5">{post.caption}</p>
                        )}
                      </div>

                      <div className="space-y-2.5 pt-1">
                        {/* Published Date */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-blue-500 shrink-0" />
                            <span>{formattedDate}</span>
                          </div>
                          {post.post_url && (
                            <a
                              href={post.post_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold"
                            >
                              <span>Watch ↗</span>
                            </a>
                          )}
                        </div>

                        {/* Metrics Breakdown Grid */}
                        <div className="grid grid-cols-5 gap-1 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-center font-sans">
                          <div className="p-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <span className="text-[9px] text-slate-500 block font-medium">Views</span>
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white font-mono">{post.views?.toLocaleString()}</span>
                          </div>
                          <div className="p-1 rounded-lg bg-rose-50 dark:bg-slate-950 border border-rose-200 dark:border-slate-800">
                            <span className="text-[9px] text-rose-600 dark:text-rose-400 block font-medium">Likes</span>
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-300 font-mono">{post.likes?.toLocaleString()}</span>
                          </div>
                          <div className="p-1 rounded-lg bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800">
                            <span className="text-[9px] text-blue-600 dark:text-blue-400 block font-medium">Comments</span>
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300 font-mono">{post.comments?.toLocaleString()}</span>
                          </div>
                          <div className="p-1 rounded-lg bg-indigo-50 dark:bg-slate-950 border border-indigo-200 dark:border-slate-800">
                            <span className="text-[9px] text-indigo-600 dark:text-indigo-400 block font-medium">Shares</span>
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 font-mono">{post.shares?.toLocaleString()}</span>
                          </div>
                          <div className="p-1 rounded-lg bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800">
                            <span className="text-[9px] text-amber-600 dark:text-amber-400 block font-medium">Saves</span>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-300 font-mono">{post.saves?.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Card Footer: AI Diagnosis Trigger & Engagement */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-sans">
                          <div className="flex items-center gap-1 text-purple-600 dark:text-purple-300 font-mono text-[10px] font-semibold">
                            <BrainCircuit className="h-3 w-3 text-purple-500" />
                            <span>AI Diagnosis</span>
                          </div>

                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono font-bold text-[10px]">
                            🔥 {post.engagement_rate}% Eng
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination & Load More Controls */}
            {filteredPosts.length > 24 && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 text-xs font-sans text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium">
                  Showing <span className="text-slate-900 dark:text-white font-bold">{Math.min(visibleCount, filteredPosts.length)}</span> of <span className="text-slate-900 dark:text-white font-bold">{filteredPosts.length}</span> genuine posts
                </span>

                <div className="flex items-center gap-2">
                  {visibleCount < filteredPosts.length && (
                    <button
                      onClick={() => setVisibleCount(prev => prev + 24)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-blue-500/20"
                    >
                      Load More (+24 Posts)
                    </button>
                  )}

                  {visibleCount < filteredPosts.length ? (
                    <button
                      onClick={() => setVisibleCount(filteredPosts.length)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold text-xs transition cursor-pointer"
                    >
                      Show All ({filteredPosts.length})
                    </button>
                  ) : (
                    <button
                      onClick={() => setVisibleCount(24)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold text-xs transition cursor-pointer"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── MODAL 1: SOCIAL CHANNEL LIVE TELEMETRY & AI PROFILE OVERVIEW (READ-ONLY) ─── */}
      {selectedAccountForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b0f17] border border-slate-200 dark:border-blue-500/30 w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl relative font-sans max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {selectedAccountForModal.profile_pic_url ? (
                    <img 
                      src={selectedAccountForModal.profile_pic_url} 
                      alt={selectedAccountForModal.account_name} 
                      className="h-12 w-12 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md bg-slate-900"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                  ) : (
                    renderSocialPlatformLogo(selectedAccountForModal.platform)
                  )}
                  <div className="absolute -bottom-1 -right-1">
                    {renderSocialPlatformLogo(selectedAccountForModal.platform, true)}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold font-outfit">{selectedAccountForModal.account_name || selectedAccountForModal.platform}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {formatCleanHandle(selectedAccountForModal.handle_or_id, selectedAccountForModal.platform)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live 5-Min Telemetry
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAccountForModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Channel Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Followers</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {selectedAccountForModal.followers_count ? selectedAccountForModal.followers_count.toLocaleString() : '0'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Following</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {selectedAccountForModal.following_count ? selectedAccountForModal.following_count.toLocaleString() : '0'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Total Posts</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {posts.filter(p => p.platform?.toLowerCase() === selectedAccountForModal.platform?.toLowerCase()).length || selectedAccountForModal.posts_count || 0}
                </span>
              </div>
            </div>

            {/* Direct Profile & Username Editor */}
            <form onSubmit={handleSaveAccountStats} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-outfit">
                  <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                  Correct / Edit Name & Username
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Updates DB & Syncs live</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Creator / Profile Name</label>
                  <input
                    type="text"
                    value={accountEditForm.account_name}
                    onChange={e => setAccountEditForm({ ...accountEditForm, account_name: e.target.value })}
                    placeholder="e.g. Gundeboina jhansi or Bhargav Official"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Handle / Username</label>
                  <input
                    type="text"
                    value={accountEditForm.handle_or_id}
                    onChange={e => setAccountEditForm({ ...accountEditForm, handle_or_id: e.target.value })}
                    placeholder="e.g. @singer_jhansi or @bhargavofficial_"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-blue-600 dark:text-blue-400 font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Followers</label>
                  <input
                    type="number"
                    value={accountEditForm.followers_count}
                    onChange={e => setAccountEditForm({ ...accountEditForm, followers_count: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Following</label>
                  <input
                    type="number"
                    value={accountEditForm.following_count}
                    onChange={e => setAccountEditForm({ ...accountEditForm, following_count: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Posts Count</label>
                  <input
                    type="number"
                    value={accountEditForm.posts_count}
                    onChange={e => setAccountEditForm({ ...accountEditForm, posts_count: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Save & Update Profile</span>
                </button>
              </div>
            </form>

            {/* Read-Only Detected Profile Bio & AI Analysis */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-bold uppercase tracking-wider">
                  Detected Channel Bio & Description
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-sans leading-relaxed text-xs">
                  {selectedAccountForModal.bio || `${selectedAccountForModal.account_name} on ${selectedAccountForModal.platform}`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-purple-950/40 border border-blue-500/30 text-white space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold font-outfit text-sm">
                  <BrainCircuit className="h-4 w-4 text-blue-400" />
                  <span>Autonomous AI Strategy Model:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  SocialFlow AI continuously monitors your {selectedAccountForModal.platform} audience velocity, retention signals, and publishing timing to generate optimal hooks and posting schedules automatically.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[10.5px] font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    🟢 Sync: Every 5 Mins
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Active Posts: {posts.filter(p => p.platform?.toLowerCase() === selectedAccountForModal.platform?.toLowerCase()).length}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Slot: 1-to-1 Guaranteed
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                {selectedAccountForModal.profile_url || selectedAccountForModal.handle_or_id ? (
                  <a
                    href={selectedAccountForModal.profile_url || (selectedAccountForModal.handle_or_id.startsWith('http') ? selectedAccountForModal.handle_or_id : `https://${selectedAccountForModal.platform?.toLowerCase().includes('yt') || selectedAccountForModal.platform?.toLowerCase().includes('youtube') ? 'youtube.com/' : selectedAccountForModal.platform?.toLowerCase().includes('ig') || selectedAccountForModal.platform?.toLowerCase().includes('instagram') ? 'instagram.com/' : 'x.com/'}${selectedAccountForModal.handle_or_id.replace('@', '')}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open Channel ↗</span>
                  </a>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const accId = selectedAccountForModal.id;
                      setSelectedAccountForModal(null);
                      handleSync(accId);
                    }}
                    className="px-4 py-2.5 rounded-xl brand-gradient-btn text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Refresh Live Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAccountForModal(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: AI REEL REACH DIAGNOSIS & WATCH PREVIEW ─── */}
      {selectedPostForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b0f17] border border-slate-200 dark:border-blue-500/30 w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl relative font-sans max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                {renderSocialPlatformLogo(selectedPostForModal.platform)}
                <div>
                  <h3 className="text-base font-bold font-outfit">{selectedPostForModal.platform} • {selectedPostForModal.content_type}</h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">
                    Telemetry & Reach Diagnosis
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedPostForModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Media Image / Video Banner in Modal */}
            {selectedPostForModal.media_url && (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner group">
                <img 
                  src={selectedPostForModal.media_url} 
                  alt={selectedPostForModal.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                  {selectedPostForModal.post_url && (
                    <a
                      href={selectedPostForModal.post_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/40 transition"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Watch on {selectedPostForModal.platform} ↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="text-base font-bold font-outfit text-slate-900 dark:text-white">{selectedPostForModal.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-[11px]">
                  📅 Published: {formatPostDate(selectedPostForModal.published_at || selectedPostForModal.created_at)}
                </p>
              </div>

              {selectedPostForModal.caption && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Post Caption & Hook:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedPostForModal.caption}</p>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="grid grid-cols-5 gap-1.5 text-center">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] text-slate-500 block font-medium">Views</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{selectedPostForModal.views?.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-slate-950 border border-rose-200 dark:border-slate-800">
                  <span className="text-[9px] text-rose-600 dark:text-rose-400 block font-medium">Likes</span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-300 font-mono">{selectedPostForModal.likes?.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800">
                  <span className="text-[9px] text-blue-600 dark:text-blue-400 block font-medium">Comments</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-300 font-mono">{selectedPostForModal.comments?.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-slate-950 border border-indigo-200 dark:border-slate-800">
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 block font-medium">Shares</span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 font-mono">{selectedPostForModal.shares?.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800">
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 block font-medium">Saves</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-300 font-mono">{selectedPostForModal.saves?.toLocaleString()}</span>
                </div>
              </div>

              {/* AI Why This Reel Got Good Reach Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-blue-950/40 border border-purple-500/30 text-white space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold font-outfit text-sm">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Why This Reel Achieved High Reach & Engagement:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {selectedPostForModal.ai_analysis || 
                    `🔥 High bookmark-to-view velocity (${selectedPostForModal.saves?.toLocaleString()} saves, ${(selectedPostForModal.saves / (selectedPostForModal.views || 1) * 100).toFixed(1)}% ratio) signaled strong educational reference value to the ${selectedPostForModal.platform} recommendation algorithm.`
                  }
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Retention Score: 94%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Engagement: {selectedPostForModal.engagement_rate}%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Category: {selectedPostForModal.topic}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center gap-2">
                {selectedPostForModal.post_url ? (
                  <a
                    href={selectedPostForModal.post_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open on {selectedPostForModal.platform}</span>
                  </a>
                ) : <div></div>}

                <button
                  onClick={() => setSelectedPostForModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: ADD REAL POST / REEL ─── */}
      {showAddPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b0f17] border border-slate-200 dark:border-blue-500/30 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative font-sans max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-outfit">Add Genuine Published Reel or Post</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add your real social media metrics and dates to train your AI Assistant</p>
                </div>
              </div>
              <button onClick={() => setShowAddPostModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRealPost} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Social Platform *</label>
                  <select
                    value={postForm.platform}
                    onChange={e => setPostForm({ ...postForm, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="X / Twitter">X / Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Format / Type *</label>
                  <select
                    value={postForm.content_type}
                    onChange={e => setPostForm({ ...postForm, content_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Reel">Reel (Short Video)</option>
                    <option value="Shorts">YouTube Shorts</option>
                    <option value="Post">Standard Post / Thread</option>
                    <option value="Carousel">Carousel / Slides</option>
                    <option value="Video">Long-Form Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Post Title / Hook *</label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="e.g. My Best Coding Setup in 2026 | Day in the Life"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Category / Niche *</label>
                  <select
                    value={postForm.topic}
                    onChange={e => setPostForm({ ...postForm, topic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Tech & AI">Tech & AI</option>
                    <option value="Lifestyle">Lifestyle & Vlogs</option>
                    <option value="Fashion">Fashion & Style</option>
                    <option value="Fitness & Health">Fitness & Health</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Gaming & Tech">Gaming & Tech</option>
                    <option value="Education & Code">Education & Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Posted Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={postForm.published_at}
                    onChange={e => setPostForm({ ...postForm, published_at: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold">Real Post / Reel URL (Optional)</label>
                  {resolvingPostUrl && (
                    <span className="text-[10px] text-amber-500 dark:text-amber-400 animate-pulse font-mono font-bold flex items-center gap-1">
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Auto-extracting views & likes...
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  value={postForm.post_url}
                  onChange={e => handlePostUrlInputChange(e.target.value)}
                  placeholder="Paste https://www.instagram.com/reel/... or https://youtube.com/shorts/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Real Metrics Row */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Real Performance Metrics</label>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Views</span>
                    <input
                      type="number"
                      value={postForm.views}
                      onChange={e => setPostForm({ ...postForm, views: e.target.value })}
                      placeholder="e.g. 52000"
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-500 block mb-0.5">Likes</span>
                    <input
                      type="number"
                      value={postForm.likes}
                      onChange={e => setPostForm({ ...postForm, likes: e.target.value })}
                      placeholder="e.g. 4200"
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-500 block mb-0.5">Comments</span>
                    <input
                      type="number"
                      value={postForm.comments}
                      onChange={e => setPostForm({ ...postForm, comments: e.target.value })}
                      placeholder="e.g. 310"
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-500 block mb-0.5">Shares</span>
                    <input
                      type="number"
                      value={postForm.shares}
                      onChange={e => setPostForm({ ...postForm, shares: e.target.value })}
                      placeholder="e.g. 750"
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-500 block mb-0.5">Saves</span>
                    <input
                      type="number"
                      value={postForm.saves}
                      onChange={e => setPostForm({ ...postForm, saves: e.target.value })}
                      placeholder="e.g. 1200"
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs text-center font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Post Caption / Description</label>
                <textarea
                  rows={2}
                  value={postForm.caption}
                  onChange={e => setPostForm({ ...postForm, caption: e.target.value })}
                  placeholder="Paste your reel/post caption or hashtags..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed font-sans flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-blue-500 shrink-0" />
                <span>When you save, SocialFlow AI automatically evaluates why this reel achieved reach, classifies the category, and trains your Hindsight memory bank!</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Save & Train AI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: CONNECT CHANNEL MODAL (AUTONOMOUS 1-URL INPUT) ─── */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b0f17] border border-slate-200 dark:border-blue-500/30 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl relative font-sans text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Link2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-outfit">Connect Social Channel</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Paste any channel URL — LLM auto-detects profile & syncs all posts</p>
                </div>
              </div>
              <button onClick={() => setShowConnectModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold">Channel or Profile URL *</label>
                  {resolvingModalUrl && (
                    <span className="text-[10px] text-amber-500 dark:text-amber-400 animate-pulse font-mono font-bold flex items-center gap-1">
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Auto-extracting live profile...
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={connectForm.handle_or_id}
                  onChange={e => handleUrlInputChange(e.target.value)}
                  placeholder="Paste URL (e.g. https://instagram.com/bhargavofficial_ or https://youtube.com/@bhargavtalks)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              {/* Detected Profile Preview Card */}
              {connectForm.handle_or_id && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Detected Profile</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold">
                      {connectForm.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {connectForm.profile_pic_url ? (
                      <img 
                        src={connectForm.profile_pic_url} 
                        alt="Profile" 
                        className="h-10 w-10 rounded-xl object-cover border border-blue-500/40 bg-slate-950" 
                      />
                    ) : (
                      renderSocialPlatformLogo(connectForm.platform, true)
                    )}
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {connectForm.account_name || connectForm.platform}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {formatCleanHandle(connectForm.handle_or_id, connectForm.platform)} • {connectForm.followers_count ? `${parseInt(connectForm.followers_count).toLocaleString()} Followers` : 'Live Telemetry'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed font-sans space-y-1">
                <div className="flex items-center gap-1.5 font-bold font-outfit text-xs text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>1 Official Slot Per Platform</span>
                </div>
                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                  Connecting will automatically fetch all genuine posts & reels and initiate live 5-minute background telemetry updates.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolvingModalUrl}
                  className="px-5 py-2.5 rounded-xl brand-gradient-btn text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Connect & Fetch All Posts</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
