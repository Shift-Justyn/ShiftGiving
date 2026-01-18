import 'package:flutter/material.dart';
import 'package:shift_giving/presentation/widgets/common/app_text_field.dart';

class PasswordField extends StatefulWidget {
  final TextEditingController controller;
  final String labelText;
  final String? Function(String?)? validator;

  const PasswordField({
    super.key,
    required this.controller,
    required this.labelText,
    this.validator,
  });

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      controller: widget.controller,
      labelText: widget.labelText,
      prefixIcon: Icons.lock_outline,
      obscureText: _obscurePassword,
      suffixIcon: _buildVisibilityToggle(),
      validator: widget.validator,
    );
  }

  Widget _buildVisibilityToggle() {
    return IconButton(
      icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
    );
  }
}
