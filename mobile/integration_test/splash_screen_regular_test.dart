import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:shift_giving/main.dart' as app;
import 'package:shift_giving/presentation/screens/home/home_screen.dart';
import 'package:shift_giving/splash_screen.dart';

void splashScreenRegularTests() {
  group('Splash Screen Navigation Tests (Regular)', () {
    testWidgets(
      'Should navigate from SplashScreen to HomeScreen after 3 seconds',
          (WidgetTester tester) async {
        await tester.pumpWidget(const app.ShiftGivingApp());
        await tester.pumpAndSettle();

        expect(find.byType(SplashScreen), findsOneWidget);
        expect(find.byType(HomeScreen), findsNothing);

        await tester.pump(const Duration(seconds: 3, milliseconds: 100));
        await tester.pumpAndSettle();

        expect(find.byType(SplashScreen), findsNothing);
        expect(find.byType(HomeScreen), findsOneWidget);
      },
    );
  });
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  splashScreenRegularTests();
}