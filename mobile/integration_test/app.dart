import 'package:flutter/material.dart';
import 'package:shift_giving/splash_screen.dart';

void main() {
  runApp(const ShiftGivingApp());
}

class ShiftGivingApp extends StatelessWidget {
  final Duration? splashDelay;
  
  const ShiftGivingApp({super.key, this.splashDelay});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Montserrat',
      ),
      home: SplashScreen(overrideDelay: splashDelay),
    );
  }
}