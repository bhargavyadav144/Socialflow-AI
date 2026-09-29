import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Health
  getHealth: async () => {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  },

  // Auth System & Email OTP Verification
  sendOTP: async (email) => {
    const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
    return res.data;
  },
  verifyOTP: async (email, otpCode) => {
    const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp_code: otpCode });
    return res.data;
  },
  register: async (registerData) => {
    const res = await axios.post(`${API_BASE}/auth/register`, registerData);
    return res.data;
  },
  login: async (loginData) => {
    const res = await axios.post(`${API_BASE}/auth/login`, loginData);
    return res.data;
  },
  socialLogin: async (provider, socialData) => {
    const res = await axios.post(`${API_BASE}/auth/social-login`, {
      provider,
      ...socialData
    });
    return res.data;
  },


  // Forgot Password & Reset
  forgotPassword: async (email) => {
    const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return res.data;
  },
  resetPassword: async (data) => {
    const res = await axios.post(`${API_BASE}/auth/reset-password`, data);
    return res.data;
  },

  // Profile Update & Fetch
  getProfile: async (userId) => {
    const res = await axios.get(`${API_BASE}/auth/profile/${userId}`);
    return res.data;
  },
  updateProfile: async (userId, profileData) => {
    const res = await axios.put(`${API_BASE}/auth/profile/${userId}`, profileData);
    return res.data;
  },

  // Social Account Connections
  getSocialAccounts: async (userId = 1) => {
    const res = await axios.get(`${API_BASE}/social-accounts`, {
      params: { user_id: userId }
    });
    return res.data;
  },
  getSocialAccount: async (accountId) => {
    const res = await axios.get(`${API_BASE}/social-accounts/${accountId}`);
    return res.data;
  },
  updateSocialAccount: async (accountId, updateData) => {
    const res = await axios.patch(`${API_BASE}/social-accounts/${accountId}`, updateData);
    return res.data;
  },
  connectSocialAccount: async (accData, userId = 1) => {
    const res = await axios.post(`${API_BASE}/social-accounts/connect`, accData, {
      params: { user_id: userId }
    });
    return res.data;
  },
  syncSocialAccount: async (accountId) => {
    const res = await axios.post(`${API_BASE}/social-accounts/sync`, null, {
      params: { account_id: accountId }
    });
    return res.data;
  },
  resolveProfileUrl: async (url, autoSave = false, userId = 1) => {
    const res = await axios.post(`${API_BASE}/social-accounts/resolve-url`, { url, auto_save: autoSave }, {
      params: { user_id: userId }
    });
    return res.data;
  },
  resolvePostUrl: async (url) => {
    const res = await axios.post(`${API_BASE}/posts/resolve-url`, { url });
    return res.data;
  },
  disconnectSocialAccount: async (accountId) => {
    const res = await axios.delete(`${API_BASE}/social-accounts/${accountId}`);
    return res.data;
  },

  // Users Management
  getUsers: async () => {
    const res = await axios.get(`${API_BASE}/users`);
    return res.data;
  },
  getUser: async (id) => {
    const res = await axios.get(`${API_BASE}/users/${id}`);
    return res.data;
  },

  // Social Posts & AI Training
  getPosts: async (params = {}) => {
    const res = await axios.get(`${API_BASE}/posts`, { params });
    return res.data;
  },
  analyzeAndTrainPosts: async (userId = 1) => {
    const res = await axios.post(`${API_BASE}/posts/analyze-and-train`, null, {
      params: { user_id: userId }
    });
    return res.data;
  },
  createPost: async (postData, userId = 1) => {
    const res = await axios.post(`${API_BASE}/posts`, postData, {
      params: { user_id: userId }
    });
    return res.data;
  },
  updatePost: async (id, postData) => {
    const res = await axios.put(`${API_BASE}/posts/${id}`, postData);
    return res.data;
  },
  deletePost: async (id) => {
    const res = await axios.delete(`${API_BASE}/posts/${id}`);
    return res.data;
  },
  clearAllPosts: async (userId = 1) => {
    const res = await axios.delete(`${API_BASE}/posts/clear-all`, {
      params: { user_id: userId }
    });
    return res.data;
  },

  // Analytics
  getAnalytics: async (userId = 1) => {
    const res = await axios.get(`${API_BASE}/analytics`, {
      params: { user_id: userId }
    });
    return res.data;
  },

  // Hindsight Memory
  getMemories: async (category = null, userId = 1) => {
    const params = { user_id: userId };
    if (category) params.category = category;
    const res = await axios.get(`${API_BASE}/memory`, { params });
    return res.data;
  },
  addMemory: async (memoryData) => {
    const res = await axios.post(`${API_BASE}/memory`, memoryData);
    return res.data;
  },

  // Chat / Agent & Persistent Sessions
  sendChat: async (message, disableMemory = false, userId = 1, sessionId = null) => {
    const res = await axios.post(`${API_BASE}/chat`, {
      message,
      disable_memory: disableMemory,
      user_id: userId,
      session_id: sessionId
    });
    return res.data;
  },
  getChatSessions: async (userId = 1) => {
    const res = await axios.get(`${API_BASE}/chat/sessions`, {
      params: { user_id: userId }
    });
    return res.data;
  },
  createChatSession: async (title = "New Conversation", userId = 1) => {
    const res = await axios.post(`${API_BASE}/chat/sessions`, {
      title,
      user_id: userId
    });
    return res.data;
  },
  getSessionMessages: async (sessionId) => {
    const res = await axios.get(`${API_BASE}/chat/sessions/${sessionId}/messages`);
    return res.data;
  },
  deleteChatSession: async (sessionId) => {
    const res = await axios.delete(`${API_BASE}/chat/sessions/${sessionId}`);
    return res.data;
  },
  updateChatSession: async (sessionId, title) => {
    const res = await axios.patch(`${API_BASE}/chat/sessions/${sessionId}`, { title });
    return res.data;
  },
  clearAllChatHistory: async (userId = 1) => {
    const res = await axios.delete(`${API_BASE}/chat/clear`, {
      params: { user_id: userId }
    });
    return res.data;
  },

  // Workspace Controls
  resetDemo: async () => {
    const res = await axios.post(`${API_BASE}/demo/reset`);
    return res.data;
  }
};
