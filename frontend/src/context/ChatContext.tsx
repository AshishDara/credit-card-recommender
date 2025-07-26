import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Recommendation } from '../services/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatState {
  sessionId: string | null;
  messages: ChatMessage[];
  userPreferences: any;
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  readyForRecommendations: boolean;
  currentStep: 'chat' | 'recommendations' | 'comparison';
}

type ChatAction =
  | { type: 'START_CHAT'; payload: { sessionId: string; message: string } }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_PREFERENCES'; payload: any }
  | { type: 'SET_RECOMMENDATIONS'; payload: Recommendation[] }
  | { type: 'SET_READY_FOR_RECOMMENDATIONS'; payload: boolean }
  | { type: 'SET_CURRENT_STEP'; payload: 'chat' | 'recommendations' | 'comparison' }
  | { type: 'RESET_CHAT' };

const initialState: ChatState = {
  sessionId: null,
  messages: [],
  userPreferences: {},
  recommendations: [],
  isLoading: false,
  error: null,
  readyForRecommendations: false,
  currentStep: 'chat',
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'START_CHAT':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        messages: [
          {
            role: 'assistant',
            content: action.payload.message,
            timestamp: new Date(),
          },
        ],
        error: null,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, { ...action.payload, timestamp: new Date() }],
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload },
      };

    case 'SET_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: action.payload,
        currentStep: 'recommendations',
      };

    case 'SET_READY_FOR_RECOMMENDATIONS':
      return {
        ...state,
        readyForRecommendations: action.payload,
      };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };

    case 'RESET_CHAT':
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  startChat: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  getRecommendations: () => Promise<void>;
  resetChat: () => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const startChat = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { chatAPI } = await import('../services/api');
      const response = await chatAPI.startChat();

      dispatch({
        type: 'START_CHAT',
        payload: {
          sessionId: response.sessionId,
          message: response.message,
        },
      });
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to start chat',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const sendMessage = async (message: string) => {
    if (!state.sessionId) {
      dispatch({ type: 'SET_ERROR', payload: 'No active session' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Add user message immediately
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'user', content: message },
      });

      const { chatAPI } = await import('../services/api');
      const response = await chatAPI.sendMessage({
        sessionId: state.sessionId,
        message,
      });

      // Add assistant response
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'assistant', content: response.message },
      });

      // Update preferences if provided
      if (response.preferences) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: response.preferences });
      }

      // Update ready for recommendations status
      if (response.readyForRecommendations !== undefined) {
        dispatch({
          type: 'SET_READY_FOR_RECOMMENDATIONS',
          payload: response.readyForRecommendations,
        });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to send message',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getRecommendations = async () => {
    if (!state.sessionId) {
      dispatch({ type: 'SET_ERROR', payload: 'No active session' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { recommendationsAPI } = await import('../services/api');
      const response = await recommendationsAPI.getRecommendations(state.sessionId);

      dispatch({ type: 'SET_RECOMMENDATIONS', payload: response.recommendations });
      dispatch({ type: 'UPDATE_PREFERENCES', payload: response.userPreferences });
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to get recommendations',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetChat = async () => {
    try {
      if (state.sessionId) {
        const { chatAPI } = await import('../services/api');
        await chatAPI.resetChat(state.sessionId);
      }
    } catch (error) {
      console.error('Failed to reset chat on server:', error);
    } finally {
      dispatch({ type: 'RESET_CHAT' });
    }
  };

  const value: ChatContextValue = {
    state,
    dispatch,
    startChat,
    sendMessage,
    getRecommendations,
    resetChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}