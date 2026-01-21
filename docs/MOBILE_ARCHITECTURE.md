# Mobile Architecture - GivingApp Flutter App

This document defines the architecture and implementation plan for the Flutter mobile application.

## Current State

### What's Implemented
- `main.dart` - App entry point with MaterialApp
- `splash_screen.dart` - Splash screen with 3-second delay
- `home_page.dart` - Basic UI with hardcoded campaign/org lists
- Montserrat font family configured
- Basic integration tests

### What's Missing
- Navigation system
- State management
- API integration
- Models/serialization
- Authentication
- All other screens from Figma

---

## Target Architecture

### Project Structure

```
mobile/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── app.dart                     # App configuration
│   │
│   ├── config/
│   │   ├── app_config.dart          # Environment config
│   │   ├── routes.dart              # Route definitions
│   │   └── theme.dart               # Theme configuration
│   │
│   ├── core/
│   │   ├── constants/
│   │   │   ├── api_constants.dart   # API URLs
│   │   │   └── app_constants.dart   # App-wide constants
│   │   ├── errors/
│   │   │   ├── exceptions.dart      # Custom exceptions
│   │   │   └── failures.dart        # Failure classes
│   │   └── utils/
│   │       ├── validators.dart      # Input validation
│   │       └── formatters.dart      # Data formatters
│   │
│   ├── data/
│   │   ├── datasources/
│   │   │   ├── remote/
│   │   │   │   ├── api_client.dart  # HTTP client
│   │   │   │   ├── auth_api.dart    # Auth endpoints
│   │   │   │   ├── campaign_api.dart
│   │   │   │   ├── donation_api.dart
│   │   │   │   └── organization_api.dart
│   │   │   └── local/
│   │   │       ├── secure_storage.dart
│   │   │       └── preferences.dart
│   │   │
│   │   ├── models/
│   │   │   ├── user_model.dart
│   │   │   ├── campaign_model.dart
│   │   │   ├── organization_model.dart
│   │   │   ├── donation_model.dart
│   │   │   └── api_response.dart
│   │   │
│   │   └── repositories/
│   │       ├── auth_repository.dart
│   │       ├── campaign_repository.dart
│   │       ├── donation_repository.dart
│   │       └── organization_repository.dart
│   │
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── user.dart
│   │   │   ├── campaign.dart
│   │   │   ├── organization.dart
│   │   │   └── donation.dart
│   │   │
│   │   └── usecases/
│   │       ├── auth/
│   │       │   ├── login.dart
│   │       │   ├── register.dart
│   │       │   └── logout.dart
│   │       ├── campaigns/
│   │       │   ├── get_campaigns.dart
│   │       │   └── get_campaign_detail.dart
│   │       └── donations/
│   │           ├── create_donation.dart
│   │           └── get_donation_history.dart
│   │
│   ├── presentation/
│   │   ├── providers/
│   │   │   ├── auth_provider.dart
│   │   │   ├── campaigns_provider.dart
│   │   │   ├── donations_provider.dart
│   │   │   └── organizations_provider.dart
│   │   │
│   │   ├── screens/
│   │   │   ├── splash/
│   │   │   │   └── splash_screen.dart
│   │   │   ├── auth/
│   │   │   │   ├── login_screen.dart
│   │   │   │   ├── register_screen.dart
│   │   │   │   └── org_code_screen.dart
│   │   │   ├── home/
│   │   │   │   └── home_screen.dart
│   │   │   ├── campaigns/
│   │   │   │   ├── campaigns_list_screen.dart
│   │   │   │   └── campaign_detail_screen.dart
│   │   │   ├── organizations/
│   │   │   │   ├── organizations_list_screen.dart
│   │   │   │   └── organization_detail_screen.dart
│   │   │   ├── donate/
│   │   │   │   ├── donate_screen.dart
│   │   │   │   └── payment_screen.dart
│   │   │   ├── history/
│   │   │   │   └── history_screen.dart
│   │   │   ├── messages/
│   │   │   │   └── messages_screen.dart
│   │   │   └── profile/
│   │   │       └── profile_screen.dart
│   │   │
│   │   └── widgets/
│   │       ├── common/
│   │       │   ├── app_button.dart
│   │       │   ├── app_text_field.dart
│   │       │   ├── loading_indicator.dart
│   │       │   └── error_widget.dart
│   │       ├── cards/
│   │       │   ├── campaign_card.dart
│   │       │   └── organization_card.dart
│   │       └── navigation/
│   │           └── bottom_nav_bar.dart
│   │
│   └── services/
│       ├── navigation_service.dart
│       └── payment_service.dart
│
├── test/
│   ├── unit/
│   ├── widget/
│   └── integration/
│
└── assets/
    ├── images/
    └── fonts/
```

