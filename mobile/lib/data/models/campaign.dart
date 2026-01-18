class Campaign {
  final String id;
  final String title;
  final String? shortDescription;
  final double goalAmount;
  final double raisedAmount;
  final String status;
  final String? featuredImageUrl;
  final OrganizationBasic organization;
  final DateTime endDate;

  Campaign({
    required this.id,
    required this.title,
    this.shortDescription,
    required this.goalAmount,
    required this.raisedAmount,
    required this.status,
    this.featuredImageUrl,
    required this.organization,
    required this.endDate,
  });

  factory Campaign.fromJson(Map<String, dynamic> json) {
    return Campaign(
      id: json['id'] as String,
      title: json['title'] as String,
      shortDescription: json['shortDescription'] as String?,
      goalAmount: (json['goalAmount'] as num).toDouble(),
      raisedAmount: (json['raisedAmount'] as num).toDouble(),
      status: json['status'] as String,
      featuredImageUrl: json['featuredImageUrl'] as String?,
      organization: OrganizationBasic.fromJson(
        json['organization'] as Map<String, dynamic>,
      ),
      endDate: DateTime.parse(json['endDate'] as String),
    );
  }
}

class OrganizationBasic {
  final String id;
  final String name;
  final String? logoUrl;

  OrganizationBasic({
    required this.id,
    required this.name,
    this.logoUrl,
  });

  factory OrganizationBasic.fromJson(Map<String, dynamic> json) {
    return OrganizationBasic(
      id: json['id'] as String,
      name: json['name'] as String,
      logoUrl: json['logoUrl'] as String?,
    );
  }
}
