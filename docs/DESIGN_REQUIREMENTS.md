# ShiftGiving Design Requirements

This document captures design requirements and insights gathered from the pitch deck, Figma exports, and historical Jira backlog. It serves as a reference for implementation.

---

## Brand Identity

### Name & Logo
- **Current Name:** Shift Giving (may be white-labeled in future)
- **Logo:** Two hearts icon (visible in Figma as the "GiveApp" branding)
- **Tagline:** "When we give, everyone is blessed"

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Teal | #00a0c4 | Headers, buttons, accents |
| Dark Navy | #1a1a2e | Text, dark backgrounds |
| Light Gray | #f5f5f5 | Backgrounds |
| White | #ffffff | Cards, content areas |
| Success Green | #22c55e | Progress bars, positive states |
| Warning Orange | #f97316 | "Closing Soon" badges |

### Typography
- Clean, modern sans-serif (system fonts)
- Headings: Bold weight
- Body: Regular weight
- Captions/Labels: Lighter gray tones

---

## Core Value Proposition

### Problems We Solve
1. **Lack of Engagement** - Money is given with little feedback or direct engagement returned to the donor
2. **Limited Functionality** - Most platforms are mobile-responsive websites that just process funds
3. **All Different Apps** - Multiple applications for multiple organizations to track
4. **High Fees** - Current platforms have high fees or require large investments, excluding smaller organizations

### Solutions We Provide
1. **Donor receipting/gift acknowledgment** - Automated thank-you and tax documentation
2. **Ongoing communications** - Impact stories drive action via push notifications
3. **Data analytics** - Insights around giving patterns
4. **Overall giving picture** - Donors see aggregate impact across all their giving

---

## Target Users

### Donors (Individual Users)
- Want simple, unified giving experience
- Track donations across multiple organizations
- See direct impact of giving
- Easy tax deduction tracking
- Discover new causes ("Netflix-like recommendations")

### Organizations (501(c)(3) Only)
- Small organizations, animal rescue, humanitarian relief
- Sports clubs, churches, community groups
- Cannot afford custom apps or high platform fees
- Need rich storytelling capabilities
- Want to drive donor engagement

### User Roles (from UNIFIED_APP_PLAN.md)
```
A. Site Admin
   - Platform-wide administration

B. Organization Roles
   ├── Org Admin
   │   └── Full organization management
   ├── Marketing Admin
   │   └── Push notifications to donors
   │   └── Cannot manage donations
   │   └── Uses content from coordinators
   └── Coordinator
       └── Upload content to media portal
       └── Field work (events, filming)

C. Donor
   - Individual donors

D. Corporate (Future - not MVP)
```

---

## Mobile App Screens (from Figma)

### 1. Splash/Onboarding
- Logo centered on teal background
- 3-step onboarding carousel:
  1. "Let's Help Each Other" - photo grid
  2. "Updates on your Giving" - impact photos
  3. "Everyone Can Help Someone" - video play button
- "Get Started" button on final slide
- Dot indicators for carousel position

### 2. Home Screen
**Header:**
- User avatar (top left)
- Search icon (top right)
- Personalized greeting: "Hello, [Name]"
- Notification count: "There are X updates in your community"

**Search:**
- Full-width search bar: "Search for a charity or nonprofit"

**Campaigns Section:**
- "Campaigns" header with "See All" link
- Horizontal scroll of campaign cards
- Each card shows:
  - Hero image
  - Campaign title
  - Goal amount badge (e.g., "$8,230")
  - Brief description (2 lines truncated)

**Organizations Section:**
- "Organizations" header with "See All" link
- Horizontal scroll of organization cards
- Each card shows:
  - Logo/hero image
  - Organization name
  - Total donation amount badge

**Bottom Tab Navigation:**
- Home (house icon, filled when active)
- Donate (handshake icon)
- History (clipboard/list icon)
- Messages (chat bubble icon)

### 3. Campaign Detail
**Header:**
- Back button
- User avatar
- Search icon

**Content:**
- Hero image/video with play button overlay
- Campaign title (large)
- Progress bar with "Closing Soon!" badge
- Goal amount (e.g., "$250,000")
- Rich text description (multiple paragraphs)
- Social share icons: Facebook, X (Twitter), Instagram, LinkedIn

**CTA:**
- Full-width "Donate" button (teal)

### 4. Organization Detail
**Header:**
- Same as campaign detail

**Tabs:**
- "Overview" / "Posts" toggle (pill-style)

