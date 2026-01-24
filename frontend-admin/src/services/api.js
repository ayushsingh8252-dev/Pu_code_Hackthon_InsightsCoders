import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = localStorage.getItem('accessToken') || null; // initialize from localStorage if available
const refreshTokenKey = 'refreshToken'; // localStorage key

export function setSession(tokens) {
  accessToken = tokens?.accessToken ?? null;
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }

  if (tokens?.refreshToken) {
    localStorage.setItem(refreshTokenKey, tokens.refreshToken);
  }
}

export function clearSession() {
  accessToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem('user');
}

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Don't add token to forgot-password and reset-password endpoints
    // as they should be public according to backend config
    const publicAuthEndpoints = ['/auth/forgot-password', '/auth/reset-password'];
    const isPublicEndpoint = publicAuthEndpoints.some(endpoint => config.url.includes(endpoint));
    
    if (accessToken && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let pending = [];
const processQueue = (error, token = null) => {
  pending.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  pending = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest.__isRetryRequest) {
      originalRequest.__isRetryRequest = true;

      const storedRefresh = localStorage.getItem(refreshTokenKey);
      if (!storedRefresh) {
        clearSession();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pending.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api.request(originalRequest);
        });
      }

    try {
        isRefreshing = true;
        // Updated endpoint to match Swagger: /auth/refresh
        const resp = await api.post('/auth/refresh', null, {
          headers: { Authorization: `Bearer ${storedRefresh}` },
        });
        const { accessToken: newAccess } = resp.data;
        accessToken = newAccess;
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Auth & Profile
  login: (data) => api.post('/admin/auth/login', data),
  getProfile: () => api.get('/admin/me'),

  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  blockUser: (userId) => api.put(`/admin/users/${userId}/block`),
  unblockUser: (userId) => api.put(`/admin/users/${userId}/unblock`),

  // Vendor Management
  getPendingVendors: () => api.get('/admin/vendors/for-verification'),
  approveVendor: (vendorId) => api.put(`/admin/vendors/${vendorId}/approve`),
  rejectVendor: (vendorId) => api.put(`/admin/vendors/${vendorId}/reject`),
  getVendors: (params) => api.get('/admin/vendors', { params }),
  getVendorDetails: (vendorId) => api.get(`/admin/vendors/${vendorId}`),
  activateVendor: (vendorId) => api.put(`/admin/vendors/${vendorId}/activate`),
  deactivateVendor: (vendorId) => api.put(`/admin/vendors/${vendorId}/deactivate`),
  suspendVendor: (vendorId, reason) => api.put(`/admin/vendors/${vendorId}/suspend`, { reason }),

  // Location & Moderation
  getLiveVendors: () => api.get('/admin/vendors/live'),
  getVendorLocations: (vendorId) => api.get(`/admin/vendors/${vendorId}/locations`),
  getCategories: () => api.get('/admin/categories'),
  deleteCategory: (categoryId) => api.delete(`/admin/categories/${categoryId}`),
  getProducts: () => api.get('/admin/products'),
  deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),
  getVendorAvailability: () => api.get('/admin/vendors/availability'),
  
  // Analytics & Logs
  getStats: () => api.get('/admin/dashboard/stats'),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  // Updated to use path parameter as per Swagger
  resendOTP: (email) => api.post(`/auth/resend-otp/${email}`),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  // Updated endpoint to match Swagger
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
};



export default api;
