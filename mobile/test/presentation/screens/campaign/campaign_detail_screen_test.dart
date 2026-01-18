import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shift_giving/presentation/screens/campaign/campaign_detail_screen.dart';
import 'package:shift_giving/presentation/providers/campaign_provider.dart';
import 'package:shift_giving/presentation/providers/organization_provider.dart';
import 'package:shift_giving/domain/entities/campaign.dart';
import 'package:shift_giving/domain/entities/organization.dart';
import 'package:shift_giving/domain/repositories/campaign_repository.dart';
import 'package:shift_giving/domain/repositories/organization_repository.dart';

class TestCampaignRepository implements CampaignRepository {
  final bool delayResponse;

  TestCampaignRepository({this.delayResponse = false});

  @override
  Future<List<Campaign>> getCampaigns() async {
    return [];
  }

  @override
  Future<List<Campaign>> getFeaturedCampaigns() async {
    return [];
  }

  @override
  Future<Campaign?> getCampaignById(String id) async {
    if (delayResponse) {
      await Future.delayed(const Duration(milliseconds: 100));
    }
    return buildTestCampaign();
  }

  Campaign buildTestCampaign() {
    final now = DateTime.now();
    return Campaign(
      id: '1',
      organizationId: '1',
      title: 'Test Campaign',
      description: 'Test description',
      shortDescription: 'Test short description',
      goalAmount: 10000.0,
      raisedAmount: 5000.0,
      status: 'active',
      startDate: now,
      endDate: now.add(const Duration(days: 30)),
      organization: OrganizationBasicInfo(
        id: '1',
        name: 'Test Organization',
      ),
    );
  }
}

class TestOrganizationRepository implements OrganizationRepository {
  @override
  Future<List<Organization>> getOrganizations() async {
    return [];
  }

  @override
  Future<Organization?> getOrganizationById(String id) async {
    return null;
  }
}

Widget buildTestWidget({bool delayResponse = false}) {
  return MaterialApp(
    home: MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => CampaignProvider(
            TestCampaignRepository(delayResponse: delayResponse),
          ),
        ),
        ChangeNotifierProvider(
          create: (_) => OrganizationProvider(TestOrganizationRepository()),
        ),
      ],
      child: const CampaignDetailScreen(campaignId: '1'),
    ),
  );
}

void main() {
  testWidgets('CampaignDetailScreen shows loading indicator when loading',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget(delayResponse: true));
    await tester.pump();
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    await tester.pumpAndSettle();
  });

  testWidgets('CampaignDetailScreen shows campaign title when loaded',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();
    expect(find.text('Test Campaign'), findsOneWidget);
  });

  testWidgets('CampaignDetailScreen shows organization name when loaded',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();
    expect(find.text('Test Organization'), findsOneWidget);
  });

  testWidgets('CampaignDetailScreen shows progress bar',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();
    expect(find.byType(LinearProgressIndicator), findsOneWidget);
  });

  testWidgets('CampaignDetailScreen shows donate button',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();
    expect(find.text('Donate Now'), findsOneWidget);
  });

  testWidgets('CampaignDetailScreen shows description when loaded',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();
    expect(find.text('Test description'), findsOneWidget);
  });

  testWidgets('CampaignDetailScreen shows back button in app bar',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();
    expect(find.byIcon(Icons.arrow_back), findsOneWidget);
  });
}
