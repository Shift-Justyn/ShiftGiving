import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f9fafb;
`;

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  width: 100%;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: #dc2626;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem;
`;

const StatusCode = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: #e5e7eb;
  display: block;
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary.main};
    color: #ffffff;
    border: none;

    &:hover {
      background: ${props.theme.colors.primary.hover};
      transform: translateY(-1px);
    }
  `
      : `
    background: #ffffff;
    color: #374151;
    border: 1px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
  `}

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Details = styled.details`
  margin-top: 2rem;
  text-align: left;

  summary {
    font-size: 0.75rem;
    color: #9ca3af;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: #6b7280;
    }
  }
`;

const ErrorDetails = styled.pre`
  margin-top: 0.75rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #374151;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let statusCode = 500;
  let title = 'Something went wrong';
  let message =
    'An unexpected error occurred. Please try again or contact support if the problem persists.';
  let errorMessage = '';

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 404) {
      title = 'Page not found';
      message = "The page you're looking for doesn't exist or has been moved.";
    } else if (error.status === 401) {
      title = 'Unauthorized';
      message = 'You need to be logged in to access this page.';
    } else if (error.status === 403) {
      title = 'Access denied';
      message = "You don't have permission to view this page.";
    }
    errorMessage = error.statusText || error.data?.message || '';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    if (error.stack) {
      errorMessage += '\n\n' + error.stack;
    }
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <StatusCode>{statusCode}</StatusCode>
        <IconWrapper>
          <AlertTriangle />
        </IconWrapper>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button $variant="secondary" onClick={handleGoBack}>
            <ArrowLeft />
            Go Back
          </Button>
          <Button $variant="secondary" onClick={handleRefresh}>
            <RefreshCw />
            Refresh
          </Button>
          <Button $variant="primary" onClick={handleGoHome}>
            <Home />
            Home
          </Button>
        </ButtonGroup>
        {errorMessage && process.env.NODE_ENV === 'development' && (
          <Details>
            <summary>Error details (dev only)</summary>
            <ErrorDetails>{errorMessage}</ErrorDetails>
          </Details>
        )}
      </Card>
    </Container>
  );
};
