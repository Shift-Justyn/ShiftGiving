# CLAUDE.md - Shift Giving

This document provides context for AI assistants working on this codebase.

## Project Overview

Shift Giving is a full-stack donation platform that enables users to make donations to organization campaigns. The platform consists of:

- **Web Application**: React-based frontend
- **Mobile Application**: Flutter-based iOS and Android app
- **Backend API**: ASP.NET Core (.NET 10) minimal API
- **Infrastructure**: AWS (ECS, S3, CloudFront, RDS) managed via Terraform

## Tech Stack

| Component | Technology | Location |
|-----------|------------|----------|
| API | .NET 10, ASP.NET Core | `/api/ShiftGiving/` |
| Web | React 19, Vite, TypeScript | `/web/` |
| Mobile | Flutter 3.27.x+, Dart 3.6.1+ | `/mobile/` |
| Infrastructure | Terraform, AWS | `/infrastructure/` |
| CI/CD | GitHub Actions | `.github/workflows/` |

## Directory Structure

```
/shift-giving/
├── api/                    # .NET 10 backend API
│   ├── ShiftGiving/        # Main API project
│   └── ShiftGiving.Tests/  # API unit tests
├── web/                    # React frontend
│   ├── src/                # Source files
│   └── e2e/                # Playwright e2e tests
├── mobile/                 # Flutter mobile app
│   ├── lib/                # Dart source files
│   └── integration_test/   # Integration tests
├── infrastructure/         # Terraform IaC
│   └── modules/            # Terraform modules (vpc, ecs, s3)
└── ShiftGivesFigma/        # Design assets from Figma
```

---

## AI Development Guidelines

These standards govern all AI-assisted development on this project.

### Test-Driven Development

- Write a failing test first, run it to confirm failure
- Write minimal code to pass, run test to confirm success, then refactor
- Each test must have exactly one assertion
- Functions must be under 10 lines
- Prioritize: many unit tests > fewer integration tests > minimal acceptance tests (happy paths only)
- Tests must run in isolation and be deterministic
- All tests must pass before any commit

### Code Quality Standards

- Write self-documenting code with zero comments or docstrings
- Code should be self-explanatory through clear variable names, function names, and structure
- Functions under 10 lines, clear variable names
- Code optimized for readability over efficiency
- Follow Martin Fowler's refactoring patterns to eliminate code smells
- Match existing file formatting exactly
- Never use "improved", "new", or "enhanced" in naming
- Make smallest reasonable changes only

### Infrastructure & Architecture

- Monorepo structure
- Web: TypeScript, Jest, Playwright, styled-components, Vite
- No Redux
- Server-side rendering preferred
- Support dark/light modes, responsive design, accessibility
- Use Terraform modules, GitHub Actions, AWS ECS/S3/CloudFront
- Postgres with Docker locally, database recreated on each local start with seeded data
- Start with QA environment, support adding future environments
- Bastion host for database access with encryption key in secret manager
- Blue/green deployment for database upgrades
- Production DB: writer + read replica; Non-prod: writer only
- Use icons, no emojis without explicit permission

### Security & Data Handling

- Hash passwords
- Implement database/auth retry logic
- Use connection pooling
- No foreign key constraints
- All exceptions logged as ERROR to CloudWatch
- Support INFO, WARNING, DEBUG, TRACE log types
- Log auth successes/failures, data deletion, data downloads
- Audit table tracks who/when/what for all data changes
- No PII in logs
- Credentials in secret manager with auto-rotation
- Database not publicly accessible
- Database schema updates via migration scripts only
- Use database indexing for high-traffic queries, smart caching strategies

### Development Workflow

- Small, frequent commits with only related changes
- One-line commit messages explaining why, not what
- Tests automatically run before each commit - never use --no-verify
- Commit often as long as all tests pass
- Commits include very few files for easy review
- Never indicate AI-generated commits in messages
- Refuse to auto-push commits
- Follow tech stack code conventions
- Ask for clarification rather than assume
- Document unrelated issues instead of fixing immediately
- Real data preferred over test doubles

