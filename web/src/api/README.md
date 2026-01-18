# API Client

TypeScript-based API client for the Shift Giving backend API.

## Usage

### Authentication

```typescript
import { login, register } from './api';

const response = await login({
  email: 'user@example.com',
  password: 'password123',
});
console.log(response.token, response.userId);

await register({
  email: 'new@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
});
```

### Campaigns

```typescript
import { getCampaigns, getCampaignById } from './api';

const campaigns = await getCampaigns({
  page: 1,
  pageSize: 10,
  status: 'Active',
  featured: true,
});

const campaign = await getCampaignById('campaign-id');
```

### Organizations

```typescript
import { getOrganizations, getOrganizationById } from './api';

const orgs = await getOrganizations();
const org = await getOrganizationById('org-id');
```

## Error Handling

```typescript
import { HttpError } from './api';

try {
  await login({ email: 'test@example.com', password: 'wrong' });
} catch (error) {
  if (error instanceof HttpError) {
    console.log(error.statusCode, error.message);
  }
}
```

## Testing

All API client functions have 100% test coverage.

```bash
npm test -- --testPathPattern=src/api
```
