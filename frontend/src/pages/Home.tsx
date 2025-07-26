import React from 'react';
import styled from 'styled-components';
import { useChat } from '../context/ChatContext';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { RecommendationDisplay } from '../components/CardRecommendation/RecommendationDisplay';
import { Message } from '../components/Common/Layout';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  color: white;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Description = styled.p`
  font-size: 20px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin: 32px 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Feature = styled.div`
  text-align: center;
  color: white;
  padding: 16px;
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
`;

export const Home: React.FC = () => {
  const { state, dispatch } = useChat();

  const handleBackToChat = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'chat' });
  };

  const handleCompareCards = (cardIds: string[]) => {
    // TODO: Implement card comparison
    console.log('Comparing cards:', cardIds);
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'comparison' });
  };

  const renderContent = () => {
    if (state.error) {
      return (
        <div>
          <Message type="error" message={state.error} />
          <ChatInterface />
        </div>
      );
    }

    switch (state.currentStep) {
      case 'recommendations':
        return (
          <RecommendationDisplay
            recommendations={state.recommendations}
            onBackToChat={handleBackToChat}
            onCompareCards={handleCompareCards}
          />
        );
      case 'comparison':
        return (
          <div>
            <Message type="info" message="Card comparison feature coming soon!" />
            <RecommendationDisplay
              recommendations={state.recommendations}
              onBackToChat={handleBackToChat}
              onCompareCards={handleCompareCards}
            />
          </div>
        );
      default:
        return <ChatInterface />;
    }
  };

  return (
    <HomeContainer>
      <ContentWrapper>
        {state.currentStep === 'chat' && (
          <Header>
            <Title>💳 Credit Card Recommender</Title>
            <Description>
              Get personalized credit card recommendations powered by AI. 
              Tell us about your spending habits and we'll find the perfect card for you.
            </Description>
            
            <Features>
              <Feature>
                <FeatureIcon>🤖</FeatureIcon>
                <FeatureTitle>AI-Powered</FeatureTitle>
                <FeatureDescription>
                  Smart conversations to understand your needs
                </FeatureDescription>
              </Feature>
              <Feature>
                <FeatureIcon>📊</FeatureIcon>
                <FeatureTitle>Smart Analysis</FeatureTitle>
                <FeatureDescription>
                  Advanced scoring based on your spending patterns
                </FeatureDescription>
              </Feature>
              <Feature>
                <FeatureIcon>🎯</FeatureIcon>
                <FeatureTitle>Personalized</FeatureTitle>
                <FeatureDescription>
                  Recommendations tailored to your lifestyle
                </FeatureDescription>
              </Feature>
            </Features>
          </Header>
        )}
        
        {renderContent()}
      </ContentWrapper>
    </HomeContainer>
  );
};