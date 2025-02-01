import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shift_giving/splash_screen.dart';

void main() {
  testWidgets('SplashScreen navigates to HomePage after 3 seconds',
      (WidgetTester tester) async {
    await tester.binding.setSurfaceSize(const Size(360, 640));

    await tester.pumpWidget(
      MaterialApp(
        home: const SplashScreen(),
      ),
    );

    expect(find.byType(SplashScreen), findsOneWidget);
    expect(find.byType(Image), findsOneWidget);

    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();

    expect(find.text('Hello, Sally'), findsOneWidget);
  });
}
