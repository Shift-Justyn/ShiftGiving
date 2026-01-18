import 'package:shift_giving/data/datasources/remote/api_client.dart';
import 'package:shift_giving/data/models/api_response.dart';
import 'package:shift_giving/domain/entities/campaign.dart';
import 'package:shift_giving/domain/repositories/campaign_repository.dart'
    as domain;

class CampaignRepository implements domain.CampaignRepository {
  final ApiClient _apiClient;

  CampaignRepository(this._apiClient);

  @override
  Future<List<Campaign>> getCampaigns() async {
    try {
      final response = await _fetchCampaigns(1, 20, null, null);
      return _parseCampaignList(response);
    } catch (e) {
      return [];
    }
  }

  @override
  Future<List<Campaign>> getFeaturedCampaigns() async {
    try {
      final response = await _fetchCampaigns(1, 20, null, true);
      return _parseCampaignList(response);
    } catch (e) {
      return [];
    }
  }

  @override
  Future<Campaign?> getCampaignById(String id) async {
    try {
      final response = await _apiClient.get('/api/campaigns/$id');
      return _parseCampaign(response);
    } catch (e) {
      return null;
    }
  }

  Future<dynamic> _fetchCampaigns(
    int page,
    int pageSize,
    String? status,
    bool? featured,
  ) {
    final params = _buildQueryParams(page, pageSize, status, featured);
    return _apiClient.get('/api/campaigns', queryParams: params);
  }

  Map<String, dynamic> _buildQueryParams(
    int page,
    int pageSize,
    String? status,
    bool? featured,
  ) {
    final params = <String, dynamic>{'page': page, 'pageSize': pageSize};
    if (status != null) params['status'] = status;
    if (featured != null) params['featured'] = featured;
    return params;
  }

  List<Campaign> _parseCampaignList(dynamic response) {
    final apiResponse = ApiResponse.fromJson(
      response.data,
      (json) => (json as List).map((item) => Campaign.fromJson(item)).toList(),
    );
    return apiResponse.data ?? [];
  }

  Campaign? _parseCampaign(dynamic response) {
    final apiResponse = ApiResponse.fromJson(
      response.data,
      (json) => Campaign.fromJson(json as Map<String, dynamic>),
    );
    return apiResponse.data;
  }
}
