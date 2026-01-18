class AppConfig {
  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'development',
  );

  static String get apiBaseUrl {
    switch (environment) {
      case 'production':
        return 'https://api.shiftgiving.com';
      case 'qa':
        return 'https://api-qa.shiftgiving.com';
      default:
        return 'http://localhost:5237';
    }
  }

  static bool get isProduction => environment == 'production';
  static bool get isDevelopment => environment == 'development';
  static bool get isQA => environment == 'qa';
}
