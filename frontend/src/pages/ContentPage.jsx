import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Bookmark,
  X,
  Megaphone,
  Award
} from 'lucide-react';
import { api } from '../services/api';

export default function ContentPage({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    topic: 'General',
    platform: 'Instagram',
    content_type: 'Reel',
    caption: '',
    is_promotion: false,
    brand_name: '',
    sponsorship_amount: '',
    promotion_type: 'Sponsored Video',
    views: 10000,
    likes: 800,
    comments: 60,
    shares: 120,
    saves: 300
  });

  const fetchPosts = () => {
    setLoading(true);
    const userId = currentUser?.id || 1;
    const params = { user_id: userId };
    if (selectedPlatform !== 'all') params.platform = selectedPlatform;

    api.getPosts(params)
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load posts:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedPlatform, currentUser?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        sponsorship_amount: parseFloat(formData.sponsorship_amount) || 0
      };
      await api.createPost(payload, currentUser?.id || 1);
      setShowAddModal(false);
      setFormData({
        title: '',
        topic: 'General',
        platform: 'Instagram',
        content_type: 'Reel',
        caption: '',
        is_promotion: false,
        brand_name: '',
        sponsorship_amount: '',
        promotion_type: 'Sponsored Video',
        views: 10000,
        likes: 800,
        comments: 60,
        shares: 120,
        saves: 300
      });
      fetchPosts();
    } catch (err) {
      alert("Error adding post: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this social post?")) return;
    try {
      await api.deletePost(id);
      fetchPosts();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Social Content Vault: {currentUser?.name}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Manage posts for <span className="text-purple-700 dark:text-purple-300 font-semibold">{currentUser?.niche}</span>. Adding posts automatically retains performance memories in Hindsight.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Post for {currentUser?.name}</span>
        </button>
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'Instagram', 'YouTube', 'LinkedIn', 'X/Twitter'].map(plat => {
          const isSelected = selectedPlatform === plat;
          return (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold capitalize shrink-0 transition cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {plat === 'all' ? 'All Platforms' : plat}
            </button>
          );
        })}
      </div>

      {/* Post Grid */}
      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-slate-500 dark:text-slate-400">Loading social posts for {currentUser?.name}...</div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">No posts found for {currentUser?.name}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {posts.map(post => (
            <div key={post.id} className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-3 flex flex-col justify-between transition ${
              post.is_promotion 
                ? 'border border-amber-300 dark:border-amber-500/30 bg-amber-50/30 dark:bg-slate-900/80 hover:border-amber-400' 
                : 'border border-slate-200/90 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border uppercase tracking-wider ${
                    post.is_promotion 
                      ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30' 
                      : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                  }`}>
                    {post.platform} • {post.content_type}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs sm:text-sm">
                    {post.engagement_rate}% Eng
                  </span>
                </div>

                {post.is_promotion && (
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-100/70 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 mb-2 font-mono text-[11px] text-amber-800 dark:text-amber-300">
                    <span className="flex items-center gap-1 font-semibold truncate mr-2">
                      <Megaphone className="h-3.5 w-3.5 shrink-0" /> Sponsored by {post.brand_name || 'Brand'}
                    </span>
                    {post.sponsorship_amount > 0 && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">${post.sponsorship_amount?.toLocaleString()}</span>
                    )}
                  </div>
                )}

                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-outfit line-clamp-1">{post.title || `Post #${post.id}`}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">{post.caption || 'No caption'}</p>
                <div className="mt-2 inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-blue-700 dark:text-cyan-300 font-mono font-medium">
                  Topic: {post.topic}
                </div>
              </div>

              {/* Metrics bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono text-slate-600 dark:text-slate-400">
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                    <Eye className="h-3 w-3 mx-auto text-purple-600 dark:text-purple-400 mb-0.5" />
                    <span>{post.views?.toLocaleString()}</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                    <ThumbsUp className="h-3 w-3 mx-auto text-blue-600 dark:text-cyan-400 mb-0.5" />
                    <span>{post.likes?.toLocaleString()}</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                    <MessageSquare className="h-3 w-3 mx-auto text-amber-500 mb-0.5" />
                    <span>{post.comments?.toLocaleString()}</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                    <Share2 className="h-3 w-3 mx-auto text-indigo-600 dark:text-blue-400 mb-0.5" />
                    <span>{post.shares?.toLocaleString()}</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                    <Bookmark className="h-3 w-3 mx-auto text-emerald-600 dark:text-emerald-400 mb-0.5" />
                    <span>{post.saves?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Delete post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Adding Post */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-purple-500/40 w-full max-w-lg rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">Add Social Post for {currentUser?.name}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 font-medium"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X/Twitter">X/Twitter</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold">Content Type</label>
                  <select
                    value={formData.content_type}
                    onChange={e => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 font-medium"
                  >
                    <option value="Reel">Reel</option>
                    <option value="Video">Video</option>
                    <option value="Short">Short</option>
                    <option value="Post">Post</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Story">Story</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold">Post Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 5 Morning Routine Hacks"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              {/* Promotional Checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900 dark:text-amber-300">
                  <input
                    type="checkbox"
                    checked={formData.is_promotion}
                    onChange={e => setFormData({ ...formData, is_promotion: e.target.checked })}
                    className="rounded border-amber-500 text-amber-600 focus:ring-amber-400"
                  />
                  <span>⚡ Sponsored / Promotional Video or Deal</span>
                </label>

                {formData.is_promotion && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Brand / Sponsor Name</label>
                      <input
                        type="text"
                        required={formData.is_promotion}
                        placeholder="e.g. NordVPN, Notion"
                        value={formData.brand_name}
                        onChange={e => setFormData({ ...formData, brand_name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Sponsorship Amount ($)</label>
                      <input
                        type="number"
                        placeholder="1200"
                        value={formData.sponsorship_amount}
                        onChange={e => setFormData({ ...formData, sponsorship_amount: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold">Topic</label>
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. Pilates, Python, SaaS Growth"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold">Views</label>
                  <input
                    type="number"
                    value={formData.views}
                    onChange={e => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold truncate">Likes</label>
                  <input
                    type="number"
                    value={formData.likes}
                    onChange={e => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold truncate">Comments</label>
                  <input
                    type="number"
                    value={formData.comments}
                    onChange={e => setFormData({ ...formData, comments: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold truncate">Shares</label>
                  <input
                    type="number"
                    value={formData.shares}
                    onChange={e => setFormData({ ...formData, shares: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold truncate">Saves</label>
                  <input
                    type="number"
                    value={formData.saves}
                    onChange={e => setFormData({ ...formData, saves: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 mb-1 font-semibold">Caption</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Post caption text..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-purple-600/20 cursor-pointer transition"
                >
                  Save Post & Sync Hindsight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
