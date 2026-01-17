# Figma Design Analysis - ShiftGiving

This document catalogs all screens from the Figma design exports and maps them to implementation requirements.

## Application Overview

ShiftGiving (also branded as "GiveApp") is a dual-platform charitable giving application:
- **Mobile App**: For individual donors to discover campaigns, donate, and track history
- **Web Dashboard**: For nonprofit organizations to manage campaigns and view analytics

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Teal | #00A0C4 | Primary buttons, accents, links |
| Orange | #F97316 | CTAs, notifications, alerts |
| Pink/Magenta | #EC4899 | Accent highlights |
| Gray | #878787 | Borders, secondary text |
| White | #FFFFFF | Backgrounds |
| Black | #000000 | Primary text |

### Typography
- **Font Family**: Montserrat
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)

### Icons
- Heart logo for branding
- Standard material/system icons for navigation

---

## Mobile App Screens (Donor Experience)

### 1. Splash Screen
**File**: `Splash.png`, `Splash-1.png`, `Shift Giving Splash.png`

**Purpose**: Initial app launch branding

**Components**:
- Full-screen teal/blue gradient background
- Heart logo centered
- App name "ShiftGiving" or "GiveApp"

**Implementation Notes**:
- 3-second delay before navigation
- Already implemented in Flutter (`splash_screen.dart`)

---

### 2. Sign Up / Registration
**File**: `Donation Detail.png` (shows registration form)

**Purpose**: New user account creation

**Components**:
- Form fields:
  - First Name (text input)
  - Last Name (text input)
  - Email Address (email input)
  - Password (password input)
  - Date of Birth (date picker)
- "Sign Up" button (teal, full-width)
- "Already Have An Account?" link

**Data Requirements**:
```
User {
  firstName: string
  lastName: string
  email: string
  password: string (hashed)
  dateOfBirth: date
  userType: 'individual' | 'organization'
}
```

**Validation Rules**:
- Email must be valid format
- Password minimum 8 characters
- Date of birth must be 18+ years ago

---

### 3. Homepage / Role Selection
**File**: `Homepage.jpg`, `Homepage-1.jpg` through `Homepage-5.jpg`

**Purpose**: Initial landing for signup flow, role selection

**Components**:
- Toggle: "Join as an Individual" | "Join as a Charity"
- Email input field
- "Continue" button
- "Login" link for existing users

**User Flow**:
```
Homepage → Select Role → Email Entry → Continue → Registration Form
```

---

### 4. Organization Code Entry
**File**: `Organization Code.png`, `Organization Code-1.png`

**Purpose**: Link donor to specific organization via code

**Components**:
- Four-digit code input (4 separate fields)
- "Continue" button
- "Scan QR Code" option
- Helper text: "If you do not have a giving code, you can continue and add one later"

**Implementation Notes**:
- QR code scanning requires camera permission
- Code validation against organization database
- Optional step - can be skipped

---

### 5. Home Screen (Donor Dashboard)
**File**: `Home.png`

**Purpose**: Main hub for donor activity

**Components**:
- Header:
  - User avatar (top left)
  - Greeting: "Hello, [Name]"
- Search bar: "Search for a charity or nonprofit"
- Campaigns Section:
  - "Campaigns" header with "See All" link
  - Horizontal scrolling campaign cards
- Organizations Section:
  - "Organizations" header with "See All" link
  - Horizontal scrolling organization cards
- Bottom Navigation (5 tabs):
  1. Home (house icon) - active
  2. Donate (handshake icon)
  3. History (list icon)
  4. Messages (chat icon)
  5. Profile/Settings

**Campaign Card**:
```
- Campaign image (thumbnail)
- Campaign title
- Goal amount
- Description excerpt (2 lines max)
```

**Organization Card**:
```
- Organization logo
- Organization name
- Description excerpt (2 lines max)
```

**Implementation Notes**:
- Partially implemented in Flutter (`home_page.dart`)
- Currently uses hardcoded data
- Needs API integration

---

### 6. Campaigns List (See All)
**File**: `See all campaigns.png`

**Purpose**: Browse all available campaigns

