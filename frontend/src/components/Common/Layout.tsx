import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const InfoMessage = styled.div`
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 14px;
`;

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface MessageProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  className?: string;
}

export const PageContainer: React.FC<ContainerProps> = ({ children, className }) => {
  return <Container className={className}>{children}</Container>;
};

export const CardContainer: React.FC<CardProps> = ({ children, className }) => {
  return <Card className={className}>{children}</Card>;
};

export const Message: React.FC<MessageProps> = ({ message, type = 'info', className }) => {
  const MessageComponent = {
    error: ErrorMessage,
    success: SuccessMessage,
    info: InfoMessage,
  }[type];

  return <MessageComponent className={className}>{message}</MessageComponent>;
};