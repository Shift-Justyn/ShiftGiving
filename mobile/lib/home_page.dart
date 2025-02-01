import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  HomePage({super.key});

  final List<Map<String, String>> campaigns = [
    {
      "title": "Sponsor a Family in Need",
      "description": "Help families experiencing financial hardship.",
      "image": "assets/images/campaign-default-image.png",
    },
    {
      "title": "Support Clean Initiatives",
      "description": "Provide access to clean drinking water worldwide.",
      "image": "assets/images/campaign-default-image.png",
    },
    {
      "title": "Education for All",
      "description": "Fund scholarships for underprivileged children.",
      "image": "assets/images/campaign-default-image.png",
    },
  ];

  final List<Map<String, String>> organizations = [
    {
      "title": "Local Food Bank",
      "description": "Providing meals to those in need.",
      "image": "assets/images/organization-default-image.png",
    },
    {
      "title": "Animal Shelter Rescue",
      "description": "Caring for stray and abandoned pets.",
      "image": "assets/images/organization-default-image.png",
    },
    {
      "title": "Environmental Conservation",
      "description": "Protecting nature and wildlife.",
      "image": "assets/images/organization-default-image.png",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 115),
                  const Text(
                    'Hello, Sally',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 80),
                  TextField(
                    decoration: InputDecoration(
                      hintText: 'Search for a charity or nonprofit',
                      prefixIcon: const Icon(
                        Icons.search,
                        size: 30,
                        color: Color(0xFF878787),
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(
                          color: Color(0xFF878787),
                          width: 1.5,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(
                          color: Color(0xFF878787),
                          width: 1.5,
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(
                          color: Color(0xFF878787),
                          width: 2,
                        ),
                      ),
                      isDense: true,
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            ),

            // Campaigns Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: _buildSectionHeader('Campaigns'),
            ),
            _buildHorizontalList(data: campaigns),

            // Organizations Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: _buildSectionHeader('Organizations'),
            ),
            _buildHorizontalList(data: organizations),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        TextButton(
          onPressed: () {},
          child: const Text(
            'See All',
            style: TextStyle(
              shadows: [
                Shadow(
                  offset: Offset(0, -1),
                  color: Color(0xFF00A0C4),
                )
              ],
              fontSize: 15,
              color: Colors.transparent,
              fontWeight: FontWeight.w600,
              decoration: TextDecoration.underline,
              decorationColor: Color(0xFF00A0C4),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHorizontalList({required List<Map<String, String>> data}) {
    return SizedBox(
      height: 250,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: data.length,
        itemBuilder: (context, index) {
          return _buildItemCard(
            title: data[index]["title"]!,
            description: data[index]["description"]!,
            imagePath: data[index]["image"]!,
            isLast: index == data.length - 1,
          );
        },
      ),
    );
  }

  Widget _buildItemCard({
    required String title,
    required String description,
    required String imagePath,
    bool isLast = false,
  }) {
    return Container(
      width: 260,
      margin: EdgeInsets.only(
        left: 24,
        right: isLast ? 24 : 0,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              // Background Image
              Container(
                height: 165,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  image: DecorationImage(
                    image: AssetImage(imagePath),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Container(
                height: 165,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.center,
                    colors: [
                      Colors.black.withAlpha(51),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: const TextStyle(fontSize: 13),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