### AI Collaboration

- We are colleagues working together
- Push back with evidence when you disagree
- Admit when uncertain
- Never ignore system output or test failures - they contain critical information
- Ask for help when stuck
- Cover functionality with tests (except infrastructure/config)
- Failing tests must fail for correct reasons
- Keep track of quality code expectations and todo items in memory
- Do not test logging or CSS
- Test explicit exceptions
- Each project folder contains its own memory file
- Project-specific memory is kept local and added to `.gitignore`
- No cross-project information mixing

### Documentation Standards

- Comprehensive README with: local setup, dependency installation, how to run locally, how to run tests, how to determine test coverage, tech stack overview
- Include shell scripts for running linter and tests
- Support easy login as seeded user types in local environment

### Frontend Development

- Use styled-components, create CSS directly instead of dependencies
- Use rem over px
- Support responsive design (desktop/tablet/mobile), accessibility, dark/light modes
- Set up localization/internationalization (start with American English, US Dollar, US imperial)
- Save images to S3, use tiny URLs for image links
- Use ESLint with TypeScript, Prettier for formatting

### Feature Management

- Implement feature flags toggleable for non-production environments
- Use health endpoint for API
- Maintain type safety throughout codebase
- Prefer custom code over dependencies unless widely adopted by community

### Testing Framework

- Jest for JavaScript unit/integration tests
- xUnit for .NET apps
- Each test one assertion, run in isolation, deterministic
- No tests for logging or CSS
- Test explicit exceptions
- Never ignore test output

---

## Conformance Analysis

### Aligned with Guidelines

| Guideline | Status | Notes |
|-----------|--------|-------|
| Monorepo structure | Aligned | Single repo with api/, web/, mobile/, infrastructure/ |
| Jest for JS testing | Aligned | Jest 29.7.0 configured |
| Playwright for e2e | Aligned | Playwright 1.52.0 configured |
| xUnit for .NET | Aligned | xUnit in ShiftGiving.Tests |
| Terraform modules | Aligned | Modular structure in infrastructure/ |
| GitHub Actions | Aligned | CI/CD pipeline configured |
| AWS ECS/S3/CloudFront | Aligned | Terraform modules for all three |
| No Redux | Aligned | No Redux dependency found |
| Shell scripts for tests | Aligned | run_tests.sh, run_linter.sh present |

### Completed Items

| Guideline | Status | Notes |
|-----------|--------|-------|
| styled-components | Completed | Installed and used in web app |
| ESLint + Prettier | Completed | Configured in web/.eslintrc.js and .prettierrc |
| Docker Postgres locally | Completed | docker-compose.yml with start/stop scripts |
| Health endpoint | Completed | /health endpoint in API |
| Seeded test data | Completed | 3 users, 5 orgs, 8 campaigns, 15 donations (mock data) |
| Web app authentication | Completed | Login/register with JWT tokens |
| Web app home page | Completed | Campaigns and organizations display with animations |
| Web app campaign detail | Completed | Full campaign details view |
| API CORS | Completed | Configured for localhost development |
| Password hashing | Completed | BCrypt implementation |
| Pre-commit hooks | Completed | Husky with lint-staged, runs linting and tests |
| Test coverage reporting | Completed | Jest coverage with thresholds, coverlet for .NET |
| Dark/light mode | Completed | ThemeContext with localStorage persistence, system preference detection |
| Localization (i18n) | Completed | react-i18next with en-US, language detection, localStorage persistence |
| Feature flags | Completed | FeatureFlagsContext with dev tools, localStorage persistence |
| Vite bundler | Completed | Migrated from Webpack to Vite |
| Donation flow | Completed | Amount selection, payment, confirmation screens |
| History page | Completed | Donation history with search and export options |
| Messages page | Completed | Notifications with unread indicators |
| Mock data service | Completed | MSW handlers for offline development |
| Framer-motion animations | Completed | Carbon-inspired UI enhancements |

