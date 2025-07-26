import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div<{ size?: number }>`
  display: inline-block;
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
`;

const Spinner = styled.div<{ size?: number }>`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
  animation: ${spin} 1s linear infinite;
`;

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size, className }) => {
  return (
    <SpinnerWrapper size={size} className={className}>
      <Spinner size={size} />
    </SpinnerWrapper>
  );
};

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 6px 12px;
          font-size: 14px;
          min-height: 32px;
        `;
      case 'large':
        return `
          padding: 12px 24px;
          font-size: 16px;
          min-height: 48px;
        `;
      default:
        return `
          padding: 8px 16px;
          font-size: 14px;
          min-height: 40px;
        `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: #6c757d;
          color: white;
          &:hover:not(:disabled) {
            background-color: #5a6268;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #007bff;
          border: 1px solid #007bff;
          &:hover:not(:disabled) {
            background-color: #007bff;
            color: white;
          }
        `;
      default:
        return `
          background-color: #007bff;
          color: white;
          &:hover:not(:disabled) {
            background-color: #0056b3;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
  className,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      type={type}
      {...props}
    >
      {loading && <LoadingSpinner size={16} />}
      {children}
    </StyledButton>
  );
};