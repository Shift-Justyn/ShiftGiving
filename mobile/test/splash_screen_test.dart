import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shift_giving/splash_screen.dart';
import 'package:shift_giving/presentation/providers/campaign_provider.dart';
import 'package:shift_giving/presentation/providers/organization_provider.dart';
import 'package:shift_giving/domain/entities/campaign.dart';
import 'package:shift_giving/domain/entities/organization.dart';
import 'package:shift_giving/domain/repositories/campaign_repository.dart';
import 'package:shift_giving/domain/repositories/organization_repository.dart';

class TestCampaignRepository implements CampaignRepository {
  @override
  Future<List<Campaign>> getCampaigns() async => [];

  @override
  Future<List<Campaign>> getFeaturedCampaigns() async => [];

  @override
  Future<Campaign?> getCampaignById(String id) async => null;
}

class TestOrganizationRepository implements OrganizationRepository {
  @override
  Future<List<Organization>> getOrganizations() async => [];

  @override
  Future<Organization?> getOrganizationById(String id) async => null;
}

void main() {
  testWidgets('SplashScreen displays splash image', (WidgetTester tester) async {
    await tester.binding.setSurfaceSize(const Size(360, 640));

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (_) => CampaignProvider(TestCampaignRepository()),
          ),
          ChangeNotifierProvider(
            create: (_) => OrganizationProvider(TestOrganizationRepository()),
          ),
        ],
        child: const MaterialApp(home: SplashScreen()),
      ),
    );

    expect(find.byType(SplashScreen), findsOneWidget);
  });

  testWidgets('SplashScreen shows Image widget', (WidgetTester tester) async {
    await tester.binding.setSurfaceSize(const Size(360, 640));

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (_) => CampaignProvider(TestCampaignRepository()),
          ),
          ChangeNotifierProvider(
            create: (_) => OrganizationProvider(TestOrganizationRepository()),
          ),
        ],
        child: const MaterialApp(home: SplashScreen()),
      ),
    );

    expect(find.byType(Image), findsOneWidget);
  });
}
