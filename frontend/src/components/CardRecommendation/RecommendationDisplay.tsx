import React from 'react';
import styled from 'styled-components';
import { Recommendation } from '../../services/api';
import { Button } from '../Common/Button';

const RecommendationContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
`;

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RecommendationCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const CardImage = styled.div`
  width: 60px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const CardDetails = styled.div`
  flex: 1;
`;

const CardName = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const Issuer = styled.p`
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 14px;
`;

const MatchScore = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  text-align: center;
  min-width: 80px;
`;

const RankBadge = styled.div`
  background: #ffd700;
  color: #333;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  position: absolute;
  top: -8px;
  left: 24px;
`;

const CardBody = styled.div`
  padding: 24px;
  position: relative;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #007bff;
  margin-bottom: 4px;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ReasonsSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h4`
  color: #333;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
`;

const ReasonsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ReasonItem = styled.li`
  padding: 8px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.4;
  
  &:before {
    content: '✓';
    color: #28a745;
    font-weight: bold;
    margin-right: 8px;
  }
`;

const ExplanationText = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 4px 0;
`;

const RewardSimulation = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const RewardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  
  &:last-child {
    border-top: 1px solid #dee2e6;
    padding-top: 8px;
    margin-bottom: 0;
    font-weight: 600;
    font-size: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

interface RecommendationDisplayProps {
  recommendations: Recommendation[];
  onBackToChat: () => void;
  onCompareCards: (cardIds: string[]) => void;
}

export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
  recommendations,
  onBackToChat,
  onCompareCards,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCompare = () => {
    const topThreeIds = recommendations.slice(0, 3).map(rec => rec.card.id);
    onCompareCards(topThreeIds);
  };

  if (recommendations.length === 0) {
    return (
      <RecommendationContainer>
        <Header>
          <Title>No Recommendations Found</Title>
          <Subtitle>Please try adjusting your preferences and try again.</Subtitle>
        </Header>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={onBackToChat}>Back to Chat</Button>
        </div>
      </RecommendationContainer>
    );
  }

  return (
    <RecommendationContainer>
      <Header>
        <Title>🎯 Your Personalized Credit Card Recommendations</Title>
        <Subtitle>
          We found {recommendations.length} cards that match your preferences and spending habits
        </Subtitle>
      </Header>

      <RecommendationsList>
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.card.id}>
            <CardHeader>
              <CardInfo>
                <CardImage>💳</CardImage>
                <CardDetails>
                  <CardName>{recommendation.card.name}</CardName>
                  <Issuer>{recommendation.card.issuer}</Issuer>
                </CardDetails>
              </CardInfo>
              <MatchScore>{recommendation.matchPercentage}% Match</MatchScore>
            </CardHeader>

            <CardBody>
              <RankBadge>#{recommendation.rank}</RankBadge>

              <MetricsGrid>
                <Metric>
                  <MetricValue>{formatCurrency(recommendation.card.annualFee)}</MetricValue>
                  <MetricLabel>Annual Fee</MetricLabel>
                </Metric>
                <Metric>
                  <MetricValue>{recommendation.card.rewardRate}%</MetricValue>
                  <MetricLabel>{recommendation.card.rewardType}</MetricLabel>
                </Metric>
                <Metric>
                  <MetricValue>{formatCurrency(recommendation.rewardSimulation.annualReward)}</MetricValue>
                  <MetricLabel>Estimated Annual Rewards</MetricLabel>
                </Metric>
                <Metric>
                  <MetricValue>{formatCurrency(recommendation.rewardSimulation.netBenefit)}</MetricValue>
                  <MetricLabel>Net Annual Benefit</MetricLabel>
                </Metric>
              </MetricsGrid>

              <ReasonsSection>
                <SectionTitle>Why this card is perfect for you:</SectionTitle>
                <ReasonsList>
                  {recommendation.reasons.map((reason, index) => (
                    <ReasonItem key={index}>{reason}</ReasonItem>
                  ))}
                </ReasonsList>
                {recommendation.llmExplanation.map((explanation, index) => (
                  <ExplanationText key={index}>{explanation}</ExplanationText>
                ))}
              </ReasonsSection>

              <RewardSimulation>
                <SectionTitle>Annual Reward Breakdown:</SectionTitle>
                <RewardRow>
                  <span>Estimated Annual Rewards:</span>
                  <span>{formatCurrency(recommendation.rewardSimulation.annualReward)}</span>
                </RewardRow>
                <RewardRow>
                  <span>Annual Fee:</span>
                  <span>-{formatCurrency(recommendation.rewardSimulation.annualFee)}</span>
                </RewardRow>
                <RewardRow>
                  <span>Net Benefit:</span>
                  <span style={{ 
                    color: recommendation.rewardSimulation.netBenefit >= 0 ? '#28a745' : '#dc3545' 
                  }}>
                    {formatCurrency(recommendation.rewardSimulation.netBenefit)}
                  </span>
                </RewardRow>
              </RewardSimulation>

              <ActionButtons>
                <Button
                  onClick={() => window.open(recommendation.card.applyLink, '_blank')}
                  size="large"
                >
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {/* TODO: View details */}}
                >
                  View Details
                </Button>
              </ActionButtons>
            </CardBody>
          </RecommendationCard>
        ))}
      </RecommendationsList>

      <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Button variant="outline" onClick={onBackToChat}>
          ← Back to Chat
        </Button>
        {recommendations.length > 1 && (
          <Button onClick={handleCompare}>
            Compare Top 3 Cards
          </Button>
        )}
      </div>
    </RecommendationContainer>
  );
};