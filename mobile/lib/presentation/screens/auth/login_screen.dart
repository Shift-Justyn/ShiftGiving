import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:shift_giving/config/theme.dart';
import 'package:shift_giving/presentation/providers/auth_provider.dart';
import 'package:shift_giving/presentation/widgets/auth/auth_header.dart';
import 'package:shift_giving/presentation/widgets/auth/auth_link.dart';
import 'package:shift_giving/presentation/widgets/auth/password_field.dart';
import 'package:shift_giving/presentation/widgets/common/app_button.dart';
import 'package:shift_giving/presentation/widgets/common/app_text_field.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    final authProvider = context.read<AuthProvider>();
    await authProvider.login(
      _emailController.text.trim(),
      _passwordController.text,
    );
    if (mounted) _navigateAfterAuth(authProvider);
  }

  void _navigateAfterAuth(AuthProvider authProvider) {
    if (authProvider.isAuthenticated) {
      context.go('/home');
    } else if (authProvider.error != null) {
      _showError(authProvider.error!);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: AppTheme.errorColor),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: _buildForm(),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: _buildFormChildren(),
      ),
    );
  }

  List<Widget> _buildFormChildren() {
    return [
      const SizedBox(height: 60),
      const AuthHeader(title: 'Welcome Back', subtitle: 'Sign in to continue'),
      const SizedBox(height: 40),
      _buildEmailField(),
      const SizedBox(height: 16),
      _buildPasswordField(),
      const SizedBox(height: 24),
      _buildLoginButton(),
      const SizedBox(height: 16),
      _buildRegisterLink(),
    ];
  }

  Widget _buildEmailField() {
    return AppTextField(
      controller: _emailController,
      labelText: 'Email',
      prefixIcon: Icons.email_outlined,
      keyboardType: TextInputType.emailAddress,
      validator: _validateEmail,
    );
  }

  String? _validateEmail(String? value) {
    if (value?.isEmpty ?? true) return 'Email is required';
    if (!value!.contains('@')) return 'Invalid email address';
    return null;
  }

  Widget _buildPasswordField() {
    return PasswordField(
      controller: _passwordController,
      labelText: 'Password',
      validator: _validatePassword,
    );
  }

  String? _validatePassword(String? value) {
    if (value?.isEmpty ?? true) return 'Password is required';
    return null;
  }

  Widget _buildLoginButton() {
    return Consumer<AuthProvider>(
      builder: (context, auth, child) => AppButton(
        onPressed: _handleLogin,
        text: 'Sign In',
        isLoading: auth.isLoading,
      ),
    );
  }

  Widget _buildRegisterLink() {
    return AuthLink(
      text: "Don't have an account? ",
      linkText: 'Sign Up',
      onPressed: () => context.go('/auth/register'),
    );
  }
}
