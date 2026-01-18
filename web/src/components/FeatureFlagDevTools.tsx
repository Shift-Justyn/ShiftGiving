import { useState } from 'react';
import styled from 'styled-components';
import { useFeatureFlags } from '../context/FeatureFlagsContext';
import {
  FeatureFlagName,
  FLAG_DESCRIPTIONS,
  DEFAULT_FLAGS,
  isProduction,
} from '../config/featureFlags';

export const FeatureFlagDevTools = () => {
  const { flags, toggleFlag, resetFlags, canToggle } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);

  if (isProduction() || !canToggle) {
    return null;
  }

  const flagNames = Object.keys(DEFAULT_FLAGS) as FeatureFlagName[];

  return (
    <>
      <ToggleButton onClick={() => setIsOpen(!isOpen)} aria-label="Toggle feature flags panel">
        {isOpen ? 'X' : 'FF'}
      </ToggleButton>
      {isOpen && (
        <Panel>
          <PanelHeader>
            <Title>Feature Flags</Title>
            <ResetButton onClick={resetFlags}>Reset All</ResetButton>
          </PanelHeader>
          <FlagList>
            {flagNames.map((flagName) => (
              <FlagItem key={flagName}>
                <FlagLabel>
                  <Checkbox
                    type="checkbox"
                    checked={flags[flagName]}
                    onChange={() => toggleFlag(flagName)}
                  />
                  <FlagName>{flagName}</FlagName>
                </FlagLabel>
                <FlagDescription>{FLAG_DESCRIPTIONS[flagName]}</FlagDescription>
              </FlagItem>
            ))}
          </FlagList>
        </Panel>
      )}
    </>
  );
};

const ToggleButton = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  border: none;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #4f46e5;
  }
`;

const Panel = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  width: 20rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 9998;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const ResetButton = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

const FlagList = styled.div`
  max-height: 20rem;
  overflow-y: auto;
`;

const FlagItem = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const FlagLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const FlagName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  font-family: monospace;
`;

const FlagDescription = styled.p`
  margin: 0.25rem 0 0 1.5rem;
  font-size: 0.75rem;
  color: #6b7280;
`;
