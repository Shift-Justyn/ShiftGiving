import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shift_giving/home_page.dart';
import 'package:shift_giving/splash_screen.dart';

void main() {
  testWidgets('SplashScreen navigates to HomePage after 3 seconds',
          (WidgetTester tester) async {
        await tester.pumpWidget(
          MaterialApp(
            home: const SplashScreen(),
          ),
        );

        // Verify SplashScreen is initially displayed
        expect(find.byType(SplashScreen), findsOneWidget);
        expect(find.byType(Image), findsOneWidget);

        // Fast-forward time by 3 seconds
        await tester.pump(const Duration(seconds: 3));

        // Wait for all scheduled animations and navigation to complete
        await tester.pumpAndSettle();

        // Verify navigation to HomePage
        expect(find.byType(HomePage), findsOneWidget);
      });
}