**Overview Tab:**
- Organization name
- Mission statement
- Programs list:
  - Addiction Treatment
  - Afterschool & Summer Programs
  - Counseling Services
  - Crisis Stabilization
  - (etc.)

**Posts Tab:**
- Feed of organization updates/stories

### 5. Donate Flow

**Step 1: Organization Code (Optional)**
- "GiveApp Code" screen
- 4-digit code entry boxes
- "Continue" button
- "Scan QR Code" link with QR scanner icon
- Note: "If you do not have a giving code, you can continue and add one later"

**Step 2: Amount Selection**
- Organization hero image
- "How much do you want to donate?"
- Preset amounts: $50, $100, $150, $200
- "Or" divider
- Custom amount input: "Enter Here"
- "Donate" button

**Step 3: Payment**
- Payment card display (editable):
  - Card type icon (Mastercard, Visa, etc.)
  - Card number (masked)
  - Expiry date
  - CVV
- Amount display
- Payment Method label
- Transaction ID
- Checkbox: "Cover Transaction Fees" with fee amount (e.g., "$4.27")
- Checkbox: "Recurring Transaction" with frequency dropdown (Monthly)
- Checkbox: "Email Me A Receipt"
- "Pay Now" button

### 6. History Screen
**Header:**
- User avatar
- "History" title
- Add (+), Export, Print icons

**Search:**
- "Search for a charity or nonprofit"

**Donation List:**
- Card-style rows with:
  - Date (e.g., "Jan 23, 2003")
  - Organization name
  - Amount (right-aligned)
- Examples: Goodwill $100.00, Church $50.00, Girl Scouts $75.00

### 7. Messages/Notifications
**Push Notification Examples:**
- "GIVING APP - URGENT NEED! We have an urgent need in our food bank for infant formula and diapers. Tap to view this 48hr campaign."
- "GIVING APP: Your giving has helped 23 families this month. See their stories in this week's video clip, tap to view."

**In-App Messages:**
- Organization updates
- Campaign progress updates
- Thank you messages
- Impact stories

### 8. Side Menu (Hamburger)
- User name and email at top
- Menu items:
  - Profile
  - Settings
  - History
  - Current Giving
  - Organizations
  - Tax Deductions
  - Help
  - FAQ
- Log Out at bottom

### 9. Receipt Scanning (Tax Tracking)
- "Scan" header
- Camera viewfinder
- Instructions: "Scan your receipt to save to your history"
- Scan button
- Shows scanned receipt with OCR

---

## Web Admin Dashboard (SaaS) - from Figma

### Navigation (Left Sidebar)
- Logo/brand icon
- Grid/dashboard icon
- Email/messaging icon
- Chat/comments icon
- Analytics icon (bottom)
- Settings icon (bottom)

### Dashboard Overview
- "Dashboard" header with subtitle: "Control and analyse your data in the most convenient way"
- Search bar + notification bell
- Overview metrics:
  - Total Sales
  - Total Orders
  - Visitors
  - Transactions
- Reports chart (line graph showing income/expenses over time)
- Campaigns/Donations breakdown

### Campaign Management
- "Campaigns" header
- Overview section with donation cards
- Each card shows:
  - Date
  - Amount
  - Organization name
- Actions: Add (+), Export, Print

### Campaign Design/Create
- "Campaign Design" header
- Messages section with template types:
  - Welcome (Welcome Message)
  - Donation Received (Thank you for your %Amount% donation)
  - Personalized Update
- Trigger configuration:
  - Time-based
  - Variable text
  - Goal/Achievement based
  - Category targeting
- Preview and Save buttons
- Unsubscribe option

### Messaging
- "Messaging" header
- Message composer:
  - Type: Social Post dropdown
  - Media: Image selection
  - Text: Rich text area
  - Link: URL field
  - Share to Social: Facebook, X, Instagram, LinkedIn checkboxes
- Preview pane showing formatted post
- "Schedule for Later" and "Send" buttons

---

## Feature Phases (from Pitch Deck)

### MVP (Beta Users)
- Push Notifications
- On-Demand Messaging System
- User Sign Up/Delete
- Payment System
- Reporting
- Simple Campaigns
- ACH Funds To Organizations
- Thank You Emails
- Multi-Tenancy

### Full App Release
- 501(c)(3) Status Verification
- Media Library
- Apple Pay / Google Pay
- Organization Online Sign Up
- Recurring Donations
- Advanced Giving Campaigns
- Dashboard
- Taxable Donations Tracking
- User/App Uploads - Media Library