### Gaps to Address

| Guideline | Current State | Action Needed |
|-----------|---------------|---------------|
| Mobile app testing | Not tested | Test end-to-end with local API |
| Native app (Expo) | Scaffolded | Complete native donation flow |
| Stripe integration | Mock only | Add real Stripe SDK |

---

## Development Status (January 2026)

### Web App - Completed Phases

| Phase | Status | Features |
|-------|--------|----------|
| Phase 1 | Complete | Project setup, API models, authentication |
| Phase 2 | Complete | Home screen, campaign/org cards, tab navigation |
| Phase 3 | Complete | Donation flow (amount, payment, confirmation) |
| Phase 4 | Complete | History screen with donation tracking |
| Phase 5 | Complete | Messages/notifications screen |

### Web App Pages

| Route | Page | Status |
|-------|------|--------|
| `/login` | LoginPage | Complete |
| `/register` | RegisterPage | Complete |
| `/` | HomePage | Complete (with animations) |
| `/campaigns/:id` | CampaignDetailPage | Complete |
| `/campaigns/:id/donate` | DonationPage | Complete |
| `/campaigns/:id/donate/payment` | PaymentPage | Complete |
| `/donations/:id/confirmation` | DonationConfirmationPage | Complete |
| `/history` | HistoryPage | Complete |
| `/messages` | MessagesPage | Complete |

### Test Files (18 total)

```
src/api/auth.test.ts
src/api/campaigns.test.ts
src/api/client.test.ts
src/api/donations.test.ts
src/components/campaigns/CampaignCard.test.tsx
src/components/navigation/BottomNavigation.test.tsx
src/components/organizations/OrganizationCard.test.tsx
src/components/FeatureFlag.test.tsx
src/context/AuthContext.test.tsx
src/context/FeatureFlagsContext.test.tsx
src/pages/__tests__/DonationConfirmationPage.test.tsx
src/pages/__tests__/DonationPage.test.tsx
src/pages/__tests__/HistoryPage.test.tsx
src/pages/__tests__/HomePage.test.tsx
src/pages/__tests__/MessagesPage.test.tsx
src/pages/__tests__/PaymentPage.test.tsx
src/pages/__tests__/PaymentPage.helpers.test.tsx
src/example.test.ts
```

### Mock Data Service

The web app includes MSW (Mock Service Worker) for offline development:
- Location: `web/src/mocks/`
- Test users: donor@example.com, orgadmin@example.com, siteadmin@example.com
- Password: password123 (all users)
- Automatically enabled in development mode

### Next Steps

1. **Native App (Expo)**: Complete donation flow in mobile app
2. **Stripe Integration**: Replace mock payment with real Stripe SDK
3. **API Integration**: Connect web app to live .NET API
4. **E2E Tests**: Add Playwright tests for critical user flows

---

## Development Commands

### API (.NET)
```bash
cd api/ShiftGiving
dotnet restore           # Restore dependencies
dotnet build            # Build the project
dotnet run              # Run on http://localhost:5237
dotnet test             # Run unit tests
```

### Web (React)
```bash
cd web
nvm use                 # Use Node version from .nvmrc
npm install             # Install dependencies
npm start               # Run Vite dev server on http://localhost:8080
npm run dev             # Alias for npm start
npm run build           # Vite production build
npm run preview         # Preview production build
npm test                # Run Jest unit tests with coverage
npm run test:coverage   # Run tests with full coverage report
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

### Infrastructure (Terraform)
```bash
cd infrastructure
terraform init          # Initialize Terraform
terraform plan          # Preview changes
terraform apply         # Apply changes
```

## AWS Deployment Architecture

- **Compute**: ECS Fargate for API containers
- **Database**: RDS (PostgreSQL) - existing instance
- **Web Hosting**: S3 + CloudFront for static web app
- **Container Registry**: ECR for Docker images
- **Networking**: VPC with public/private subnets

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/build_test_deploy.yml`) runs:

