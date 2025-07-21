import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter/material.dart';

import 'app.dart';
import 'package:shift_giving/home_page.dart';
import 'package:shift_giving/splash_screen.dart';

void splashScreenTests() {
  group('Splash Screen Navigation Tests', () {
    testWidgets(
      'Should navigate from SplashScreen to HomePage quickly in test mode',
          (WidgetTester tester) async {
        await tester.pumpWidget(
          const ShiftGivingApp(splashDelay: Duration(milliseconds: 100))
        );
        await tester.pumpAndSettle();

        expect(find.byType(SplashScreen), findsOneWidget);
        expect(find.byType(HomePage), findsNothing);

        await tester.pump(const Duration(milliseconds: 150));
        await tester.pumpAndSettle();

        expect(find.byType(SplashScreen), findsNothing);
        expect(find.byType(HomePage), findsOneWidget);
      },
    );
  });
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  splashScreenTests();
}
