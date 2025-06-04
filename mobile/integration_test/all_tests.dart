import 'package:integration_test/integration_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'splash_screen_test.dart' as splash_screen_test;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('All Integration Tests', () {
    splash_screen_test.splashScreenTests();
  });
}
