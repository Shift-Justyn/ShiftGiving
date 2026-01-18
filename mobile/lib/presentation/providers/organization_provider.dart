import 'package:flutter/material.dart';
import 'package:shift_giving/domain/entities/organization.dart';
import 'package:shift_giving/domain/repositories/organization_repository.dart';

class OrganizationProvider extends ChangeNotifier {
  final OrganizationRepository _repository;

  List<Organization> _organizations = [];
  Organization? _selectedOrganization;
  bool _isLoading = false;
  String? _error;

  OrganizationProvider(this._repository);

  List<Organization> get organizations => _organizations;
  Organization? get selectedOrganization => _selectedOrganization;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadOrganizations() async {
    await _executeLoad(() => _fetchOrganizations());
  }

  Future<void> _fetchOrganizations() async {
    _organizations = await _repository.getOrganizations();
  }

  Future<void> loadOrganizationById(String id) async {
    await _executeLoad(() => _fetchOrganizationById(id));
  }

  Future<void> _fetchOrganizationById(String id) async {
    _selectedOrganization = await _repository.getOrganizationById(id);
  }

  void clearSelectedOrganization() {
    _selectedOrganization = null;
    notifyListeners();
  }

  Future<void> _executeLoad(Future<void> Function() request) async {
    _prepareLoad();
    try {
      await request();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  void _prepareLoad() {
    _setLoading(true);
    _error = null;
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String message) {
    _error = message;
  }
}
