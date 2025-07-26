import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface ChatStartResponse {
  sessionId: string;
  message: string;
}

export interface ChatMessageRequest {
  sessionId: string;
  message: string;
}

export interface ChatMessageResponse {
  message: string;
  preferences: any;
  readyForRecommendations: boolean;
}

export interface Card {
  id: string;
  name: string;
  issuer: string;
  category: string;
  joiningFee: number;
  annualFee: number;
  rewardType: string;
  rewardRate: number;
  benefits: string[];
  specialPerks: string[];
  imageUrl: string;
  applyLink: string;
  rating: number;
  eligibility: {
    minIncome: number;
    minCreditScore: number;
  };
}

export interface Recommendation {
  rank: number;
  card: Card;
  score: number;
  reasons: string[];
  llmExplanation: string[];
  rewardSimulation: {
    annualReward: number;
    annualFee: number;
    netBenefit: number;
    breakdown: any;
  };
  matchPercentage: number;
}

export interface RecommendationResponse {
  sessionId: string;
  userPreferences: any;
  recommendations: Recommendation[];
  summary: {
    totalRecommendations: number;
    topChoice: Recommendation;
    averageScore: number;
  };
}

// Chat API
export const chatAPI = {
  startChat: (): Promise<ChatStartResponse> =>
    api.post('/chat/start').then(response => response.data),
  
  sendMessage: (data: ChatMessageRequest): Promise<ChatMessageResponse> =>
    api.post('/chat/message', data).then(response => response.data),
  
  getChatHistory: (sessionId: string) =>
    api.get(`/chat/history/${sessionId}`).then(response => response.data),
  
  resetChat: (sessionId: string) =>
    api.post(`/chat/reset/${sessionId}`).then(response => response.data),
};

// Cards API
export const cardsAPI = {
  getAllCards: (params?: {
    category?: string;
    issuer?: string;
    minIncome?: number;
    maxAnnualFee?: number;
    limit?: number;
  }) => api.get('/cards', { params }).then(response => response.data),
  
  getCardById: (id: string) =>
    api.get(`/cards/${id}`).then(response => response.data),
  
  getCardsByCategory: (category: string, limit?: number) =>
    api.get(`/cards/category/${category}`, { params: { limit } }).then(response => response.data),
  
  searchCards: (query: string, limit?: number) =>
    api.get(`/cards/search/${query}`, { params: { limit } }).then(response => response.data),
  
  compareCards: (cardIds: string[]) =>
    api.post('/cards/compare', { cardIds }).then(response => response.data),
  
  getCategories: () =>
    api.get('/cards/meta/categories').then(response => response.data),
  
  getIssuers: () =>
    api.get('/cards/meta/issuers').then(response => response.data),
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: (sessionId: string, limit?: number): Promise<RecommendationResponse> =>
    api.get(`/recommendations/${sessionId}`, { params: { limit } }).then(response => response.data),
  
  getManualRecommendations: (preferences: any, limit?: number) =>
    api.post('/recommendations/manual', { preferences, limit }).then(response => response.data),
  
  explainRecommendation: (data: { cardId: string; sessionId?: string; preferences?: any }) =>
    api.post('/recommendations/explain', data).then(response => response.data),
  
  calculateRewards: (data: { cardId: string; monthlySpending: any }) =>
    api.post('/recommendations/calculate-rewards', data).then(response => response.data),
};

// Health check
export const healthAPI = {
  checkHealth: () =>
    api.get('/health').then(response => response.data),
};

export default api;