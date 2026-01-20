import React, { useState } from 'react';
import styled from 'styled-components';
import { enhanceText, TEXT_FIELD_CONFIG, TEXT_ACTIONS, EnhanceTextRequest } from '../../api/ai';

type TextFieldType = 'description' | 'teaser' | 'story';
type TextAction = 'fix_grammar' | 'improve' | 'rewrite' | 'tone' | 'expand';

interface AITextEnhancerProps {
  value: string;
  onChange: (value: string) => void;
  field: TextFieldType;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export function AITextEnhancer({
  value,
  onChange,
  field,
  label,
  placeholder,
  rows = 4,
}: AITextEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeAction, setActiveAction] = useState<TextAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);

  const config = TEXT_FIELD_CONFIG[field];
  const availableActions = TEXT_ACTIONS.filter((action) => {
    if (action.storyOnly && field !== 'story') return false;
    return true;
  });

  const handleEnhance = async (action: TextAction) => {
    if (!value.trim()) return;

    setIsEnhancing(true);
    setActiveAction(action);
    setError(null);
    setOriginalText(value);

    try {
      const request: EnhanceTextRequest = {
        text: value,
        field,
        action,
      };
      const response = await enhanceText(request);
      onChange(response.text);
    } catch (err) {
      console.error('Failed to enhance text:', err);
      setError('Failed to enhance text. Please try again.');
    } finally {
      setIsEnhancing(false);
      setActiveAction(null);
    }
  };

  const handleUndo = () => {
    if (originalText !== null) {
      onChange(originalText);
      setOriginalText(null);
    }
  };

  const characterCount = value.length;
  const isOverLimit = characterCount > config.maxLength;

  return (
    <Container>
      <Header>
        {label && <Label htmlFor={`text-${field}`}>{label}</Label>}
        <CharacterCount $isOver={isOverLimit}>
          {characterCount}/{config.maxLength}
        </CharacterCount>
      </Header>

      <TextareaWrapper>
        <Textarea
          id={`text-${field}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || config.placeholder}
          rows={rows}
          disabled={isEnhancing}
          $isOver={isOverLimit}
        />
      </TextareaWrapper>

      <ActionsContainer>
        <ActionsRow>
          <AILabel>
            <SparkleIcon />
            AI Assist:
          </AILabel>
          {availableActions.map((action) => (
            <ActionButton
              key={action.id}
              onClick={() => handleEnhance(action.id as TextAction)}
              disabled={!value.trim() || isEnhancing}
              $isActive={activeAction === action.id}
            >
              {activeAction === action.id ? <Spinner /> : <ActionIcon type={action.icon} />}
              {action.label}
            </ActionButton>
          ))}
        </ActionsRow>

        {originalText !== null && !isEnhancing && (
          <UndoButton onClick={handleUndo}>
            <UndoIcon />
            Undo changes
          </UndoButton>
        )}
      </ActionsContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}

function ActionIcon({ type }: { type: string }) {
  switch (type) {
    case 'check':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      );
    case 'refresh':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      );
    case 'voice':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
        </svg>
      );
    case 'expand':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 21l-6-6m6 6v-4.8m0 4.8h-4.8M3 16.2V21m0 0h4.8M3 21l6-6M21 3h-4.8M21 3v4.8M21 3l-6 6M3 7.8V3m0 0h4.8M3 3l6 6" />
        </svg>
      );
    default:
      return null;
  }
}

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const UndoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`;

const CharacterCount = styled.span<{ $isOver: boolean }>`
  font-size: 0.75rem;
  color: ${(props) =>
    props.$isOver ? props.theme.colors.error : props.theme.colors.text.tertiary};
`;

const TextareaWrapper = styled.div`
  position: relative;
`;

const Textarea = styled.textarea<{ $isOver: boolean }>`
  width: 100%;
  padding: 1rem;
  border: 1px solid
    ${(props) => (props.$isOver ? props.theme.colors.error : props.theme.colors.border.light)};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.card};
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$isOver ? props.theme.colors.error : props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px
      ${(props) => (props.$isOver ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 160, 196, 0.1)')};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const AILabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary.main};
`;

const ActionButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: ${(props) =>
    props.$isActive ? props.theme.colors.primary.main : props.theme.colors.background.page};
  border: 1px solid
    ${(props) =>
      props.$isActive ? props.theme.colors.primary.main : props.theme.colors.border.light};
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => (props.$isActive ? 'white' : props.theme.colors.text.secondary)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors.primary.main};
    border-color: ${(props) => props.theme.colors.primary.main};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UndoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  padding: 0;
  background: none;
  border: none;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const Spinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  font-size: 0.75rem;
  margin: 0;
  padding: 0.5rem 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.25rem;
`;
