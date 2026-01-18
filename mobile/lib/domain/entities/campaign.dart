class Campaign {
  final String id;
  final String organizationId;
  final String title;
  final String? description;
  final String? shortDescription;
  final double goalAmount;
  final double raisedAmount;
  final String status;
  final DateTime startDate;
  final DateTime endDate;
  final String? featuredImageUrl;
  final String? videoUrl;
  final bool isFeatured;
  final OrganizationBasicInfo? organization;
  final List<CampaignImage>? images;
  final List<CampaignProgram>? programs;
  final CampaignSocialLinks? socialLinks;

  Campaign({
    required this.id,
    required this.organizationId,
    required this.title,
    this.description,
    this.shortDescription,
    required this.goalAmount,
    required this.raisedAmount,
    required this.status,
    required this.startDate,
    required this.endDate,
    this.featuredImageUrl,
    this.videoUrl,
    this.isFeatured = false,
    this.organization,
    this.images,
    this.programs,
    this.socialLinks,
  });

  factory Campaign.fromJson(Map<String, dynamic> json) {
    return Campaign(
      id: json['id'] as String,
      organizationId: json['organizationId'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      shortDescription: json['shortDescription'] as String?,
      goalAmount: (json['goalAmount'] as num).toDouble(),
      raisedAmount: (json['raisedAmount'] as num).toDouble(),
      status: json['status'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      featuredImageUrl: json['featuredImageUrl'] as String?,
      videoUrl: json['videoUrl'] as String?,
      isFeatured: json['isFeatured'] as bool? ?? false,
      organization: _parseOrganization(json['organization']),
      images: _parseImages(json['images']),
      programs: _parsePrograms(json['programs']),
      socialLinks: _parseSocialLinks(json['socialLinks']),
    );
  }

  static OrganizationBasicInfo? _parseOrganization(dynamic json) {
    return json != null ? OrganizationBasicInfo.fromJson(json) : null;
  }

  static List<CampaignImage>? _parseImages(dynamic json) {
    if (json == null) return null;
    return (json as List).map((e) => CampaignImage.fromJson(e)).toList();
  }

  static List<CampaignProgram>? _parsePrograms(dynamic json) {
    if (json == null) return null;
    return (json as List).map((e) => CampaignProgram.fromJson(e)).toList();
  }

  static CampaignSocialLinks? _parseSocialLinks(dynamic json) {
    return json != null ? CampaignSocialLinks.fromJson(json) : null;
  }
}

class OrganizationBasicInfo {
  final String id;
  final String name;
  final String? logoUrl;
  final String? description;

  OrganizationBasicInfo({
    required this.id,
    required this.name,
    this.logoUrl,
    this.description,
  });

  factory OrganizationBasicInfo.fromJson(Map<String, dynamic> json) {
    return OrganizationBasicInfo(
      id: json['id'] as String,
      name: json['name'] as String,
      logoUrl: json['logoUrl'] as String?,
      description: json['description'] as String?,
    );
  }
}

class CampaignImage {
  final String url;
  final String? altText;

  CampaignImage({required this.url, this.altText});

  factory CampaignImage.fromJson(Map<String, dynamic> json) {
    return CampaignImage(
      url: json['url'] as String,
      altText: json['altText'] as String?,
    );
  }
}

class CampaignProgram {
  final String name;
  final String? description;

  CampaignProgram({required this.name, this.description});

  factory CampaignProgram.fromJson(Map<String, dynamic> json) {
    return CampaignProgram(
      name: json['name'] as String,
      description: json['description'] as String?,
    );
  }
}

class CampaignSocialLinks {
  final String? facebook;
  final String? twitter;
  final String? instagram;
  final String? linkedin;

  CampaignSocialLinks({
    this.facebook,
    this.twitter,
    this.instagram,
    this.linkedin,
  });

  factory CampaignSocialLinks.fromJson(Map<String, dynamic> json) {
    return CampaignSocialLinks(
      facebook: json['facebook'] as String?,
      twitter: json['twitter'] as String?,
      instagram: json['instagram'] as String?,
      linkedin: json['linkedin'] as String?,
    );
  }
}
