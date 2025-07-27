import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { chatAPI, recommendationsAPI } from '../utils/api';

const ChatContext = createContext();

const initialState = {
  sessionId: null,
  messages: [],
  isLoading: false,
  isTyping: false,
  currentStep: 'greeting',
  canRecommend: false,
  recommendations: [],
  error: null,
  userProfile: {},
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    
    case 'SET_SESSION':
      return { ...state, sessionId: action.payload };
    
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload] 
      };
    
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    
    case 'UPDATE_STEP':
      return { 
        ...state, 
        currentStep: action.payload.currentStep,
        canRecommend: action.payload.canRecommend 
      };
    
    case 'SET_RECOMMENDATIONS':
      return { 
        ...state, 
        recommendations: action.payload,
        currentStep: 'recommendations_provided'
      };
    
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'RESET_CONVERSATION':
      return { 
        ...initialState, 
        sessionId: state.sessionId 
      };
    
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Initialize conversation on mount
  useEffect(() => {
    const initializeConversation = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await chatAPI.startConversation();
        
        dispatch({ type: 'SET_SESSION', payload: response.sessionId });
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { 
            role: 'assistant', 
            content: response.message, 
            timestamp: new Date() 
          }
        });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to start conversation' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeConversation();
  }, []);

  const sendMessage = async (message) => {
    if (!state.sessionId || !message.trim()) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_TYPING', payload: true });

      // Add user message immediately
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Send to API
      const response = await chatAPI.sendMessage(state.sessionId, message);

      // Add assistant response
      const assistantMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });

      // Update conversation state
      dispatch({ 
        type: 'UPDATE_STEP', 
        payload: { 
          currentStep: response.currentStep,
          canRecommend: response.canRecommend 
        }
      });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to send message' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  };

  const getRecommendations = async () => {
    if (!state.sessionId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await recommendationsAPI.getRecommendations({
        sessionId: state.sessionId
      });

      dispatch({ type: 'SET_RECOMMENDATIONS', payload: response.recommendations });
      dispatch({ type: 'SET_USER_PROFILE', payload: response.userProfile });

      // Add system message about recommendations
      const systemMessage = {
        role: 'assistant',
        content: `Based on your profile, I've found ${response.recommendations.length} credit cards that match your needs. Here are my top recommendations:`,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: systemMessage });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to get recommendations' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetConversation = async () => {
    if (!state.sessionId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await chatAPI.resetConversation(state.sessionId);
      dispatch({ type: 'RESET_CONVERSATION' });

      // Add initial message
      const initialMessage = {
        role: 'assistant',
        content: 'Hello! I\'m here to help you find the perfect credit card for your needs. Let\'s start by understanding your financial profile. What\'s your approximate annual income? 💳',
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: initialMessage });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to reset conversation' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    sendMessage,
    getRecommendations,
    resetConversation,
    clearError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;