import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:shift_giving/main.dart' as app;
import 'package:shift_giving/home_page.dart';
import 'package:shift_giving/splash_screen.dart';

void splashScreenTests() {
  group('Splash Screen Navigation Tests', () {
    testWidgets(
      'Should navigate from SplashScreen to HomePage after delay',
          (WidgetTester tester) async {
        app.main();
        await tester.pumpAndSettle();

        expect(find.byType(SplashScreen), findsOneWidget);
        expect(find.byType(HomePage), findsNothing);

        await Future.delayed(const Duration(seconds: 4));
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
