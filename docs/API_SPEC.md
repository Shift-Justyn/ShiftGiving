# API Specification - ShiftGiving

This document defines the REST API endpoints for the ShiftGiving backend.

## Base URL

- **Local**: `http://localhost:5237/api`
- **QA**: `https://api-qa.shiftgiving.app/api`
- **Production**: `https://api.shiftgiving.app/api`

## Authentication

All protected endpoints require a JWT Bearer token:

```
Authorization: Bearer <token>
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { },
  "error": null,
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5
  }
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": { }
  }
}
```

---

## Endpoints

### Health Check

#### GET /health
Check API health status.

**Response**: `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T12:00:00Z",
  "database": "connected"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "userType": "individual"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "individual"
    },
    "token": "jwt_token_here"
  }
}
```

---

### POST /api/auth/login
Authenticate user.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "individual",
      "avatarUrl": "https://..."
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

---

### POST /api/auth/refresh
Refresh access token.

**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

### POST /api/auth/forgot-password
Request password reset.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

---

## User Endpoints

### GET /api/users/me
Get current user profile.

**Auth Required**: Yes

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "userType": "individual",
    "avatarUrl": "https://...",
    "linkedOrganizations": [
      {
        "id": "uuid",
        "name": "YMCA"
      }
    ]
  }
}
```

---

### PUT /api/users/me
Update current user profile.

**Auth Required**: Yes

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://..."
}
```

**Response**: `200 OK`

---

### POST /api/users/link-organization
Link user to organization via code.

**Auth Required**: Yes

**Request Body**:
```json
{
  "organizationCode": "1234"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": "uuid",
      "name": "YMCA",
      "logoUrl": "https://..."
    }
  }
}
```

---

## Campaign Endpoints

### GET /api/campaigns
List campaigns with pagination and filters.

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| page | int | Page number (default: 1) |
| pageSize | int | Items per page (default: 20, max: 100) |
| status | string | Filter by status: active, closing_soon, completed |
| organizationId | uuid | Filter by organization |
| search | string | Search in title/description |
| featured | bool | Only featured campaigns |

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Build a Computer Lab",
      "shortDescription": "Help us build...",
      "goalAmount": 250000.00,
      "raisedAmount": 175000.00,
      "status": "active",
      "featuredImageUrl": "https://...",
      "organization": {
        "id": "uuid",
        "name": "YMCA",
        "logoUrl": "https://..."
      },
      "endDate": "2026-03-01"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 45,
    "totalPages": 3
  }
}
```

---

### GET /api/campaigns/:id
Get campaign details.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Build a Computer Lab",
    "description": "Full description...",
    "shortDescription": "Help us build...",
    "goalAmount": 250000.00,
    "raisedAmount": 175000.00,
    "status": "active",
    "startDate": "2026-01-01",
    "endDate": "2026-03-01",
    "featuredImageUrl": "https://...",
    "videoUrl": "https://...",
    "images": [
      { "url": "https://...", "altText": "Lab render" }
    ],
    "programs": [
      { "name": "Youth Education", "description": "..." }
    ],
    "socialLinks": {
      "facebook": "https://...",
      "twitter": "https://...",
      "instagram": "https://...",
      "linkedin": "https://..."
    },
    "organization": {
      "id": "uuid",
      "name": "YMCA",
      "logoUrl": "https://...",
      "description": "..."
    }
  }
}
```

---

### POST /api/campaigns
Create a new campaign (organization admin only).

**Auth Required**: Yes (organization_admin)

**Request Body**:
```json
{
  "title": "Build a Computer Lab",
  "description": "Full description...",
  "shortDescription": "Help us build...",
  "goalAmount": 250000.00,
  "startDate": "2026-01-01",
  "endDate": "2026-03-01",
  "featuredImageUrl": "https://..."
}
```

**Response**: `201 Created`

---

### PUT /api/campaigns/:id
Update a campaign (organization admin only).

**Auth Required**: Yes (organization_admin)

**Request Body**: Same as POST

**Response**: `200 OK`

---

### DELETE /api/campaigns/:id
Delete/cancel a campaign (organization admin only).

**Auth Required**: Yes (organization_admin)

**Response**: `204 No Content`

---

## Organization Endpoints

### GET /api/organizations
List organizations.

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| page | int | Page number |
| pageSize | int | Items per page |
| search | string | Search in name/description |

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "YMCA Des Moines",
      "description": "Building healthy communities...",
      "logoUrl": "https://...",
      "campaignCount": 5
    }
  ]
}
```

---

### GET /api/organizations/:id
Get organization details.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "YMCA Des Moines",
    "description": "Full description...",
    "logoUrl": "https://...",
    "websiteUrl": "https://...",
    "contactEmail": "contact@ymca.org",
    "activeCampaigns": [
      { "id": "uuid", "title": "Build a Computer Lab" }
    ]
  }
}
```

