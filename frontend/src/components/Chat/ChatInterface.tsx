import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChat } from '../../context/ChatContext';
import { Button } from '../Common/Button';
import { LoadingSpinner } from '../Common/Button';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const ResetButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f9fa;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    background: #007bff;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  ` : `
    background: white;
    color: #333;
    align-self: flex-start;
    border: 1px solid #e0e0e0;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  `}
`;

const InputContainer = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  background: white;
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 12px 16px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  max-height: 120px;
  min-height: 44px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled(Button)`
  border-radius: 50%;
  width: 44px;
  height: 44px;
  min-height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-style: italic;
  align-self: flex-start;
`;

const ReadyForRecommendationsAlert = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ChatInterface: React.FC = () => {
  const { state, startChat, sendMessage, getRecommendations, resetChat } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  useEffect(() => {
    if (!state.sessionId) {
      startChat();
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !state.isLoading) {
      await sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGetRecommendations = () => {
    getRecommendations();
  };

  const handleReset = () => {
    resetChat();
    setInputValue('');
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>💳 Credit Card Assistant</ChatTitle>
        <ResetButton onClick={handleReset}>Reset Chat</ResetButton>
      </ChatHeader>

      <MessagesContainer>
        {state.messages.map((message, index) => (
          <MessageBubble key={index} isUser={message.role === 'user'}>
            {message.content}
          </MessageBubble>
        ))}
        
        {state.isLoading && (
          <LoadingIndicator>
            <LoadingSpinner size={16} />
            Assistant is thinking...
          </LoadingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {state.readyForRecommendations && state.currentStep === 'chat' && (
        <ReadyForRecommendationsAlert>
          <span>✨ Ready to show you personalized credit card recommendations!</span>
          <Button 
            onClick={handleGetRecommendations} 
            loading={state.isLoading}
            size="small"
          >
            Get Recommendations
          </Button>
        </ReadyForRecommendationsAlert>
      )}

      <InputContainer>
        <MessageInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={state.isLoading}
          rows={1}
        />
        <SendButton
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || state.isLoading}
          loading={state.isLoading}
        >
          📤
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};