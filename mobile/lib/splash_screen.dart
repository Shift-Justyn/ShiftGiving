import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shift_giving/presentation/screens/home/home_screen.dart';

class SplashScreen extends StatefulWidget {
  final Duration? overrideDelay;
  
  const SplashScreen({super.key, this.overrideDelay});

  @override
  State<StatefulWidget> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final delay = widget.overrideDelay ?? const Duration(seconds: 3);
      _timer = Timer(delay, () {
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => const HomeScreen(),
            ),
          );
        }
      });
    });
  }

  @override
  void dispose() {
    super.dispose();
    _timer?.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox.expand(
        child: Image.asset(
          "assets/images/splash-screen.png",
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
