import { useMemo } from 'react';
import styled from 'styled-components';
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

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid ${(props) => (props.$active ? 'transparent' : '#d1d5db')};
  background-color: ${(props) => (props.$active ? '#00A0C4' : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : '#374151')};
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$active ? '#008ca8' : '#f3f4f6')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 160, 196, 0.1);
  }
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: #00a0c4;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: #008ca8;
  }
`;

const CATEGORIES = ['Education', 'Health', 'Environment', 'Animals', 'Community', 'Arts'];

const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Closing Soon', label: 'Closing Soon' },
  { value: 'New', label: 'New' },
];

const GOAL_RANGES = [
  { value: 'Any', label: 'Any' },
  { value: 'Under $10k', label: 'Under $10k' },
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
    <FiltersContainer>
      {CATEGORIES.map((category) => (
        <FilterChip
          key={category}
          $active={filters.categories.includes(category)}
          onClick={() => toggleCategory(category)}
        >
          {category}
        </FilterChip>
      ))}
      {STATUS_OPTIONS.map((option) => (
        <FilterChip
          key={option.value}
          $active={filters.status === option.value}
          onClick={() => setStatus(option.value)}
        >
          {option.label}
        </FilterChip>
      ))}
      {GOAL_RANGES.map((range) => (
        <FilterChip
          key={range.value}
          $active={filters.goalRange === range.value}
          onClick={() => setGoalRange(range.value)}
        >
          {range.label}
        </FilterChip>
      ))}
      {hasActiveFilters && <ClearButton onClick={clearFilters}>Clear All</ClearButton>}
    </FiltersContainer>
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