**Components**:
- "Campaigns" header with back navigation
- Vertical scrolling list of campaign cards
- Each card shows: image, title, description

**Example Campaigns from Design**:
- Sponsor a Family in Need
- Youth Mentoring
- YSS Des Moines
- Fellowship of Christian Athletes
- American Forests
- American Foundation for Suicide Prevention

---

### 7. Organizations List (See All)
**File**: `See all organizations.png`

**Purpose**: Browse all nonprofit organizations

**Components**:
- "Organizations" header
- Vertical scrolling list of organization cards
- Each card: logo, name, description

**Example Organizations from Design**:
- The YMCA
- United Way
- Red Cross
- Greenpeace
- Habitat for Humanity
- American Cancer Society

---

### 8. Campaign Detail
**File**: `Campaign Detail.png`

**Purpose**: Full campaign information and donation entry point

**Components**:
- Header image (with video play button if video)
- Campaign title: "Build a New Computer Lab"
- Status badge: "Closing Soon" (orange)
- Goal amount: "$250,000"
- Progress bar (visual fill)
- Campaign description/story
- Beneficiary quote with context
- Social sharing buttons:
  - Facebook
  - X (Twitter)
  - Instagram
  - LinkedIn
- "Donate" button (teal, full-width, bottom fixed)

**Data Requirements**:
```
Campaign {
  id: uuid
  title: string
  description: text
  goalAmount: decimal
  raisedAmount: decimal
  status: 'active' | 'closing_soon' | 'completed'
  startDate: date
  endDate: date
  images: string[]
  videoUrl: string?
  organizationId: uuid
  socialLinks: {
    facebook: string?
    twitter: string?
    instagram: string?
    linkedin: string?
  }
}
```

---

### 9. Donate Screen (Pre-Payment)
**File**: `Donate.png`, `Donate-1.png`

**Purpose**: Campaign overview before payment

**Components**:
- Campaign header image
- Tab navigation: "Overview" | "Posts"
- Campaign title, status, goal
- Program descriptions:
  - Addiction Treatment
  - Afterschool & Summer Programs
  - Counseling Services
  - Crisis Stabilization
- Bottom navigation visible

---

### 10. Payment Screen
**File**: `Payment.png`, `Payment-1.png` through `Payment-5.png`

**Purpose**: Complete donation payment

**Components**:
- Amount display: "$100.00"
- "Save Payment Info" checkbox
- Payment form (card details)
- "Donate" confirmation button
- Transaction summary

**Payment Integration**:
- Stripe recommended
- Save card for future donations (optional)
- PCI compliance required

---

### 11. History Screen
**File**: `History.png`

**Purpose**: View donation history

**Components**:
- Header with user avatar
- "History" title
- Search icon
- List of past donations:
  - Date
  - Organization/charity name
  - Amount donated
- Action buttons:
  - Add (+)
  - Export
  - Calendar view filter

**Data Requirements**:
```
Donation {
  id: uuid
  userId: uuid
  campaignId: uuid
  organizationId: uuid
  amount: decimal
  date: timestamp
  status: 'completed' | 'pending' | 'failed'
  paymentMethod: string
}
```

---

### 12. Messaging Screen
**File**: `Messaging Detail.png`

**Purpose**: Communication with organizations

**Components**:
- "Messages" tab header
- Message thread list
- Message preview text
- Unread indicators
- Timestamp

---

## Web Dashboard Screens (Organization Experience)

### 13. SaaS Dashboard - Overview
**File**: `SaaS Dashboard.png`, `SaaS Dashboard-1.png` through `SaaS Dashboard-9.png`

**Purpose**: Main organizational control center

**Layout**:
- Left Sidebar Navigation:
  1. Heart logo (home)
  2. Grid icon (Campaigns)
  3. Message icon (Messaging)
  4. Chat icon (Stories)
  5. Settings (gear)
  6. Profile (bottom)

**Main Content**:
- "Campaigns" header
- Search bar
- Notification bell (orange indicator)
- Metrics Cards (Overview):
  | Metric | Example Value | Change |
  |--------|---------------|--------|
  | Total Sales | $513,068.98 | +12% |
  | Total Orders | 569,230 | +18% |
  | Visitors | 350,745 | -2% |
  | Transactions | 133,753 | -2% |
