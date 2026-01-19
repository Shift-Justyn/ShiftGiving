# Shift Giving

Shift Giving is a full-stack donation platform that enables users to make donations to organization campaigns.

## Current Status (January 2026)

### Web App - Completed Phases

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 | Project setup, API models, authentication | Complete |
| Phase 2 | Home screen, campaign/org cards, navigation | Complete |
| Phase 3 | Donation flow (amount, payment, confirmation) | Complete |
| Phase 4 | History screen with donation tracking | Complete |
| Phase 5 | Messages/notifications screen | Complete |

### Web App Pages

| Route | Page | Features |
|-------|------|----------|
| `/login` | LoginPage | JWT authentication |
| `/register` | RegisterPage | User registration |
| `/` | HomePage | Campaigns, orgs, animations |
| `/campaigns/:id` | CampaignDetailPage | Full campaign details |
| `/campaigns/:id/donate` | DonationPage | Amount selection ($50-$200, custom) |
| `/campaigns/:id/donate/payment` | PaymentPage | Card input, fees, recurring |
| `/donations/:id/confirmation` | DonationConfirmationPage | Receipt, share, download |
| `/history` | HistoryPage | Donation history, search, export |
| `/messages` | MessagesPage | Notifications, unread indicators |

### Working Features

| Component | Feature | Status |
|-----------|---------|--------|
| API | Health endpoint | Working |
| API | User authentication (register/login) | Working |
| API | JWT token generation | Working |
| API | Campaign/Organization listing | Working |
| API | CORS for local development | Working |
| Database | PostgreSQL with Docker | Working |
| Database | Seeded test data | Working |
| Web | All 9 pages listed above | Working |
| Web | Dark/Light mode theming | Working |
| Web | Internationalization (i18n) | Working |
| Web | Feature flags system | Working |
| Web | Framer-motion animations | Working |
| Web | Mock data service (MSW) | Working |
| Mobile | App structure | Built |
| Native (Expo) | Scaffolded with Tamagui | In Progress |

### Test Accounts

**For API/Database** (password: `Password123!`):

| Account | Email | Role |
|---------|-------|------|
| Donor | donor@test.com | Individual donor |
| Hope Foundation Admin | admin.hope@test.com | Organization admin |

**For Mock Data Service** (password: `password123`):

| Account | Email | Role |
|---------|-------|------|
| Donor | donor@example.com | Individual donor |
| Org Admin | orgadmin@example.com | Organization admin |
| Site Admin | siteadmin@example.com | Platform admin |

## Tech Stack

- **API**: .NET 10, ASP.NET Core (Minimal API)
- **Web**: React 19, Vite, TypeScript
- **Mobile**: Flutter 3.27.x+, Dart 3.6.1+
- **Infrastructure**: Terraform, AWS (ECS, S3, CloudFront, RDS)

## Prerequisites

Before you begin, ensure you have the following installed on your macOS system:

- **Homebrew**: Package manager for macOS
- **.NET 10 SDK**: For the API backend
- **Flutter 3.27.x+**: For the mobile application
- **Node.js 22**: For the web frontend (check `.nvmrc` for required version)

## Quick Setup

### Automated Installation

Run the setup script to install all required SDKs:

```bash
./scripts/setup_dev_environment.sh
```

This script will:
- Install Homebrew (if not present)
- Install .NET 10 SDK
- Install Flutter and configure it
- Verify all installations
- Provide PATH configuration instructions

After running the script:
1. Close and reopen your terminal (or run `source ~/.zshrc`)
2. Run `flutter doctor` to verify Flutter setup
3. Follow the manual setup instructions below for project dependencies

### Manual Installation

If you prefer to install components individually:

#### 1. Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install .NET 10 SDK

```bash
brew install --cask dotnet-sdk
dotnet --version  # Verify installation (should show 10.x.x)
```

#### 3. Install Flutter
```bash
brew install --cask flutter
flutter doctor  # Verify installation and check for any issues
```

#### 4. Verify Node.js
```bash
node --version  # Should match version in web/.nvmrc
npm --version
```

## Project Setup

### Local Database (PostgreSQL)

Start the local PostgreSQL database with Docker:

```bash
./scripts/start_local_db.sh
```

This starts PostgreSQL 16 with seeded test data. Connection details:
- Host: `localhost:5432`
- Database: `shiftgiving`
- Username: `shiftgiving`
- Password: `shiftgiving_local_dev`

Test accounts (all use password `Password123!`):
- Donor: `donor@test.com`
- Hope Foundation Admin: `admin.hope@test.com`
- Green Earth Admin: `admin.green@test.com`

For more details, see [docs/LOCAL_DATABASE_SETUP.md](docs/LOCAL_DATABASE_SETUP.md)

To stop the database:
```bash
./scripts/stop_local_db.sh
```

To start fresh (recreate database):
```bash
./scripts/start_local_db.sh --fresh
```

### API (.NET)

```bash
cd api/ShiftGiving
dotnet restore           # Restore dependencies
dotnet build            # Build the project
```

#### First-Time Database Setup (EF Migrations)

After starting the PostgreSQL database, run these commands to create the database schema:

```bash
cd api/ShiftGiving

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create initial migration
dotnet ef migrations add InitialCreate

# Apply migration to create database tables
dotnet ef database update
```

#### Run the API

```bash
cd api/ShiftGiving
dotnet run              # Run on http://localhost:5237
```

Verify with: `curl http://localhost:5237/health`

### Web (React)

```bash
cd web
nvm use                 # Use Node version from .nvmrc
npm install             # Install dependencies
npm start               # Run Vite dev server on http://localhost:8080
npm run dev             # Alias for npm start
npm run build           # Vite production build
npm run preview         # Preview production build
npm test                # Run Jest unit tests
npm run e2e             # Run Playwright e2e tests
```

