import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:shift_giving/presentation/providers/auth_provider.dart';
import 'package:shift_giving/presentation/screens/auth/login_screen.dart';
import 'package:shift_giving/presentation/screens/auth/register_screen.dart';
import 'package:shift_giving/splash_screen.dart';
import 'package:shift_giving/presentation/screens/home/home_screen.dart';
import 'package:shift_giving/presentation/screens/campaign/campaign_detail_screen.dart';

String? _handleRedirect(BuildContext context, GoRouterState state) {
  final authProvider = context.read<AuthProvider>();
  final isAuthenticated = authProvider.isAuthenticated;
  final location = state.matchedLocation;
  return _determineRedirect(isAuthenticated, location);
}

String? _determineRedirect(bool isAuthenticated, String location) {
  if (location == '/splash') return null;
  if (_shouldRedirectToLogin(isAuthenticated, location)) return '/auth/login';
  if (_shouldRedirectToHome(isAuthenticated, location)) return '/home';
  return null;
}

bool _shouldRedirectToLogin(bool isAuthenticated, String location) {
  return !isAuthenticated && !location.startsWith('/auth');
}

bool _shouldRedirectToHome(bool isAuthenticated, String location) {
  return isAuthenticated && location.startsWith('/auth');
}

final router = GoRouter(
  initialLocation: '/splash',
  redirect: _handleRedirect,
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
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/campaign/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return CampaignDetailScreen(campaignId: id);
      },
    ),
  ],
);
