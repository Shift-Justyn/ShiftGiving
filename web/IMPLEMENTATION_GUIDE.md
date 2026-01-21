# Campaign Map and Filters Implementation Guide

This guide explains how to integrate the newly created CampaignMap and CampaignFilters components into the GivingApp HomePage.

## Files Created

### Components
- `/src/components/maps/CampaignMap.tsx` - Interactive Leaflet map component
- `/src/components/maps/index.ts` - Map component exports
- `/src/components/filters/CampaignFilters.tsx` - Filter chips and logic
- `/src/components/filters/CampaignFilters.test.tsx` - Filter logic tests
- `/src/components/filters/index.ts` - Filter component exports

### Types Updated
- `/src/api/types.ts` - Added `latitude`, `longitude`, `category` to Organization
- `/src/api/types.ts` - Added `category`, `location` to Campaign

### Mock Data Updated
- `/src/mocks/data.ts` - Added coordinates and categories to all organizations
- `/src/mocks/data.ts` - Added categories and locations to all campaigns

## Dependencies Installed

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "@types/leaflet": "^1.9.21"
}
```

## Usage Example

### 1. Import Components

```tsx
import { CampaignMap } from '../components/maps';
import { CampaignFilters, filterCampaigns, FilterState } from '../components/filters';
```

### 2. Add Filter State

```tsx
const [filters, setFilters] = useState<FilterState>({
  categories: [],
  status: 'All',
  goalRange: 'Any',
});
```

### 3. Filter Campaigns

```tsx
const filteredCampaigns = useMemo(
  () => filterCampaigns(campaigns, filters),
  [campaigns, filters]
);
```

### 4. Add to JSX

```tsx
{/* Map Section */}
<CampaignMap
  organizations={organizations}
  onMarkerClick={(orgId) => {
    // Handle marker click - could navigate to organization page
    console.log('Clicked organization:', orgId);
  }}
/>

{/* Filter Section */}
<CampaignFilters
  filters={filters}
  onChange={setFilters}
  campaigns={campaigns}
/>

{/* Display filtered campaigns */}
<div className="campaigns-grid">
  {filteredCampaigns.map((campaign) => (
    <CampaignCard key={campaign.id} campaign={campaign} />
  ))}
</div>
```

## Styling

### Map Styling
The map uses OpenStreetMap tiles (free, no API key needed) with custom teal markers matching the GivingApp brand color (#00A0C4).

Map dimensions:
- Mobile: 300px height
- Desktop: 400px height
- Border radius: 0.5rem
- Box shadow: subtle shadow for depth

### Filter Styling
Filter chips follow the Carbon Offset platform's visual design:
- Pill-shaped buttons with rounded borders
- Active state: Teal background (#00A0C4) with white text
- Inactive state: White background with gray border
- Smooth transitions on hover
- Horizontal scroll on mobile
- "Clear All" link appears when filters are active

## Filter Options

### Categories
- Education
- Health
- Environment
- Animals
- Community
- Arts

### Status
- All
- Active
- Closing Soon (campaigns ending within 7 days)
- New (campaigns created within 30 days)

### Goal Range
- Any
- Under $10k
- $10k-$50k
- $50k+

## Map Features

### Markers
- Teal-colored pin markers at each organization location
- Click to open popup with organization info
- Popup shows:
  - Organization name
  - Campaign count
  - "View" button

### Default View
- Center: USA (39.8283, -98.5795)
- Zoom level: 4
- Shows all US-based organizations

### Marker Click Handling
The `onMarkerClick` callback receives the organization ID when a marker is clicked. You can use this to:
- Navigate to the organization page
- Filter campaigns by organization
- Show organization details in a modal

## Testing

All filter logic is thoroughly tested in `CampaignFilters.test.tsx`:
- Category filtering (single and multiple)
- Goal range filtering (all ranges)
- Combined filters
- Empty results handling

Run tests:
```bash
npm test
```

All 179 tests pass, including 8 new tests for the filter logic.

## Mock Data Overview

### Organizations (5 total)
1. Paws Rescue Foundation - Portland, OR (Animals)
2. Grace Community Church - Austin, TX (Community)
3. City Food Bank - Seattle, WA (Community)
4. Future Leaders Youth Program - Chicago, IL (Education)
5. Disaster Relief International - Miami, FL (Health)

### Campaigns (8 total)
- 2 Animals campaigns (Portland)
- 2 Community campaigns (Austin, Seattle)
- 2 Education campaigns (Chicago)
- 1 Health campaign (Miami)
- 1 Environment campaign (Seattle)

## Responsive Design

### Mobile
- Map: 300px height
- Filters: Horizontal scroll with touch support
- Single column campaign grid

### Desktop
- Map: 400px height
- Filters: All visible in row
- Multi-column campaign grid

## Accessibility

- All interactive elements are keyboard accessible
- Focus states clearly indicated
- Semantic HTML structure
- ARIA labels where appropriate

## Performance

- Memoized filter calculations
- Debounced filter updates recommended for real-time filtering
- Map renders only once on mount
- Markers update efficiently when organizations change

## Future Enhancements

1. Add search functionality to filters
2. Add location-based filtering
3. Add map clustering for many organizations
4. Add campaign markers (in addition to organization markers)
5. Add filter persistence (localStorage or URL params)
6. Add animated transitions for filter changes
7. Add filter result count display