### Mobile (Flutter)

```bash
cd mobile
flutter pub get         # Get dependencies
flutter run             # Run on connected device/simulator
flutter build ios       # Build iOS
flutter build apk       # Build Android APK
flutter test            # Run unit tests
flutter test integration_test/  # Run integration tests
```

## Verification

After installation, verify all SDKs are correctly installed:

```bash
# Check .NET
dotnet --version

# Check Flutter
flutter --version

# Check Dart (included with Flutter)
dart --version

# Check Node.js
node --version

# Check npm
npm --version
```

Expected versions:

- **.NET**: 10.x.x
- **Flutter**: 3.27.x or higher
- **Dart**: 3.6.1 or higher
- **Node.js**: 22.x.x (as specified in `web/.nvmrc`)

## Running the Application Locally

### 1. Start the API

```bash
cd api/ShiftGiving
dotnet run
```

The API will be available at `http://localhost:5237`

### 2. Start the Web Application

```bash
cd web
npm start
```

The web app will be available at `http://localhost:8080`

### 3. Start the Mobile Application

```bash
cd mobile
flutter run
```

Select your target device (iOS Simulator or Android Emulator)

## Running Tests

### API Tests

The API has comprehensive test coverage including unit tests and integration tests:

```bash
cd api/ShiftGiving.Tests
dotnet test                           # Run all tests
dotnet test --filter "Category=Unit"  # Unit tests only
dotnet test --filter "Category=Integration"  # Integration tests only
```

**Test categories:**

- Model tests (User, Campaign, Donation, Organization, Message)
- AuthService unit tests (password hashing, JWT generation)
- Auth endpoint integration tests (register, login, refresh)
- Campaign endpoint integration tests
- Organization endpoint integration tests

### Web Tests

```bash
cd web
npm test                              # Unit tests (Jest) - 18 test files
npm test -- --watchAll=false          # Run once without watch mode
npm test -- --testPathPattern=HomePage  # Run specific test file
npm run e2e                           # End-to-end tests (Playwright)
./run_tests.sh                        # Run all tests via script
```

**Jest test files (18 total):**

- API: `auth.test.ts`, `campaigns.test.ts`, `client.test.ts`, `donations.test.ts`
- Components: `CampaignCard.test.tsx`, `OrganizationCard.test.tsx`, `BottomNavigation.test.tsx`, `FeatureFlag.test.tsx`
- Context: `AuthContext.test.tsx`, `FeatureFlagsContext.test.tsx`
- Pages: `HomePage.test.tsx`, `DonationPage.test.tsx`, `PaymentPage.test.tsx`, `DonationConfirmationPage.test.tsx`, `HistoryPage.test.tsx`, `MessagesPage.test.tsx`, `PaymentPage.helpers.test.tsx`

**Playwright E2E tests include:**

- Smoke tests (homepage loads, no console errors)
- API health endpoint tests
- API campaigns endpoint tests
- API organizations endpoint tests
- API auth endpoint tests (register, login)

### Mobile Tests

```bash
cd mobile
flutter test                        # Unit tests
flutter test integration_test/      # Integration tests
```

## Test Coverage

### Web
```bash
cd web
npm test -- --coverage
```

### API
```bash
cd api/ShiftGiving.Tests
dotnet test /p:CollectCoverage=true
```

## Code Quality

### Web Linting & Formatting

ESLint and Prettier are configured for the web project:

```bash
cd web
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format code with Prettier
./run_linter.sh        # Run linter via script
```

### API Code Quality

The API follows .NET conventions with xUnit tests.

## Additional Resources

- **Design Assets**: See `/ShiftGivesFigma/` for Figma exports
- **Infrastructure**: See `/infrastructure/` for Terraform configurations
- **CI/CD**: See `.github/workflows/build_test_deploy.yml` for pipeline configuration

## Troubleshooting

### Flutter Doctor Issues

Run `flutter doctor` and follow the recommended fixes for any issues:

```bash
flutter doctor -v  # Verbose output for detailed diagnostics
```

Common issues:
- **Xcode**: Install from Mac App Store for iOS development
- **Android Studio**: Install for Android development
- **CocoaPods**: Install with `sudo gem install cocoapods`

### .NET SDK Issues

If `dotnet` command is not found after installation:
1. Close and reopen your terminal
2. Verify installation: `brew list --cask dotnet-sdk`
3. Check PATH configuration

### Node.js Version Mismatch

If you have the wrong Node.js version:
```bash
nvm install          # Install version from .nvmrc
nvm use              # Switch to correct version
```

## Contributing

1. Create a feature branch from `main`
2. Make changes and ensure all tests pass
3. Submit PR for review
4. CI/CD will automatically test and deploy to QA on merge

## Project Structure

```
/shift-giving/
├── api/                    # .NET 10 backend API
│   ├── ShiftGiving/        # Main API project
│   └── ShiftGiving.Tests/  # API unit tests
├── web/                    # React frontend (Vite)
│   ├── src/                # Source files
│   │   ├── api/            # API client and types
│   │   ├── components/     # React components
│   │   ├── config/         # Feature flags configuration
│   │   ├── context/        # React context (Auth, Theme, FeatureFlags)
│   │   ├── i18n/           # Internationalization
│   │   └── pages/          # Page components
│   └── e2eTests/           # Playwright e2e tests
├── mobile/                 # Flutter mobile app
│   ├── lib/                # Dart source files
│   └── integration_test/   # Integration tests
├── infrastructure/         # Terraform IaC
│   └── modules/            # Terraform modules
├── scripts/                # Setup and utility scripts
├── docs/                   # Project documentation
└── ShiftGivesFigma/        # Design assets
```

