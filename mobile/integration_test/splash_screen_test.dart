import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'app_test.dart' as test_app;
import 'package:shift_giving/home_page.dart';
import 'package:shift_giving/splash_screen.dart';

void splashScreenTests() {
  group('Splash Screen Navigation Tests', () {
    testWidgets(
      'Should navigate from SplashScreen to HomePage quickly in test mode',
          (WidgetTester tester) async {
        test_app.main();
        await tester.pumpAndSettle();

        expect(find.byType(SplashScreen), findsOneWidget);
        expect(find.byType(HomePage), findsNothing);

        await tester.pumpAndSettle(const Duration(milliseconds: 200));

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
