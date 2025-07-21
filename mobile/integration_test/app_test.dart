import 'package:flutter/material.dart';
import 'package:shift_giving/splash_screen.dart';

void main() {
  runApp(const ShiftGivingTestApp());
}

class ShiftGivingTestApp extends StatelessWidget {
  const ShiftGivingTestApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shift Giving Test',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const SplashScreen(
        overrideDelay: Duration(milliseconds: 100),
      ),
    );
  }
}