import 'package:shift_giving/data/datasources/remote/api_client.dart';
import 'package:shift_giving/data/models/api_response.dart';
import 'package:shift_giving/domain/entities/organization.dart';
import 'package:shift_giving/domain/repositories/organization_repository.dart'
    as domain;

class OrganizationRepository implements domain.OrganizationRepository {
  final ApiClient _apiClient;

  OrganizationRepository(this._apiClient);

  @override
  Future<List<Organization>> getOrganizations() async {
    try {
      final response = await _apiClient.get('/api/organizations');
      return _parseOrganizationList(response);
    } catch (e) {
      return [];
    }
  }

  @override
  Future<Organization?> getOrganizationById(String id) async {
    try {
      final response = await _apiClient.get('/api/organizations/$id');
      return _parseOrganization(response);
    } catch (e) {
      return null;
    }
  }

  List<Organization> _parseOrganizationList(dynamic response) {
    final apiResponse = ApiResponse.fromJson(
      response.data,
      (json) =>
          (json as List).map((item) => Organization.fromJson(item)).toList(),
    );
    return apiResponse.data ?? [];
  }

  Organization? _parseOrganization(dynamic response) {
    final apiResponse = ApiResponse.fromJson(
      response.data,
      (json) => Organization.fromJson(json as Map<String, dynamic>),
    );
    return apiResponse.data;
  }
}
