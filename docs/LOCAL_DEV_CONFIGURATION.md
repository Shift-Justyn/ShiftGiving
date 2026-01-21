# Local Development Configuration Guide

This guide ensures local development environment mirrors production to prevent deployment issues.

## Key Configuration Differences

### 1. Database Column Naming

**Production Database**: PostgreSQL uses `snake_case` column names.
**Local Mock Data**: JavaScript/TypeScript uses `camelCase` property names.

When adding new fields to models:

1. **Add to API Model** (`api/ShiftGiving/Models/*.cs`):
   ```csharp
   public string? StoryContent { get; set; }
   ```

2. **Add DbContext Column Mapping** (`api/ShiftGiving/Data/ShiftGivingDbContext.cs`):
   ```csharp
   entity.Property(e => e.StoryContent).HasColumnName("story_content").HasColumnType("text");
   ```

3. **Add to DTO** (`api/ShiftGiving/DTOs/*.cs`):
   ```csharp
   public string? StoryContent { get; set; }
   ```

4. **Add to Service Mapping** (`api/ShiftGiving/Services/*.cs`):
   ```csharp
   StoryContent = c.StoryContent
   ```

5. **Add to Frontend Types** (`web/src/api/types.ts`):
   ```typescript
   storyContent?: string;
   ```

6. **Add to Mock Data** (`web/src/mocks/data.ts`):
   ```typescript
   storyContent: 'Story text here...',
   ```

7. **Run Database Migration** (via bastion or SQL script)

### 2. Entity IDs

**Production Database**: Uses UUIDs like `c1111111-1111-1111-1111-111111111111`
**Local Mock Data**: Must use same UUID format

Production Campaign IDs:
- The Pantry at Hope: `c1111111-1111-1111-1111-111111111111`
- Cafe Hope: `c2222222-2222-2222-2222-222222222222`
- Homes of Hope: `c3333333-3333-3333-3333-333333333333`
- Thanksgiving Meal Packaging: `c4444444-4444-4444-4444-444444444444`
- Souper Bowl Food Drive: `c5555555-5555-5555-5555-555555555555`
- Back-to-School Drive: `c6666666-6666-6666-6666-666666666666`
- Emergency Animal Shelter: `c7777777-7777-7777-7777-777777777777`
- Winter Warming Station: `c8888888-8888-8888-8888-888888888888`
- Community Outreach Program: `c9999999-9999-9999-9999-999999999999`
- Scholarship Fund: `caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`
- Emergency Food Distribution: `cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb`
- Disaster Relief Medical: `cccccccc-cccc-cccc-cccc-cccccccccccc`
- Youth Tech Training: `cddddddd-dddd-dddd-dddd-dddddddddddd`
- Fresh Produce Gardens: `ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee`
- Every Birthday Matters: `cfffffff-ffff-ffff-ffff-ffffffffffff`
- Kelp Forest Restoration: `d1111111-1111-1111-1111-111111111111`
- Amazon Rainforest: `d2222222-2222-2222-2222-222222222222`

Production Organization IDs:
- Hope West Des Moines: `11111111-1111-1111-1111-111111111111`
- PAWS Rescue: `22222222-2222-2222-2222-222222222222`
- Grace Community Church: `33333333-3333-3333-3333-333333333333`
- City Food Bank: `44444444-4444-4444-4444-444444444444`
- Future Leaders Youth: `55555555-5555-5555-5555-555555555555`
- Disaster Relief International: `66666666-6666-6666-6666-666666666666`
- Cancer Screen Iowa: `77777777-7777-7777-7777-777777777777`
- Ocean Restoration Coalition: `88888888-8888-8888-8888-888888888888`
- Amazon Conservation Trust: `99999999-9999-9999-9999-999999999999`

### 3. Featured Campaigns Configuration

Production featured campaigns (displayed on homepage in this order):
1. The Pantry at Hope (c1111111)
2. Cafe Hope (c2222222)
3. Homes of Hope (c3333333)
4. Community Outreach Program (c9999999)
5. Every Birthday Matters (cfffffff)
6. Kelp Forest Restoration (d1111111)

The `is_featured` and `display_order` columns control this.

### 4. Organization Ordering

Organizations are ordered by `display_order` column:
1. Hope West Des Moines
2. Cancer Screen Iowa
3. City Food Bank
4. Disaster Relief International
5. Future Leaders Youth
6. Grace Community Church
7. Ocean Restoration Coalition
8. PAWS Rescue
9. Amazon Conservation Trust

### 5. API Response Wrapper

Production API wraps responses in:
```json
{
  "success": true,
  "data": {...},
  "error": null
}
```

The frontend API client (`web/src/api/client.ts`) extracts `data` from this wrapper.

### 6. Environment Variables

**Local Development** (`.env.local` or default):
```
VITE_API_URL=http://localhost:5237
VITE_GOOGLE_MAPS_API_KEY=your-dev-key
```

**Production** (`.env.production`):
```
VITE_API_URL=https://6egddr9uvm.us-east-1.awsapprunner.com
VITE_GOOGLE_MAPS_API_KEY=production-key
```

### 7. Mock Service Worker (MSW)

MSW only runs in development mode (`import.meta.env.DEV`).

To test against real API locally:
1. Disable MSW in `src/index.tsx` by commenting out the `enableMocks()` call
2. Set `VITE_API_URL=https://6egddr9uvm.us-east-1.awsapprunner.com` in `.env.local`
3. Run `npm run dev`

### 8. Database Migrations

Never modify production database directly. Always:
1. Create SQL migration script in `/tmp/` or `migrations/` folder
2. Upload to S3: `aws s3 cp script.sql s3://shift-giving-web-app-bucket/migrations/`
3. Run via bastion instance with PostgreSQL client

### 9. Image URLs

Production images are stored in S3 and served via CloudFront.
Local development can use placeholder images or local `/public/images/` folder.

### 10. Testing Checklist Before Deployment

Before deploying any changes:

- [ ] API builds without errors: `dotnet build`
- [ ] Web builds without errors: `npm run build`
- [ ] Unit tests pass: `npm test`, `dotnet test`
- [ ] Check new model properties have:
  - [ ] DbContext column mapping with snake_case name
  - [ ] DTO property
  - [ ] Service mapping
  - [ ] Frontend type definition
  - [ ] Mock data (if using MSW)
- [ ] SQL migration script prepared for new columns
- [ ] Environment variables set correctly

## Common Issues and Solutions

### Issue: Map pins not showing in production
**Cause**: Organization model missing `Latitude`, `Longitude` properties or DbContext mapping.
**Solution**: Add properties to model, DTO, DbContext mapping, and run database migration.

### Issue: Campaign stories showing same content
**Cause**: `StoryContent` field not mapped correctly or MSW returning mock data.
**Solution**: Ensure production build uses real API (MSW disabled) and API returns correct `storyContent`.

### Issue: Organization/Campaign ordering wrong
**Cause**: `DisplayOrder` column not set or not included in ORDER BY.
**Solution**: Add `DisplayOrder` property and update Service to order by it.

### Issue: API 500 errors with "column does not exist"
**Cause**: New model property added without DbContext column mapping.
**Solution**: Add `entity.Property(e => e.NewProp).HasColumnName("new_prop")` to DbContext.