---

## Dependencies

### Add to pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8

  # State Management
  provider: ^6.1.1

  # Navigation
  go_router: ^13.0.0

  # HTTP Client
  dio: ^5.4.0

  # JSON Serialization
  json_annotation: ^4.8.1

  # Secure Storage
  flutter_secure_storage: ^9.0.0

  # Local Storage
  shared_preferences: ^2.2.2

  # Payment
  flutter_stripe: ^10.1.1

  # Image Loading
  cached_network_image: ^3.3.1

  # QR Code Scanner
  mobile_scanner: ^4.0.0

  # Date/Time
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  flutter_lints: ^5.0.0
  mockito: ^5.4.2
  build_runner: ^2.4.6
  json_serializable: ^6.7.1
```

---

## State Management

Using Provider for simplicity and flutter team support.

### Auth Provider

```dart
class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get error => _error;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _authRepository.login(email, password);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _authRepository.logout();
    _user = null;
    notifyListeners();
  }
}
```

### Campaigns Provider

```dart
class CampaignsProvider extends ChangeNotifier {
  List<Campaign> _campaigns = [];
  Campaign? _selectedCampaign;
  bool _isLoading = false;

  List<Campaign> get campaigns => _campaigns;
  Campaign? get selectedCampaign => _selectedCampaign;
  bool get isLoading => _isLoading;

  Future<void> fetchCampaigns({String? status}) async {
    _isLoading = true;
    notifyListeners();

    _campaigns = await _campaignRepository.getCampaigns(status: status);

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchCampaignDetail(String id) async {
    _isLoading = true;
    notifyListeners();

    _selectedCampaign = await _campaignRepository.getCampaign(id);

    _isLoading = false;
    notifyListeners();
  }
}
```

---

## Navigation

Using go_router for declarative routing.

### Route Configuration

```dart
final router = GoRouter(
  initialLocation: '/splash',
  redirect: (context, state) {
    final isAuthenticated = context.read<AuthProvider>().isAuthenticated;
    final isAuthRoute = state.matchedLocation.startsWith('/auth');
    final isSplash = state.matchedLocation == '/splash';

    if (isSplash) return null;
    if (!isAuthenticated && !isAuthRoute) return '/auth/login';
    if (isAuthenticated && isAuthRoute) return '/home';
    return null;
  },
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/auth/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/auth/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/auth/org-code',
      builder: (context, state) => const OrgCodeScreen(),
    ),
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(
          path: '/home',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/donate',
          builder: (context, state) => const DonateScreen(),
        ),
        GoRoute(
          path: '/history',
          builder: (context, state) => const HistoryScreen(),
        ),
        GoRoute(
          path: '/messages',
          builder: (context, state) => const MessagesScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    ),
    GoRoute(
      path: '/campaigns',
      builder: (context, state) => const CampaignsListScreen(),
    ),
    GoRoute(
      path: '/campaigns/:id',
      builder: (context, state) => CampaignDetailScreen(
        campaignId: state.pathParameters['id']!,
      ),
    ),
    GoRoute(
      path: '/organizations',
      builder: (context, state) => const OrganizationsListScreen(),
    ),
    GoRoute(
      path: '/payment/:campaignId',
      builder: (context, state) => PaymentScreen(
        campaignId: state.pathParameters['campaignId']!,
      ),
    ),
  ],
);
```

---

## API Client

### Dio Configuration

```dart
class ApiClient {
  late final Dio _dio;
  final SecureStorage _storage;

