import { useMemo } from 'react';
import styled from 'styled-components';
import {
  GraduationCap,
  Stethoscope,
  Leaf,
  Heart,
  Users,
  Palette,
  Clock,
  Sparkles,
  Zap,
  DollarSign,
  X,
} from 'lucide-react';
import { Campaign } from '../../api/types';

export interface FilterState {
  categories: string[];
  status: string;
  goalRange: string;
}

interface CampaignFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem 0;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.primary.light}40;
    border-radius: 0.125rem;
  }
`;

const FilterLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  flex-shrink: 0;
`;

const FilterDivider = styled.div`
  width: 1px;
  height: 1.5rem;
  background: ${(props) => props.theme.colors.border.light};
  margin: 0 0.25rem;
  flex-shrink: 0;
`;

const FilterChip = styled.button<{ $active: boolean; $color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 2rem;
  border: 1.5px solid
    ${(props) =>
      props.$active
        ? props.$color || props.theme.colors.primary.main
        : props.theme.colors.border.light};
  background: ${(props) =>
    props.$active
      ? `linear-gradient(135deg, ${props.$color || props.theme.colors.primary.main} 0%, ${props.$color || props.theme.colors.primary.main}dd 100%)`
      : props.theme.colors.background.card};
  color: ${(props) => (props.$active ? '#ffffff' : props.theme.colors.text.secondary)};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.$active
      ? `0 2px 8px ${props.$color || props.theme.colors.primary.main}40`
      : '0 1px 3px rgba(0, 0, 0, 0.05)'};
  flex-shrink: 0;

  svg {
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.$active
        ? `0 4px 12px ${props.$color || props.theme.colors.primary.main}50`
        : '0 2px 8px rgba(0, 0, 0, 0.1)'};
    border-color: ${(props) => props.$color || props.theme.colors.primary.main};
    color: ${(props) => (props.$active ? '#ffffff' : props.theme.colors.text.primary)};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${(props) => props.$color || props.theme.colors.primary.main}30;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1.5px dashed ${(props) => props.theme.colors.border.light};
  border-radius: 2rem;
  background: transparent;
  color: ${(props) => props.theme.colors.text.tertiary};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.error};
    color: ${(props) => props.theme.colors.error};
    background: ${(props) => props.theme.colors.error}10;
  }
`;

const CATEGORY_CONFIG = [
  { value: 'Education', icon: GraduationCap, color: '#3B82F6' },
  { value: 'Health', icon: Stethoscope, color: '#EF4444' },
  { value: 'Environment', icon: Leaf, color: '#22C55E' },
  { value: 'Animals', icon: Heart, color: '#F97316' },
  { value: 'Community', icon: Users, color: '#8B5CF6' },
  { value: 'Arts', icon: Palette, color: '#EC4899' },
];

const STATUS_OPTIONS = [
  { value: 'All', label: 'All', icon: null },
  { value: 'Active', label: 'Active', icon: Zap },
  { value: 'Closing Soon', label: 'Ending Soon', icon: Clock },
  { value: 'New', label: 'New', icon: Sparkles },
];

const GOAL_RANGES = [
  { value: 'Any', label: 'Any' },
  { value: 'Under $10k', label: '< $10k' },
  { value: '$10k-$50k', label: '$10k-$50k' },
  { value: '$50k+', label: '$50k+' },
];

export function CampaignFilters({ filters, onChange }: CampaignFiltersProps) {
  const hasActiveFilters = useMemo(() => {
    return filters.categories.length > 0 || filters.status !== 'All' || filters.goalRange !== 'Any';
  }, [filters]);

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onChange({ ...filters, categories: newCategories });
  };

  const setStatus = (status: string) => {
    onChange({ ...filters, status });
  };

  const setGoalRange = (goalRange: string) => {
    onChange({ ...filters, goalRange });
  };

  const clearFilters = () => {
    onChange({ categories: [], status: 'All', goalRange: 'Any' });
  };

  return (
    <FiltersWrapper>
      <FilterRow>
        <FilterLabel>Category</FilterLabel>
        {CATEGORY_CONFIG.map((category) => {
          const Icon = category.icon;
          return (
            <FilterChip
              key={category.value}
              $active={filters.categories.includes(category.value)}
              $color={category.color}
              onClick={() => toggleCategory(category.value)}
            >
              <Icon />
              {category.value}
            </FilterChip>
          );
        })}
        <FilterDivider />
        <FilterLabel>Status</FilterLabel>
        {STATUS_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <FilterChip
              key={option.value}
              $active={filters.status === option.value}
              onClick={() => setStatus(option.value)}
            >
              {Icon && <Icon />}
              {option.label}
            </FilterChip>
          );
        })}
        <FilterDivider />
        <FilterLabel>Goal</FilterLabel>
        {GOAL_RANGES.map((range) => (
          <FilterChip
            key={range.value}
            $active={filters.goalRange === range.value}
            onClick={() => setGoalRange(range.value)}
          >
            <DollarSign />
            {range.label}
          </FilterChip>
        ))}
        {hasActiveFilters && (
          <>
            <FilterDivider />
            <ClearButton onClick={clearFilters}>
              <X />
              Clear
            </ClearButton>
          </>
        )}
      </FilterRow>
    </FiltersWrapper>
  );
}

export function filterCampaigns(campaigns: Campaign[], filters: FilterState): Campaign[] {
  return campaigns.filter((campaign) => {
    if (filters.categories.length > 0 && !filters.categories.includes(campaign.category || '')) {
      return false;
    }

    if (filters.status !== 'All') {
      if (filters.status === 'Closing Soon') {
        const daysUntilEnd = Math.ceil(
          (new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilEnd > 7) {
          return false;
        }
      } else if (filters.status === 'New') {
        const startDate = new Date(campaign.endDate);
        const daysSinceStart = Math.ceil(
          (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceStart > 30) {
          return false;
        }
      } else if (campaign.status !== filters.status) {
        return false;
      }
    }

    if (filters.goalRange !== 'Any') {
      const goal = campaign.goalAmount;
      if (filters.goalRange === 'Under $10k' && goal >= 10000) {
        return false;
      }
      if (filters.goalRange === '$10k-$50k' && (goal < 10000 || goal >= 50000)) {
        return false;
      }
      if (filters.goalRange === '$50k+' && goal < 50000) {
        return false;
      }
    }

    return true;
  });
}