- Reports Section:
  - Line chart: Income vs Expenses over time
- Programs Section:
  - Pie/donut chart showing allocation:
    - Ocean Stabilization: 15%
    - Emissions Reduction: 7%
    - Clean Energy (Solar): 2%

---

### 14. Campaign Dashboard
**File**: `Campaign Dashboard.png`, `Campaign Dashboard-1.png` through `Campaign Dashboard-7.png`

**Purpose**: View and manage campaigns

**Components**:
- Campaign list/grid view
- Campaign cards with:
  - Title
  - Status
  - Goal amount
  - Progress
- Create new campaign button
- Filter/sort options

---

### 15. Donations Table
**File**: `Shift Giving Dashboard.png`, `Shift Giving Dashboard-1.png`, `Shift Giving Dashboard-2.png`

**Purpose**: View all donations for organization

**Components**:
- "Donations" section header
- Table columns:
  | Column | Type |
  |--------|------|
  | FIRST NAME | string |
  | LAST NAME | string |
  | DATE | date |
  | EMAIL | string |
  | AMOUNT | currency |
  | ACTION | button (View) |
- Search functionality
- Export/print options

---

### 16. Edit Campaign
**File**: `Create/Edit Campaign.png`, `Create/Edit Campaign-1.png` through `Create/Edit Campaign-3.png`

**Purpose**: Create or modify campaign details

**Components**:
- Form fields:
  - Title (text input)
  - Description (rich text editor with emoji support)
  - Beneficiary (text + image upload)
  - Giving Goal (number + image upload)
  - Start Date (date picker)
  - End Date (date picker)
- Save/Publish buttons
- Cancel option

---

### 17. Messaging / Stories Management
**File**: Part of SaaS Dashboard views

**Purpose**: Manage donor communications

**Components**:
- "Stories" header
- Message list
- Trigger settings (Scheduled/Immediate)
- Status indicators (Draft/Sent/Scheduled)
- Story preview with image
- Edit functionality

---

## User Flows

### Donor Registration Flow
```
Splash → Homepage → Select "Individual" → Enter Email → Registration Form →
Organization Code (optional) → Home Screen
```

### Donation Flow
```
Home → Browse Campaigns → Campaign Detail → Donate →
Enter Amount → Payment → Confirmation → History
```

### Organization Setup Flow
```
Splash → Homepage → Select "Charity" → Enter Email → Registration Form →
Organization Verification → Dashboard
```

### Campaign Creation Flow
```
Dashboard → Campaigns → New Campaign → Edit Form →
Set Goal/Dates → Add Media → Publish → View Live
```

---

## Implementation Priority

### Phase 1 - MVP (Mobile)
1. Authentication (Sign up/Login)
2. Home Screen with real data
3. Campaign List & Detail
4. Basic Donation Flow
5. History

### Phase 2 - MVP (Web)
1. Organization Login
2. Dashboard Overview
3. Campaign Management
4. Donations Table

### Phase 3 - Enhanced Features
1. Payment Processing (Stripe)
2. Messaging System
3. QR Code Scanning
4. Social Sharing
5. Analytics Charts

---

## File Reference

| Design File | Screen | Platform |
|-------------|--------|----------|
| Splash.png | Splash Screen | Mobile |
| Home.png | Home Dashboard | Mobile |
| Campaign Detail.png | Campaign Detail | Mobile |
| Donate.png | Donation Entry | Mobile |
| Payment.png | Payment | Mobile |
| History.png | Donation History | Mobile |
| Organization Code.png | Org Code Entry | Mobile |
| Messaging Detail.png | Messages | Mobile |
| See all campaigns.png | Campaign List | Mobile |
| See all organizations.png | Org List | Mobile |
| Homepage.jpg | Landing/Signup | Web |
| SaaS Dashboard.png | Org Dashboard | Web |
| Campaign Dashboard.png | Campaign Mgmt | Web |
| Shift Giving Dashboard.png | Donations Table | Web |
| Create/Edit Campaign.png | Campaign Editor | Web |