  ApiClient(this._storage) {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Try refresh token
          final refreshed = await _refreshToken();
          if (refreshed) {
            return handler.resolve(await _retry(error.requestOptions));
          }
        }
        return handler.next(error);
      },
    ));
  }

  Future<Response<T>> get<T>(String path, {Map<String, dynamic>? queryParams}) {
    return _dio.get<T>(path, queryParameters: queryParams);
  }

  Future<Response<T>> post<T>(String path, {dynamic data}) {
    return _dio.post<T>(path, data: data);
  }

  Future<Response<T>> put<T>(String path, {dynamic data}) {
    return _dio.put<T>(path, data: data);
  }

  Future<Response<T>> delete<T>(String path) {
    return _dio.delete<T>(path);
  }
}
```

---

## Models

### Campaign Model

```dart
import 'package:json_annotation/json_annotation.dart';

part 'campaign_model.g.dart';

@JsonSerializable()
class CampaignModel {
  final String id;
  final String title;
  final String? description;
  final String? shortDescription;
  final double goalAmount;
  final double raisedAmount;
  final String status;
  final String? featuredImageUrl;
  final String? videoUrl;
  final DateTime startDate;
  final DateTime endDate;
  final OrganizationModel organization;

  CampaignModel({
    required this.id,
    required this.title,
    this.description,
    this.shortDescription,
    required this.goalAmount,
    required this.raisedAmount,
    required this.status,
    this.featuredImageUrl,
    this.videoUrl,
    required this.startDate,
    required this.endDate,
    required this.organization,
  });

  factory CampaignModel.fromJson(Map<String, dynamic> json) =>
      _$CampaignModelFromJson(json);

  Map<String, dynamic> toJson() => _$CampaignModelToJson(this);

  double get progressPercentage =>
      goalAmount > 0 ? (raisedAmount / goalAmount * 100).clamp(0, 100) : 0;

  bool get isClosingSoon => status == 'closing_soon';
}
```

---

## Theme Configuration

```dart
class AppTheme {
  static const primaryColor = Color(0xFF00A0C4);
  static const secondaryColor = Color(0xFFF97316);
  static const errorColor = Color(0xFFDC2626);
  static const backgroundColor = Color(0xFFFFFFFF);
  static const surfaceColor = Color(0xFFF5F5F5);
  static const textPrimary = Color(0xFF000000);
  static const textSecondary = Color(0xFF878787);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    fontFamily: 'Montserrat',
    colorScheme: ColorScheme.light(
      primary: primaryColor,
      secondary: secondaryColor,
      error: errorColor,
      background: backgroundColor,
      surface: surfaceColor,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: backgroundColor,
      foregroundColor: textPrimary,
      elevation: 0,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        minimumSize: const Size(double.infinity, 48),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: textSecondary),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: primaryColor, width: 2),
      ),
    ),
  );
}
```

---

## Screen Implementation Priority

### Phase 1: Core Flow
1. Splash Screen (refactor existing)
2. Login Screen
3. Register Screen
4. Home Screen (refactor existing)
5. Campaign Detail Screen
6. Basic Navigation Shell

### Phase 2: Donation Flow
1. Payment Screen
2. Donation Confirmation
3. History Screen

### Phase 3: Additional Features
1. Organization Code Entry
2. Organizations List
3. Messages Screen
4. Profile Screen
5. QR Code Scanner

---

## Testing Strategy

### Unit Tests
- Providers (state management)
- Repositories (data layer)
- Use cases (business logic)
- Validators and formatters

### Widget Tests
- Individual screens
- Reusable widgets
- Navigation flows

### Integration Tests
- Full user flows
- API integration (mocked)
- Payment flow

### Test Commands
```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test/

# Coverage
flutter test --coverage
```

---

## Build & Deploy

### Development
```bash
flutter run
```

### Build for Testing
```bash
# iOS
flutter build ios --no-codesign

# Android
flutter build apk --split-per-abi
```

### Production Build
```bash
# iOS
flutter build ipa

# Android
flutter build appbundle
```