---

### GET /api/organizations/code/:code
Lookup organization by code.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "YMCA Des Moines",
    "logoUrl": "https://..."
  }
}
```

---

## Donation Endpoints

### POST /api/donations
Create a donation.

**Auth Required**: Yes

**Request Body**:
```json
{
  "campaignId": "uuid",
  "amount": 100.00,
  "paymentMethodId": "pm_stripe_id",
  "isAnonymous": false,
  "donorMessage": "Keep up the great work!"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 100.00,
    "status": "completed",
    "campaign": {
      "id": "uuid",
      "title": "Build a Computer Lab"
    },
    "createdAt": "2026-01-17T12:00:00Z"
  }
}
```

---

### GET /api/donations
Get user's donation history.

**Auth Required**: Yes

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| page | int | Page number |
| pageSize | int | Items per page |
| startDate | date | Filter start |
| endDate | date | Filter end |

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 100.00,
      "status": "completed",
      "createdAt": "2026-01-17T12:00:00Z",
      "campaign": {
        "id": "uuid",
        "title": "Build a Computer Lab"
      },
      "organization": {
        "id": "uuid",
        "name": "YMCA"
      }
    }
  ]
}
```

---

### GET /api/donations/:id
Get donation details.

**Auth Required**: Yes

**Response**: `200 OK`

---

## Organization Dashboard Endpoints

### GET /api/dashboard/overview
Get organization dashboard metrics.

**Auth Required**: Yes (organization_admin)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "totalDonations": 513068.98,
    "donationCount": 1523,
    "donorCount": 847,
    "campaignCount": 12,
    "weekOverWeek": {
      "donations": 12.5,
      "donorCount": 8.2
    }
  }
}
```

---

### GET /api/dashboard/donations
Get organization's donation list.

**Auth Required**: Yes (organization_admin)

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| page | int | Page number |
| pageSize | int | Items per page |
| campaignId | uuid | Filter by campaign |
| startDate | date | Filter start |
| endDate | date | Filter end |

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 100.00,
      "createdAt": "2026-01-17T12:00:00Z",
      "donor": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "campaign": {
        "id": "uuid",
        "title": "Build a Computer Lab"
      }
    }
  ]
}
```

---

### GET /api/dashboard/analytics
Get analytics data for charts.

**Auth Required**: Yes (organization_admin)

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| period | string | daily, weekly, monthly |
| startDate | date | Start of period |
| endDate | date | End of period |

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "timeline": [
      { "date": "2026-01-01", "donations": 5230.00, "count": 23 },
      { "date": "2026-01-02", "donations": 3100.00, "count": 15 }
    ],
    "programAllocation": [
      { "program": "Youth Education", "percentage": 45 },
      { "program": "Community Health", "percentage": 30 }
    ]
  }
}
```

---

## Message Endpoints

### GET /api/messages
Get messages for user.

**Auth Required**: Yes

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Thank you for your support!",
      "content": "Message content...",
      "imageUrl": "https://...",
      "createdAt": "2026-01-17T12:00:00Z",
      "organization": {
        "id": "uuid",
        "name": "YMCA"
      }
    }
  ]
}
```

---

### POST /api/messages
Create a message (organization admin only).

**Auth Required**: Yes (organization_admin)

**Request Body**:
```json
{
  "title": "Thank you for your support!",
  "content": "Message content...",
  "messageType": "story",
  "imageUrl": "https://...",
  "scheduledAt": "2026-01-20T09:00:00Z"
}
```

**Response**: `201 Created`

---

## Payment Endpoints

### POST /api/payments/create-intent
Create Stripe payment intent.

**Auth Required**: Yes

**Request Body**:
```json
{
  "amount": 100.00,
  "campaignId": "uuid"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

---

### GET /api/payments/methods
Get user's saved payment methods.

**Auth Required**: Yes

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "cardBrand": "visa",
      "cardLastFour": "4242",
      "expMonth": 12,
      "expYear": 2028,
      "isDefault": true
    }
  ]
}
```

---

### POST /api/payments/methods
Save a payment method.

**Auth Required**: Yes

**Request Body**:
```json
{
  "paymentMethodId": "pm_stripe_id",
  "setAsDefault": true
}
```

**Response**: `201 Created`

---

### DELETE /api/payments/methods/:id
Delete a saved payment method.

**Auth Required**: Yes

**Response**: `204 No Content`

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid request data |
| UNAUTHORIZED | 401 | Missing/invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| PAYMENT_FAILED | 402 | Payment processing failed |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authenticated**: 200 requests per minute per user
- **Payment endpoints**: 10 requests per minute per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705500000
```
