import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shift_giving/config/routes.dart';
import 'package:shift_giving/config/theme.dart';
import 'package:shift_giving/data/datasources/local/secure_storage.dart';
import 'package:shift_giving/data/datasources/remote/api_client.dart';
import 'package:shift_giving/data/repositories/campaign_repository.dart';
import 'package:shift_giving/data/repositories/organization_repository.dart';
import 'package:shift_giving/presentation/providers/auth_provider.dart';
import 'package:shift_giving/presentation/providers/campaign_provider.dart';
import 'package:shift_giving/presentation/providers/organization_provider.dart';

void main() {
  runApp(const ShiftGivingApp());
}

class ShiftGivingApp extends StatelessWidget {
  const ShiftGivingApp({super.key});

  @override
  Widget build(BuildContext context) {
    final secureStorage = SecureStorage();
    final apiClient = ApiClient(secureStorage);
    final campaignRepository = CampaignRepository(apiClient);
    final organizationRepository = OrganizationRepository(apiClient);

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(apiClient, secureStorage),
        ),
        ChangeNotifierProvider(
          create: (_) => CampaignProvider(campaignRepository),
        ),
        ChangeNotifierProvider(
          create: (_) => OrganizationProvider(organizationRepository),
        ),
      ],
      child: MaterialApp.router(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        routerConfig: router,
      ),
    );
  }
}