import 'package:flutter/material.dart';
import 'package:shift_giving/splash_screen.dart';

void main() {
  runApp(ShiftGivingApp());
}

class ShiftGivingApp extends StatelessWidget {
  const ShiftGivingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: SplashScreen(),
    );
  }
}