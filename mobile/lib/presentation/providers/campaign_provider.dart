import 'package:flutter/material.dart';
import 'package:shift_giving/domain/entities/campaign.dart';
import 'package:shift_giving/domain/repositories/campaign_repository.dart';

class CampaignProvider extends ChangeNotifier {
  final CampaignRepository _repository;

  List<Campaign> _campaigns = [];
  List<Campaign> _featuredCampaigns = [];
  Campaign? _selectedCampaign;
  bool _isLoading = false;
  String? _error;

  CampaignProvider(this._repository);

  List<Campaign> get campaigns => _campaigns;
  List<Campaign> get featuredCampaigns => _featuredCampaigns;
  Campaign? get selectedCampaign => _selectedCampaign;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadCampaigns() async {
    await _executeLoad(() => _fetchCampaigns());
  }

  Future<void> _fetchCampaigns() async {
    _campaigns = await _repository.getCampaigns();
  }

  Future<void> loadFeaturedCampaigns() async {
    await _executeLoad(() => _fetchFeaturedCampaigns());
  }

  Future<void> _fetchFeaturedCampaigns() async {
    _featuredCampaigns = await _repository.getFeaturedCampaigns();
  }

  Future<void> loadCampaignById(String id) async {
    await _executeLoad(() => _fetchCampaignById(id));
  }

  Future<void> _fetchCampaignById(String id) async {
    _selectedCampaign = await _repository.getCampaignById(id);
  }

  void clearSelectedCampaign() {
    _selectedCampaign = null;
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
