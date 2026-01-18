import 'package:flutter/material.dart';
import 'package:shift_giving/data/datasources/remote/api_client.dart';
import 'package:shift_giving/data/datasources/local/secure_storage.dart';

class AuthProvider extends ChangeNotifier {
  final ApiClient _apiClient;
  final SecureStorage _storage;

  String? _userId;
  bool _isLoading = false;
  String? _error;

  AuthProvider(this._apiClient, this._storage) {
    _initializeAuth();
  }

  String? get userId => _userId;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _userId != null;
  String? get error => _error;

  Future<void> _initializeAuth() async {
    _userId = await _storage.getUserId();
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    await _executeAuthFlow(() => _loginRequest(email, password));
  }

  Future<dynamic> _loginRequest(String email, String password) async {
    final response = await _apiClient.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    return response.data;
  }

  Future<void> register(
    String email,
    String password,
    String firstName,
    String lastName,
  ) async {
    await _executeAuthFlow(
      () => _registerRequest(email, password, firstName, lastName),
    );
  }

  Future<dynamic> _registerRequest(
    String email,
    String password,
    String firstName,
    String lastName,
  ) async {
    final response = await _apiClient.post(
      '/auth/register',
      data: _buildRegisterData(email, password, firstName, lastName),
    );
    return response.data;
  }

  Map<String, String> _buildRegisterData(
    String email,
    String password,
    String firstName,
    String lastName,
  ) {
    return {
      'email': email,
      'password': password,
      'firstName': firstName,
      'lastName': lastName,
    };
  }

  Future<void> _executeAuthFlow(Future<dynamic> Function() request) async {
    _prepareAuthRequest();
    try {
      await _processAuthRequest(request);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  void _prepareAuthRequest() {
    _setLoading(true);
    _error = null;
  }

  Future<void> _processAuthRequest(Future<dynamic> Function() request) async {
    final data = await request();
    await _handleAuthResponse(data);
  }

  Future<void> logout() async {
    await _storage.clearAll();
    _userId = null;
    notifyListeners();
  }

  Future<void> _handleAuthResponse(dynamic data) async {
    final token = data['token'] as String?;
    final userId = data['userId'] as String?;
    if (token != null && userId != null) {
      await _saveAuthData(token, userId);
    }
  }

  Future<void> _saveAuthData(String token, String userId) async {
    await _storage.saveToken(token);
    await _storage.saveUserId(userId);
    _userId = userId;
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String message) {
    _error = message;
  }
}