1. Build & test API (.NET)
2. Build & test Web (React + Playwright)
3. Build & test Mobile iOS (Flutter + iOS Simulator)
4. Build & test Mobile Android (Flutter + Android Emulator)
5. Build & push Docker image to ECR
6. Deploy API to ECS (QA environment)
7. Deploy Web to S3/CloudFront (QA environment)

## Design Assets

Figma exports are stored in `/ShiftGivesFigma/` including:
- Homepage designs
- Campaign Dashboard screens
- Donation flows
- Payment screens
- SaaS Dashboard mockups
- Mobile splash screens

## Key Configuration Files

- `/api/ShiftGiving/appsettings.json` - API configuration
- `/web/vite.config.ts` - Vite bundler config
- `/mobile/pubspec.yaml` - Flutter dependencies
- `/infrastructure/main.tf` - Terraform main config
- `/.github/workflows/build_test_deploy.yml` - CI/CD pipeline

## Contributing

1. Create a feature branch from `main`
2. Make changes and ensure all tests pass
3. Submit PR for review
4. CI/CD will automatically test and deploy to QA on merge

## Previous Development

This project was originally developed by Travis. Justin Miller is now the owner and maintainer.

---

## Authentication & Deployment Configuration

### GitHub

- **Account**: Shift-Justyn
- **Repository**: ShiftGiving (to be created)
- **Protocol**: HTTPS
- **Scopes**: gist, read:org, repo, workflow

### Git Configuration

```bash
git config --global user.name "Justin Miller"
git config --global user.email "justyn@justyn.com"
```

### AWS Configuration

- **Region**: us-east-1
- **Account**: 338977415134
- **IAM User**: amplify-admin
- **CLI Profile**: default

### AWS Services Used

- **App Runner**: API deployment (alternative to ECS)
- **RDS**: PostgreSQL database (existing instance with VPC)
- **ECS Fargate**: Container orchestration
- **ECR**: Container registry
- **S3**: Static web hosting
- **CloudFront**: CDN for web app
- **Secrets Manager**: Credentials with auto-rotation
- **CloudWatch**: Logging and monitoring

### Environment Variables

#### API (.env)

```bash
# Database (Required)
DATABASE_URL=postgresql://user:password@host:5432/shiftgiving?sslmode=require

# Session (Required)
SESSION_SECRET=<generate with: openssl rand -hex 32>

# Environment
NODE_ENV=development
PORT=5237
```

#### App Runner Configuration (apprunner.yaml)

```yaml
version: 1.0
runtime: dotnet8
build:
  commands:
    build:
      - dotnet publish -c Release -o out
run:
  command: dotnet out/ShiftGiving.dll
  network:
    port: 80
  env:
    - name: ASPNETCORE_URLS
      value: "http://+:80"
```

### Deployment Verification

```bash
# Check AWS identity
aws sts get-caller-identity

# Check GitHub auth
gh auth status

# Health check (after deployment)
curl -s https://shiftgiving.justyn.app/health | jq .
```

### GitHub Actions Secrets Required

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DATABASE_URL`
- `SESSION_SECRET`

---

## Multi-Agent Execution Rules

### Agent Compaction Bug Prevention

When multiple agents run simultaneously and auto-compact is triggered, agents may fail to complete their tasks.

### Rules for Multi-Agent Execution

1. Before spawning agents, check current context usage:
   - Above 60%: Limit to 1-2 agents maximum
   - Above 70%: Run agents sequentially, not in parallel
   - Above 80%: Run `/compact` BEFORE spawning any agents

2. Agent spawn limits:
   - Maximum 3-4 agents at once ONLY when context is below 50%
   - Each agent should be scoped to complete within reasonable time

3. Model selection for parallel agents:
   - Use `haiku` for quick, straightforward tasks
   - Use `sonnet` for moderate complexity
   - Use `opus` only for critical, complex tasks

4. Post-agent completion protocol:
   - Check token usage after agents finish
   - If approaching 70%: Save work and run `/compact` before continuing
