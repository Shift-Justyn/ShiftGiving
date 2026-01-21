# Data Models - GivingApp

This document defines the database schema and entity relationships for GivingApp.

## Database Overview

- **Database**: PostgreSQL 16+
- **ORM**: Entity Framework Core (.NET)
- **Hosting**: AWS RDS (existing instance)

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │───────│  Donations  │───────│  Campaigns  │
└─────────────┘       └─────────────┘       └─────────────┘
       │                                           │
       │              ┌─────────────┐              │
       └──────────────│Organizations│──────────────┘
                      └─────────────┘
                             │
                      ┌─────────────┐
                      │  Messages   │
                      └─────────────┘
```

---

## Core Entities

### 1. Users

Stores both individual donors and organization administrators.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('individual', 'organization_admin')),
    organization_id UUID REFERENCES organizations(id),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
```

**C# Entity**:
```csharp
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public UserType UserType { get; set; }
    public Guid? OrganizationId { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; }
    public bool EmailVerified { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Organization? Organization { get; set; }
    public ICollection<Donation> Donations { get; set; }
}

public enum UserType
{
    Individual,
    OrganizationAdmin
}
```

---

### 2. Organizations

Nonprofit organizations that create campaigns and receive donations.

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    organization_code VARCHAR(10) UNIQUE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    tax_id VARCHAR(20),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_organizations_code ON organizations(organization_code);
CREATE INDEX idx_organizations_name ON organizations(name);
```

**C# Entity**:
```csharp
public class Organization
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? OrganizationCode { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string Country { get; set; } = "USA";
    public string? TaxId { get; set; }
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<User> Admins { get; set; }
    public ICollection<Campaign> Campaigns { get; set; }
    public ICollection<Donation> Donations { get; set; }
}
```

---

### 3. Campaigns

Fundraising campaigns created by organizations.

```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    goal_amount DECIMAL(12, 2) NOT NULL,
    raised_amount DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'closing_soon', 'completed', 'cancelled')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    featured_image_url VARCHAR(500),
    video_url VARCHAR(500),
    social_facebook VARCHAR(500),
    social_twitter VARCHAR(500),
    social_instagram VARCHAR(500),
    social_linkedin VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,

    CONSTRAINT chk_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_amounts CHECK (goal_amount > 0)
);

CREATE INDEX idx_campaigns_organization ON campaigns(organization_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
```

**C# Entity**:
```csharp
public class Campaign
{
    public Guid Id { get; set; }
    public Guid OrganizationId { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public decimal GoalAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public CampaignStatus Status { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public string? SocialFacebook { get; set; }
    public string? SocialTwitter { get; set; }
    public string? SocialInstagram { get; set; }
    public string? SocialLinkedin { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Organization Organization { get; set; }
    public ICollection<Donation> Donations { get; set; }
    public ICollection<CampaignImage> Images { get; set; }
    public ICollection<CampaignProgram> Programs { get; set; }
}

public enum CampaignStatus
{
    Draft,
    Active,
    ClosingSoon,
    Completed,
    Cancelled
}
```

---

### 4. Campaign Images

Additional images for campaigns.

```sql
CREATE TABLE campaign_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_campaign_images_campaign ON campaign_images(campaign_id);
```

---

### 5. Campaign Programs

Programs/categories within a campaign.

```sql
CREATE TABLE campaign_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    allocation_percentage DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_campaign_programs_campaign ON campaign_programs(campaign_id);
```

---

### 6. Donations

Individual donation transactions.

```sql
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    campaign_id UUID NOT NULL REFERENCES campaigns(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT false,
    donor_message TEXT,
    receipt_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_amount CHECK (amount > 0)
);

CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_donations_organization ON donations(organization_id);
CREATE INDEX idx_donations_created ON donations(created_at);
CREATE INDEX idx_donations_status ON donations(status);
```

**C# Entity**:
```csharp
public class Donation
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CampaignId { get; set; }
    public Guid OrganizationId { get; set; }
    public decimal Amount { get; set; }
    public DonationStatus Status { get; set; }
    public string? PaymentMethod { get; set; }
    public string? PaymentIntentId { get; set; }
    public bool IsAnonymous { get; set; }
    public string? DonorMessage { get; set; }
    public bool ReceiptSent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; }
    public Campaign Campaign { get; set; }
    public Organization Organization { get; set; }
}

public enum DonationStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
}
```

---

### 7. Messages

Communications from organizations to donors.

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('story', 'update', 'announcement')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'scheduled', 'sent')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_organization ON messages(organization_id);
CREATE INDEX idx_messages_status ON messages(status);
```

---

### 8. User Organization Links

Links donors to organizations via organization codes.

```sql
CREATE TABLE user_organization_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_user_org_links_user ON user_organization_links(user_id);
CREATE INDEX idx_user_org_links_org ON user_organization_links(organization_id);
```

---

### 9. Payment Methods (Saved Cards)

Stored payment methods for repeat donations.

```sql
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    card_brand VARCHAR(20),
    card_last_four VARCHAR(4),
    card_exp_month INT,
    card_exp_year INT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
```

---

### 10. Audit Log

Tracks who/when/what for all data changes (per guidelines).

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_record ON audit_log(record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
```

---

## Database Indexes Summary

### High-Traffic Query Indexes
| Table | Index | Purpose |
|-------|-------|---------|
| users | email | Login lookup |
| campaigns | status, dates | Active campaign queries |
| donations | user_id, created_at | User history |
| donations | organization_id | Org dashboard |
| organizations | organization_code | Code lookup |

---

## Migration Strategy

1. All schema changes via migration scripts only
2. Migrations stored in `/api/GivingApp/Migrations/`
3. Use Entity Framework Core migrations:
   ```bash
   dotnet ef migrations add MigrationName
   dotnet ef database update
   ```

---

## Data Seeding

For local development, seed data includes:
- 3 test users (1 donor, 2 org admins)
- 2 organizations
- 5 campaigns
- 10 sample donations

Seed script: `/api/GivingApp/Data/SeedData.cs`

---

## Security Considerations

1. **Passwords**: Hashed with bcrypt (cost factor 12)
2. **PII**: Never logged (emails, names, etc.)
3. **Audit**: All changes tracked in audit_log
4. **Access**: Database not publicly accessible (VPC only)
5. **Encryption**: SSL/TLS for connections
