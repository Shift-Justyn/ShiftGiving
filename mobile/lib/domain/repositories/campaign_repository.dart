import 'package:shift_giving/domain/entities/campaign.dart';

abstract class CampaignRepository {
  Future<List<Campaign>> getCampaigns();
  Future<List<Campaign>> getFeaturedCampaigns();
  Future<Campaign?> getCampaignById(String id);
}
