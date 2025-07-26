import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error.response?.data || { message: 'Network error' });
  }
);

// Chat API
export const chatAPI = {
  startConversation: () => api.post('/chat/start'),
  sendMessage: (sessionId, message) => api.post('/chat/message', { sessionId, message }),
  getConversation: (sessionId) => api.get(`/chat/${sessionId}`),
  resetConversation: (sessionId) => api.post(`/chat/${sessionId}/reset`),
};

// Cards API
export const cardsAPI = {
  getAllCards: (params = {}) => api.get('/cards', { params }),
  getCardById: (id) => api.get(`/cards/${id}`),
  searchCards: (params) => api.get('/cards/search', { params }),
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: (data) => api.post('/recommendations', data),
  getRecommendationsBySession: (sessionId) => api.get(`/recommendations/${sessionId}`),
};

// Compare API
export const compareAPI = {
  compareCards: (cardIds) => api.post('/compare', { cardIds }),
  getComparisonData: (cardIds) => api.get(`/compare/${cardIds.join(',')}`),
};

export default api;