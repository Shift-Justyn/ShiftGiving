# Environment Setup Checklist

Use this checklist to verify your local development environment is properly configured.

## Prerequisites

### Required Software

- [ ] **Docker Desktop** - For PostgreSQL database
  ```bash
  docker --version
  # Should show Docker version 20.x or higher
  ```

- [ ] **.NET 10 SDK** - For API development
  ```bash
  dotnet --version
  # Should show 10.x.x
  ```

- [ ] **Node.js** - For web development (check web/.nvmrc for version)
  ```bash
  node --version
  npm --version
  ```

- [ ] **Flutter 3.27.x** - For mobile development
  ```bash
  flutter --version
  # Should show Flutter 3.27.x
  ```

- [ ] **Dart 3.6.1+** - Included with Flutter
  ```bash
  dart --version
  # Should show Dart 3.6.1 or higher
  ```

## Local Database Setup

- [ ] **Docker is running**
  ```bash
  docker ps
  # Should connect successfully
  ```

- [ ] **Start PostgreSQL database**
  ```bash
  ./scripts/start_local_db.sh
  # Should start successfully and show "PostgreSQL is ready!"
  ```

- [ ] **Verify database connection**
  ```bash
  docker exec -it shiftgiving-postgres psql -U shiftgiving -d shiftgiving -c "\dt"
  # Should list all tables
  ```

- [ ] **Verify seed data loaded**
  ```bash
  docker exec -it shiftgiving-postgres psql -U shiftgiving -d shiftgiving -c "SELECT COUNT(*) FROM users;"
  # Should show 3 users
  ```

## Environment Variables

- [ ] **Copy .env.example to .env**
  ```bash
  cp .env.example .env
  ```

- [ ] **Update DATABASE_URL in .env**
  ```
  DATABASE_URL=postgresql://shiftgiving:shiftgiving_local_dev@localhost:5432/shiftgiving
  ```

- [ ] **Generate SESSION_SECRET**
  ```bash
  openssl rand -hex 32
  # Copy output to SESSION_SECRET in .env
  ```

## API Setup

- [ ] **Navigate to API directory**
  ```bash
  cd api/ShiftGiving
  ```

- [ ] **Restore dependencies**
  ```bash
  dotnet restore
  # Should complete without errors
  ```

- [ ] **Build the project**
  ```bash
  dotnet build
  # Should build successfully
  ```

- [ ] **Run tests**
  ```bash
  cd ../ShiftGiving.Tests
  dotnet test
  # All tests should pass
  ```

- [ ] **Start the API**
  ```bash
  cd ../ShiftGiving
  dotnet run
  # API should start on http://localhost:5237
  ```

- [ ] **Test API health endpoint** (in new terminal)
  ```bash
  curl http://localhost:5237/health
  # Should return health status
  ```

## Web Setup

- [ ] **Navigate to web directory**
  ```bash
  cd web
  ```

- [ ] **Use correct Node version**
  ```bash
  nvm use
  # Should switch to version from .nvmrc
  ```

- [ ] **Install dependencies**
  ```bash
  npm install
  # Should complete without errors
  ```

- [ ] **Run unit tests**
  ```bash
  npm test
  # All tests should pass
  ```

- [ ] **Start development server**
  ```bash
  npm start
  # Should start on http://localhost:8080
  ```

- [ ] **Open web app in browser**
  ```
  http://localhost:8080
  # Should load successfully
  ```

## Mobile Setup

- [ ] **Navigate to mobile directory**
  ```bash
  cd mobile
  ```

- [ ] **Run Flutter doctor**
  ```bash
  flutter doctor
  # Check for any issues
  ```

- [ ] **Get dependencies**
  ```bash
  flutter pub get
  # Should complete without errors
  ```

- [ ] **Run tests**
  ```bash
  flutter test
  # All tests should pass
  ```

- [ ] **Start iOS simulator or Android emulator**

- [ ] **Run the app**
  ```bash
  flutter run
  # App should launch on device/simulator
  ```

## Test Accounts

Verify you can log in with these test accounts:

- [ ] **Individual Donor**
  - Email: `donor@test.com`
  - Password: `Password123!`

- [ ] **Hope Foundation Admin**
  - Email: `admin.hope@test.com`
  - Password: `Password123!`

- [ ] **Green Earth Admin**
  - Email: `admin.green@test.com`
  - Password: `Password123!`

## Common Issues

### Docker Issues

**Problem**: `docker: command not found`
- **Solution**: Install Docker Desktop from https://www.docker.com/products/docker-desktop

**Problem**: `Cannot connect to the Docker daemon`
- **Solution**: Make sure Docker Desktop is running

**Problem**: Port 5432 is already in use
- **Solution**: Stop any existing PostgreSQL instances or change the port in docker-compose.yml

### .NET Issues

**Problem**: `dotnet: command not found`
- **Solution**: Install .NET 8 SDK via Homebrew: `brew install --cask dotnet-sdk`

**Problem**: Wrong .NET version
- **Solution**: Update to .NET 10: `brew upgrade dotnet-sdk`

### Node.js Issues

**Problem**: Wrong Node.js version
- **Solution**: Use nvm to install correct version: `nvm install && nvm use`

**Problem**: `npm install` fails
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Flutter Issues

**Problem**: `flutter: command not found`
- **Solution**: Install Flutter via Homebrew: `brew install --cask flutter`

**Problem**: Flutter doctor shows issues
- **Solution**: Follow the recommendations from `flutter doctor -v`

**Problem**: iOS build fails
- **Solution**: Make sure Xcode is installed and run `sudo xcode-select --switch /Applications/Xcode.app`

**Problem**: Android build fails
- **Solution**: Make sure Android Studio is installed and Android SDK is configured

## Next Steps

Once all items are checked:

1. Read [CLAUDE.md](../CLAUDE.md) for AI development guidelines
2. Review [DATA_MODELS.md](./DATA_MODELS.md) for database schema
3. Check [LOCAL_DATABASE_SETUP.md](./LOCAL_DATABASE_SETUP.md) for detailed database docs
4. Start developing!

## Need Help?

- Review error messages carefully - they often contain the solution
- Check the documentation in the `/docs` folder
- Review the CI/CD pipeline in `.github/workflows/build_test_deploy.yml` for examples
