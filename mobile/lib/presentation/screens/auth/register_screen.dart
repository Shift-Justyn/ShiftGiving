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

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _disposeControllers();
    super.dispose();
  }

  void _disposeControllers() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    final authProvider = context.read<AuthProvider>();
    await _performRegistration(authProvider);
    if (mounted) _navigateAfterAuth(authProvider);
  }

  Future<void> _performRegistration(AuthProvider authProvider) async {
    await authProvider.register(
      _emailController.text.trim(),
      _passwordController.text,
      _firstNameController.text.trim(),
      _lastNameController.text.trim(),
    );
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
      appBar: _buildAppBar(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: _buildForm(),
        ),
      ),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      leading: IconButton(
        icon: const Icon(Icons.arrow_back),
        onPressed: () => context.go('/auth/login'),
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
      const AuthHeader(title: 'Create Account', subtitle: 'Sign up to get started'),
      const SizedBox(height: 32),
      _buildFirstNameField(),
      const SizedBox(height: 16),
      _buildLastNameField(),
      const SizedBox(height: 16),
      _buildEmailField(),
      const SizedBox(height: 16),
      _buildPasswordField(),
      const SizedBox(height: 16),
      _buildConfirmPasswordField(),
      const SizedBox(height: 24),
      _buildRegisterButton(),
      const SizedBox(height: 16),
      _buildLoginLink(),
    ];
  }

  Widget _buildFirstNameField() {
    return AppTextField(
      controller: _firstNameController,
      labelText: 'First Name',
      prefixIcon: Icons.person_outline,
      validator: (value) => _validateRequired(value, 'First name is required'),
    );
  }

  Widget _buildLastNameField() {
    return AppTextField(
      controller: _lastNameController,
      labelText: 'Last Name',
      prefixIcon: Icons.person_outline,
      validator: (value) => _validateRequired(value, 'Last name is required'),
    );
  }

  String? _validateRequired(String? value, String message) {
    if (value?.isEmpty ?? true) return message;
    return null;
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
    if (value!.length < 8) return 'Password must be at least 8 characters';
    return null;
  }

  Widget _buildConfirmPasswordField() {
    return PasswordField(
      controller: _confirmPasswordController,
      labelText: 'Confirm Password',
      validator: _validateConfirmPassword,
    );
  }

  String? _validateConfirmPassword(String? value) {
    if (value?.isEmpty ?? true) return 'Please confirm your password';
    if (value != _passwordController.text) return 'Passwords do not match';
    return null;
  }

  Widget _buildRegisterButton() {
    return Consumer<AuthProvider>(
      builder: (context, auth, child) => AppButton(
        onPressed: _handleRegister,
        text: 'Create Account',
        isLoading: auth.isLoading,
      ),
    );
  }

  Widget _buildLoginLink() {
    return AuthLink(
      text: 'Already have an account? ',
      linkText: 'Sign In',
      onPressed: () => context.go('/auth/login'),
    );
  }
}
