import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/navigation/BottomNavigation';

const Container = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background.page};
  padding-bottom: 5rem;

  @media (min-width: 48rem) {
    padding-bottom: 2rem;
  }
`;

const Header = styled.header`
  padding: 1.5rem;
  background: ${(props) => props.theme.colors.background.card};
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};

  @media (min-width: 48rem) {
    max-width: 75rem;
    margin: 0 auto;
    padding: 2rem;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;

  @media (min-width: 48rem) {
    font-size: 2rem;
  }
`;

const Main = styled.main`
  padding: 0 1.5rem;
  margin-top: 1rem;

  @media (min-width: 48rem) {
    max-width: 75rem;
    margin: 1rem auto 0;
    padding: 0 2rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary.light};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const EmptyTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary.main};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.background.card};
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  }
`;

const MessageHeader = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const OrgAvatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary.light};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
`;

const OrgName = styled.div`
  font-weight: 600;
  font-size: 0.938rem;
  color: ${(props) => props.theme.colors.text.primary};
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  flex-shrink: 0;
`;

const MessagePreview = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const UnreadIndicator = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary.main};
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const CardWrapper = styled.div`
  position: relative;
`;

interface Message {
  id: string;
  orgName: string;
  preview: string;
  time: string;
  unread: boolean;
}

const formatTime = (time: string): string => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    return 'Just now';
  }
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const mockMessages: Message[] = [
  {
    id: '1',
    orgName: 'City Food Bank',
    preview:
      'We have an urgent need in our food bank. Your support can help feed families this week.',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: '2',
    orgName: 'Community Health Center',
    preview: 'Your giving has helped 23 families this month. Thank you for making a difference!',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
  {
    id: '3',
    orgName: 'Youth Education Fund',
    preview:
      'Campaign update: We reached 75% of our goal! Your donation helped purchase 50 new textbooks.',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
];

export const MessagesPage = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleRefresh = (): void => {
    setMessages(mockMessages);
  };

  const renderEmpty = () => (
    <EmptyState>
      <EmptyIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </EmptyIcon>
      <EmptyTitle>{t('messages.empty')}</EmptyTitle>
      <EmptyDescription>{t('messages.emptyDescription')}</EmptyDescription>
    </EmptyState>
  );

  const renderMessages = () => (
    <MessagesList>
      {messages.map((message, index) => (
        <CardWrapper key={message.id}>
          <MessageCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MessageHeader>
              <OrgAvatar>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </OrgAvatar>
              <MessageContent>
                <MessageTop>
                  <OrgName>{message.orgName}</OrgName>
                  <MessageTime>{formatTime(message.time)}</MessageTime>
                </MessageTop>
                <MessagePreview>{message.preview}</MessagePreview>
              </MessageContent>
            </MessageHeader>
          </MessageCard>
          {message.unread && <UnreadIndicator />}
        </CardWrapper>
      ))}
    </MessagesList>
  );

  return (
    <Container>
      <Header>
        <HeaderTop>
          <Title>{t('messages.title')}</Title>
          <RefreshButton onClick={handleRefresh}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </RefreshButton>
        </HeaderTop>
      </Header>

      <Main>{messages.length === 0 ? renderEmpty() : renderMessages()}</Main>

      <BottomNavigation />
    </Container>
  );
};
