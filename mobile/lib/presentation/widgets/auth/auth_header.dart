import 'package:flutter/material.dart';
import 'package:shift_giving/config/theme.dart';

class AuthHeader extends StatelessWidget {
  final String title;
  final String subtitle;

  const AuthHeader({
    super.key,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildTitle(),
        const SizedBox(height: 8),
        _buildSubtitle(),
      ],
    );
  }

  Widget _buildTitle() {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: AppTheme.textPrimary,
      ),
    );
  }

  Widget _buildSubtitle() {
    return Text(
      subtitle,
      style: const TextStyle(
        fontSize: 16,
        color: AppTheme.textSecondary,
      ),
    );
  }
}
