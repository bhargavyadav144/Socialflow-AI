import React, { useState, useEffect } from 'react';
import { Megaphone, DollarSign, TrendingUp, Plus, Trash2, Video, CheckCircle2, Sparkles, Filter, Award, X } from 'lucide-react';
import { api } from '../services/api';

export default function PromotionsPage({ currentUser }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState('ALL');

  const [formData, setFormData] = useState({
    title: '',
    platform: currentUser?.connected_platforms?.[0] || 'YouTube',
    content_type: 'Video',
    topic: currentUser?.content_types?.[0] || 'Tech',
    brand_name: '',
    sponsorship_amount: '',
    promotion_type: 'Sponsored Video',
    caption: '',
    views: '',
    likes: '',
    comments: '',
    shares: ''
  });

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await api.getPosts({ is_promotion: true, user_id: currentUser?.id || 1 });
      setPromotions(data);
    } catch (err) {
      console.error("Failed to load promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [currentUser]);

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.brand_name) {
      alert("Please provide video title and brand name!");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        platform: formData.platform,
        content_type: formData.content_type,
        topic: formData.topic,
        caption: formData.caption,
        is_promotion: true,
        brand_name: formData.brand_name,
        sponsorship_amount: parseFloat(formData.sponsorship_amount) || 0,
        promotion_type: formData.promotion_type,
        views: parseInt(formData.views) || 0,
        likes: parseInt(formData.likes) || 0,
        comments: parseInt(formData.comments) || 0,
        shares: parseInt(formData.shares) || 0,
        saves: 0
      };

      await api.createPost(payload, currentUser?.id || 1);
      setShowAddModal(false);
      setFormData({
        title: '',
        platform: currentUser?.connected_platforms?.[0] || 'YouTube',
        content_type: 'Video',
        topic: currentUser?.content_types?.[0] || 'Tech',
        brand_name: '',
        sponsorship_amount: '',
        promotion_type: 'Sponsored Video',
        caption: '',
        views: '',
        likes: '',
        comments: '',
        shares: ''
      });
      fetchPromotions();
    } catch (err) {
      alert("Failed to create promotional post: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this promotional video record?")) return;
    try {
      await api.deletePost(id);
      fetchPromotions();
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  const filteredPromotions = promotions.filter(p => {
    if (filterPlatform !== 'ALL' && p.platform !== filterPlatform) return false;
    return true;
  });

  const totalRevenue = promotions.reduce((acc, p) => acc + (p.sponsorship_amount || 0), 0);
  const avgEngagement = promotions.length > 0 
    ? (promotions.reduce((acc, p) => acc + (p.engagement_rate || 0), 0) / promotions.length).toFixed(1)
    : 0;

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-amber-200 dark:border-purple-500/20 bg-gradient-to-r from-amber-50 via-white to-purple-50 dark:from-purple-950/40 dark:via-slate-900/60 dark:to-slate-900/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
              <Megaphone className="h-3.5 w-3.5" /> Brand Sponsorship Hub
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Vectorize Hindsight Tracked</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-outfit">
            Promotional Videos & Brand Deals
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Organize brand sponsorships, contracts, and deal performance synced with AI memory.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Promotional Video
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono truncate">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Recorded brand deals</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Promotions</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            {promotions.length}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Sponsored campaigns</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Engagement</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            {avgEngagement}%
          </p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">Retention quality</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Memory Status</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-cyan-300 mt-2 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-cyan-400" /> Synced
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">AI retains sponsor ROI</p>
        </div>
      </div>

      {/* Filters & Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Platform:</span>
            <div className="flex gap-1.5 flex-wrap">
              {['ALL', 'YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter/X'].map(plat => (
                <button
                  key={plat}
                  onClick={() => setFilterPlatform(plat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    filterPlatform === plat 
                      ? 'bg-blue-600 text-white shadow-xs font-bold' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Showing {filteredPromotions.length} promotional items
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            Loading promotional video records...
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-200 dark:border-amber-500/20 text-amber-500">
              <Megaphone className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">No Promotional Videos Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Any video tagged as a promotion or brand partnership will automatically route here. Click below to add your first sponsored video!
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer shadow-sm"
            >
              Add First Sponsored Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredPromotions.map(item => (
              <div 
                key={item.id} 
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/20 flex flex-col justify-between hover:border-amber-400 dark:hover:border-amber-500/40 transition shadow-xs group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 text-[11px] font-semibold flex items-center gap-1">
                      <Award className="h-3 w-3" /> {item.brand_name || 'Brand Partner'}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      ${item.sponsorship_amount?.toLocaleString() || '0'} Deal
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 mb-1">
                      {item.platform} • {item.promotion_type || 'Sponsored Video'}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  {item.caption && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                      "{item.caption}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400">Views</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{(item.views || 0).toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400">Likes</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{(item.likes || 0).toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400">Eng Rate</span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{item.engagement_rate}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-blue-600 dark:text-cyan-400 flex items-center gap-1 font-mono">
                      <Sparkles className="h-3 w-3" /> Hindsight Memorized
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-amber-500/30 p-5 sm:p-6 space-y-4 bg-white dark:bg-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">Add Promotional Video / Deal</h2>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromotion} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video / Post Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ultimate AI Tools Review (Sponsored by TechBrand)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-amber-400 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand / Sponsor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NordVPN, Notion, Raycon"
                    value={formData.brand_name}
                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-amber-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sponsorship Value ($)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={formData.sponsorship_amount}
                    onChange={(e) => setFormData({ ...formData, sponsorship_amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-amber-400 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                  >
                    {['YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter/X', 'LinkedIn', 'Twitch'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Content Type</label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                  >
                    {['Video', 'Reel', 'Short', 'Post', 'Story', 'Stream'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Promotion Deal Type</label>
                  <select
                    value={formData.promotion_type}
                    onChange={(e) => setFormData({ ...formData, promotion_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                  >
                    {['Sponsored Video', 'Affiliate Pitch', 'Brand Deal', 'Product Placement'].map(dt => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Views</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Likes</label>
                  <input
                    type="number"
                    placeholder="850"
                    value={formData.likes}
                    onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Comments</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Shares</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={formData.shares}
                    onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Caption / Integration Notes</label>
                <textarea
                  rows="2"
                  placeholder="Sponsored integration at 02:15 timestamp..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer shadow-sm"
                >
                  Save Promotional Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
