class Organization {
  final String id;
  final String name;
  final String? description;
  final String? logoUrl;
  final String? websiteUrl;

  Organization({
    required this.id,
    required this.name,
    this.description,
    this.logoUrl,
    this.websiteUrl,
  });

  factory Organization.fromJson(Map<String, dynamic> json) {
    return Organization(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      logoUrl: json['logoUrl'] as String?,
      websiteUrl: json['websiteUrl'] as String?,
    );
  }
}
