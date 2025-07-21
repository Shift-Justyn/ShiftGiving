import 'package:flutter/material.dart';
import 'package:shift_giving/splash_screen.dart';

void main() {
  runApp(const ShiftGivingApp());
}

class ShiftGivingApp extends StatelessWidget {
  const ShiftGivingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Montserrat',
      ),
      home: const SplashScreen(),
    );
  }
}