### Phase 2 (Future)
- Payroll Deduction (PEO Integration - Paylocity example)
- Advanced Billing
- Features/Analytics
- Multi-Currency Languages
- Recommendation Engine
- Gamification
- Grant Tracking
- Event/Gala Ticketing Auction

---

## Key Jira Epics (Historical Reference)

These were the original epic structure from the Jira backlog. While not prescriptive, they provide context on feature groupings:

| Epic | Key | Description |
|------|-----|-------------|
| MVP UI/UX | GIV-2 | Starting designs and mockups |
| Org Sign-up | GIV-4 | Efficient (<5 min) sign-up for 501(c)(3) orgs |
| Donor Sign-up | GIV-6 | Efficient (<2 min) sign-up for individuals |
| Accept Donation | GIV-8 | Payment processing flow |
| Campaign Admin | GIV-9 | Organization campaign management |
| Donor Giving History | GIV-11 | Track and display donation history |
| MVP Staging Environment | GIV-12 | Infrastructure setup |
| Browse Campaigns | GIV-21 | Donor campaign discovery |
| Manage Campaign | GIV-26 | Campaign CRUD operations |
| Publish Post | GIV-27 | Organization storytelling |
| Org Mgmt/Profile | GIV-139 | Organization profile management |
| User Mgmt/Profile | GIV-140 | Donor profile management |
| User Login | GIV-141 | Authentication |
| User Subscriptions | GIV-142 | Follow organizations |

### Sign-up Time Targets
- **Donor:** < 2 minutes
- **Organization:** < 5 minutes

---

## Payment Requirements

### Payment Methods (MVP)
- Credit/Debit Cards (Stripe)
- Apple Pay
- Google Pay
- PayPal

### Fee Structure
- 2.9% transaction fee
- $0.50 platform convenience fee
- Option for donor to cover fees (checkbox shown in payment flow)

### Payout Schedule
- 15-day minimum hold (chargeback protection)
- 15-30 day payout window to organizations
- ACH transfers to org bank accounts

---

## Technical Requirements (from Figma/Pitch Deck)

### Organization Code System
- 4-digit alphanumeric codes (seen: "901_")
- QR code scanning alternative
- Auto-generated when org account created
- Easy sharing via social/email

### Multi-Tenancy
- Donors can follow multiple organizations
- Single app for all charitable giving
- Organization-specific branding within platform

### Notifications
- Push notifications to device
- In-app message center
- Email notifications (receipts, updates)
- Scheduled messaging from admin dashboard

### Social Integration
- Share campaigns to: Facebook, X (Twitter), Instagram, LinkedIn
- Deep links back to app/web
- Social sharing embedded in posts

### Tax Documentation
- Receipt scanning with OCR
- Annual giving summaries
- Tax deduction tracking per organization
- Export/print capabilities

---

## Competitive Differentiators

From pitch deck "Why Increase Engagement?" statistics:
- 55% of people who engage with nonprofits on social media take action
- 59% of those people donate money
- 53% volunteer
- 43% attend/participate in charitable events due to social media
- 46.1% of churches say social media is their most effective outreach method

**Target Market Size:** 332 million people, 59% donate money

---

## Design Principles

Based on the Figma designs and pitch deck:

1. **Simplicity First** - Clean, uncluttered interfaces
2. **Impact-Focused** - Always show the donor's impact
3. **Story-Driven** - Rich media and storytelling capabilities
4. **Low Friction** - Minimal steps to complete actions
5. **Trust Signals** - Clear fee disclosure, 501(c)(3) verification
6. **Accessibility** - Large touch targets, readable fonts
7. **Responsive** - Works on mobile, tablet, and desktop

---

## Next Steps for Implementation

### Phase 2: Core Browsing (Current Focus)
1. Build Home screen matching Figma design
2. Create CampaignCard component with progress bar
3. Create OrganizationCard component
4. Implement tab navigation (Home, Donate, History, Messages)
5. Build campaign list and detail screens
6. Build organization list and detail screens
7. Add pull-to-refresh and loading states
8. Write component tests

### Phase 3: Donation Flow
1. Amount selection screen
2. Payment method selection
3. Stripe integration
4. Confirmation/receipt screen
5. Fee calculation with "cover fees" option
6. Recurring donation setup

---

*Document created: January 2026*
*Last updated: January 2026*
*Source materials: Shift Giving Pitch Deck.pdf, ShiftGivesFigma/, JIRA.csv*
