import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:shift_giving/main.dart' as app;
import 'package:shift_giving/home_page.dart';
import 'package:shift_giving/splash_screen.dart';

void splashScreenRegularTests() {
  group('Splash Screen Navigation Tests (Regular)', () {
    testWidgets(
      'Should navigate from SplashScreen to HomePage after 3 seconds',
          (WidgetTester tester) async {
        app.main();
        await tester.pumpAndSettle();

        expect(find.byType(SplashScreen), findsOneWidget);
        expect(find.byType(HomePage), findsNothing);

        await tester.pump(const Duration(seconds: 3, milliseconds: 100));
        await tester.pumpAndSettle();

        expect(find.byType(SplashScreen), findsNothing);
        expect(find.byType(HomePage), findsOneWidget);
      },
    );
  });
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  splashScreenRegularTests();
}