class Organization {
  final String id;
  final String name;
  final String? description;
  final String? logoUrl;
  final String? websiteUrl;
  final String? contactEmail;
  final int? campaignCount;
  final List<ActiveCampaignInfo>? activeCampaigns;

  Organization({
    required this.id,
    required this.name,
    this.description,
    this.logoUrl,
    this.websiteUrl,
    this.contactEmail,
    this.campaignCount,
    this.activeCampaigns,
  });

  factory Organization.fromJson(Map<String, dynamic> json) {
    return Organization(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      logoUrl: json['logoUrl'] as String?,
      websiteUrl: json['websiteUrl'] as String?,
      contactEmail: json['contactEmail'] as String?,
      campaignCount: json['campaignCount'] as int?,
      activeCampaigns: _parseActiveCampaigns(json['activeCampaigns']),
    );
  }

  static List<ActiveCampaignInfo>? _parseActiveCampaigns(dynamic json) {
    if (json == null) return null;
    return (json as List).map((e) => ActiveCampaignInfo.fromJson(e)).toList();
  }
}

class ActiveCampaignInfo {
  final String id;
  final String title;

  ActiveCampaignInfo({required this.id, required this.title});

  factory ActiveCampaignInfo.fromJson(Map<String, dynamic> json) {
    return ActiveCampaignInfo(
      id: json['id'] as String,
      title: json['title'] as String,
    );
  }
}
