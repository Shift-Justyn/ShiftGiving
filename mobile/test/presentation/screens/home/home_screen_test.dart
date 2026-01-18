import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shift_giving/presentation/screens/home/home_screen.dart';
import 'package:shift_giving/presentation/providers/campaign_provider.dart';
import 'package:shift_giving/presentation/providers/organization_provider.dart';
import 'package:shift_giving/domain/entities/campaign.dart';
import 'package:shift_giving/domain/entities/organization.dart';
import 'package:shift_giving/domain/repositories/campaign_repository.dart';
import 'package:shift_giving/domain/repositories/organization_repository.dart';

class TestCampaignRepository implements CampaignRepository {
  @override
  Future<List<Campaign>> getCampaigns() async {
    return [];
  }

  @override
  Future<List<Campaign>> getFeaturedCampaigns() async {
    return [buildTestCampaign()];
  }

  @override
  Future<Campaign?> getCampaignById(String id) async {
    return buildTestCampaign();
  }

  Campaign buildTestCampaign() {
    final now = DateTime.now();
    return Campaign(
      id: '1',
      organizationId: '1',
      title: 'Test Campaign',
      shortDescription: 'Test description',
      goalAmount: 1000.0,
      raisedAmount: 500.0,
      status: 'active',
      startDate: now,
      endDate: now.add(const Duration(days: 30)),
    );
  }
}

class TestOrganizationRepository implements OrganizationRepository {
  @override
  Future<List<Organization>> getOrganizations() async {
    return [buildTestOrganization()];
  }

  @override
  Future<Organization?> getOrganizationById(String id) async {
    return buildTestOrganization();
  }

  Organization buildTestOrganization() {
    return Organization(
      id: '1',
      name: 'Test Organization',
      description: 'Test description',
    );
  }
}

Widget buildTestWidget() {
  return MaterialApp(
    home: MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => CampaignProvider(TestCampaignRepository()),
        ),
        ChangeNotifierProvider(
          create: (_) => OrganizationProvider(TestOrganizationRepository()),
        ),
      ],
      child: const HomeScreen(),
    ),
  );
}

void main() {
  testWidgets('HomeScreen shows greeting text', (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    expect(find.text('Hello, Sally'), findsOneWidget);
  });

  testWidgets('HomeScreen shows search field', (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    expect(find.byType(TextField), findsOneWidget);
  });

  testWidgets('HomeScreen shows Campaigns section header',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    expect(find.text('Campaigns'), findsOneWidget);
  });

  testWidgets('HomeScreen shows Organizations section header',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    expect(find.text('Organizations'), findsOneWidget);
  });

  testWidgets('HomeScreen shows See All buttons', (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    expect(find.text('See All'), findsNWidgets(2));
  });

  testWidgets('HomeScreen shows campaign cards when data is loaded',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();
    expect(find.text('Test Campaign'), findsOneWidget);
  });

  testWidgets('HomeScreen shows organization cards when data is loaded',
      (WidgetTester tester) async {
    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();
    expect(find.text('Test Organization'), findsOneWidget);
  });
}
