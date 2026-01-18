import 'package:flutter/material.dart';
import 'package:shift_giving/config/theme.dart';

class AuthLink extends StatelessWidget {
  final String text;
  final String linkText;
  final VoidCallback onPressed;

  const AuthLink({
    super.key,
    required this.text,
    required this.linkText,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildText(),
        _buildButton(),
      ],
    );
  }

  Widget _buildText() {
    return Text(
      text,
      style: const TextStyle(color: AppTheme.textSecondary),
    );
  }

  Widget _buildButton() => TextButton(onPressed: onPressed, child: Text(linkText));
}
