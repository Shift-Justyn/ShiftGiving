import styled from 'styled-components';

export type UserType = 'individual' | 'charity';

interface UserTypeToggleProps {
  value: UserType;
  onChange: (type: UserType) => void;
  disabled?: boolean;
}

const Container = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const Option = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${(props) => (props.$active ? props.theme.colors.primary.main : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : props.theme.colors.text.secondary)};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$active ? props.theme.colors.primary.hover : '#f3f4f6')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const UserTypeToggle = ({ value, onChange, disabled }: UserTypeToggleProps) => {
  return (
    <Container>
      <Option
        type="button"
        $active={value === 'individual'}
        onClick={() => onChange('individual')}
        disabled={disabled}
      >
        Join as an Individual
      </Option>
      <Option
        type="button"
        $active={value === 'charity'}
        onClick={() => onChange('charity')}
        disabled={disabled}
      >
        Join as a Charity
      </Option>
    </Container>
  );
};
