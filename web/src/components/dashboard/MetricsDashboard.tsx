import styled from 'styled-components';
import { TrendingUp, Heart, Users, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../common/GlassCard';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  showTrend?: boolean;
}

interface MetricsDashboardProps {
  totalDonated: number;
  campaignsSupported: number;
  familiesHelped: number;
  organizations: number;
}

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 30rem) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 64rem) {
    grid-template-columns: repeat(4, 1fr);
  }

  > div {
    height: 100%;
  }
`;

const CardWrapper = styled(motion.div)`
  height: 100%;
`;

const MetricCard = styled(GlassCard)`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background: linear-gradient(90deg, #00a0c4 0%, #007a94 100%);
  }

  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 0.5rem 2rem rgba(0, 160, 196, 0.15);
  }
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgba(0, 160, 196, 0.1) 0%, rgba(0, 122, 148, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00a0c4;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const MetricLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;

const MetricValue = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;
`;

const MetricChange = styled.div<{ $visible?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #00a0c4;
  min-height: 1.25rem;
  margin-top: auto;
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

const MetricCardComponent = ({ icon, label, value, change, showTrend }: MetricCardProps) => (
  <MetricCard>
    <IconWrapper>{icon}</IconWrapper>
    <MetricLabel>{label}</MetricLabel>
    <MetricValue>{value}</MetricValue>
    <MetricChange $visible={showTrend && !!change}>
      <TrendingUp />
      {change || '\u00A0'}
    </MetricChange>
  </MetricCard>
);

export const MetricsDashboard = ({
  totalDonated,
  campaignsSupported,
  familiesHelped,
  organizations,
}: MetricsDashboardProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <DashboardContainer>
        <CardWrapper variants={itemVariants}>
          <MetricCardComponent
            icon={<Heart />}
            label="Total Donated"
            value={formatCurrency(totalDonated)}
            change="+12% this month"
            showTrend
          />
        </CardWrapper>
        <CardWrapper variants={itemVariants}>
          <MetricCardComponent
            icon={<Building2 />}
            label="Campaigns Supported"
            value={formatNumber(campaignsSupported)}
          />
        </CardWrapper>
        <CardWrapper variants={itemVariants}>
          <MetricCardComponent
            icon={<Users />}
            label="Families Helped"
            value={formatNumber(familiesHelped)}
          />
        </CardWrapper>
        <CardWrapper variants={itemVariants}>
          <MetricCardComponent
            icon={<Building2 />}
            label="Organizations"
            value={formatNumber(organizations)}
          />
        </CardWrapper>
      </DashboardContainer>
    </motion.div>
  );
};
