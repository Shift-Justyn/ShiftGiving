import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shift_giving/presentation/providers/campaign_provider.dart';
import 'package:shift_giving/presentation/providers/organization_provider.dart';
import 'package:shift_giving/domain/entities/campaign.dart';
import 'package:shift_giving/domain/entities/organization.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadData());
  }

  Future<void> _loadData() async {
    final campaignProvider = context.read<CampaignProvider>();
    final organizationProvider = context.read<OrganizationProvider>();
    await Future.wait([
      campaignProvider.loadFeaturedCampaigns(),
      organizationProvider.loadOrganizations(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(),
          _buildCampaignsSection(),
          _buildOrganizationsSection(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 115),
          _buildGreeting(),
          const SizedBox(height: 80),
          _buildSearchField(),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildGreeting() {
    return const Text(
      'Hello, Sally',
      style: TextStyle(fontSize: 32, fontWeight: FontWeight.w600),
    );
  }

  Widget _buildSearchField() {
    return TextField(
      decoration: InputDecoration(
        hintText: 'Search for a charity or nonprofit',
        prefixIcon: _buildSearchIcon(),
        border: _buildBorder(),
        enabledBorder: _buildBorder(),
        focusedBorder: _buildFocusedBorder(),
        isDense: true,
      ),
    );
  }

  Widget _buildSearchIcon() {
    return const Icon(
      Icons.search,
      size: 30,
      color: Color(0xFF878787),
    );
  }

  OutlineInputBorder _buildBorder() {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
      borderSide: const BorderSide(color: Color(0xFF878787), width: 1.5),
    );
  }

  OutlineInputBorder _buildFocusedBorder() {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
      borderSide: const BorderSide(color: Color(0xFF878787), width: 2),
    );
  }

  Widget _buildCampaignsSection() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: _buildSectionHeader('Campaigns'),
        ),
        _buildCampaignsList(),
      ],
    );
  }

  Widget _buildOrganizationsSection() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: _buildSectionHeader('Organizations'),
        ),
        _buildOrganizationsList(),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildSectionTitle(title),
        _buildSeeAllButton(),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Expanded(
      child: Text(
        title,
        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        overflow: TextOverflow.ellipsis,
      ),
    );
  }

  Widget _buildSeeAllButton() {
    return TextButton(
      onPressed: () {},
      child: const Text(
        'See All',
        style: TextStyle(
          shadows: [Shadow(offset: Offset(0, -1), color: Color(0xFF00A0C4))],
          fontSize: 15,
          color: Colors.transparent,
          fontWeight: FontWeight.w600,
          decoration: TextDecoration.underline,
          decorationColor: Color(0xFF00A0C4),
        ),
      ),
    );
  }

  Widget _buildCampaignsList() {
    return Consumer<CampaignProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) return _buildLoadingIndicator();
        if (provider.error != null) return _buildErrorMessage(provider.error!);
        if (provider.featuredCampaigns.isEmpty) return _buildEmptyState();
        return _buildCampaignsHorizontalList(provider.featuredCampaigns);
      },
    );
  }

  Widget _buildOrganizationsList() {
    return Consumer<OrganizationProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) return _buildLoadingIndicator();
        if (provider.error != null) return _buildErrorMessage(provider.error!);
        if (provider.organizations.isEmpty) return _buildEmptyState();
        return _buildOrganizationsHorizontalList(provider.organizations);
      },
    );
  }

  Widget _buildLoadingIndicator() {
    return const SizedBox(
      height: 257,
      child: Center(child: CircularProgressIndicator()),
    );
  }

  Widget _buildErrorMessage(String error) {
    return SizedBox(
      height: 257,
      child: Center(child: Text('Error: $error')),
    );
  }

  Widget _buildEmptyState() {
    return const SizedBox(
      height: 257,
      child: Center(child: Text('No items available')),
    );
  }

  Widget _buildCampaignsHorizontalList(List<Campaign> campaigns) {
    return SizedBox(
      height: 257,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: campaigns.length,
        itemBuilder: (context, index) => _buildCampaignCard(
          campaigns[index],
          index == campaigns.length - 1,
        ),
      ),
    );
  }

  Widget _buildOrganizationsHorizontalList(List<Organization> organizations) {
    return SizedBox(
      height: 257,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: organizations.length,
        itemBuilder: (context, index) => _buildOrganizationCard(
          organizations[index],
          index == organizations.length - 1,
        ),
      ),
    );
  }

  Widget _buildCampaignCard(Campaign campaign, bool isLast) {
    return _buildItemCard(
      title: campaign.title,
      description: campaign.shortDescription ?? campaign.description ?? '',
      imageUrl: campaign.featuredImageUrl,
      isLast: isLast,
    );
  }

  Widget _buildOrganizationCard(Organization organization, bool isLast) {
    return _buildItemCard(
      title: organization.name,
      description: organization.description ?? '',
      imageUrl: organization.logoUrl,
      isLast: isLast,
    );
  }

  Widget _buildItemCard({
    required String title,
    required String description,
    String? imageUrl,
    bool isLast = false,
  }) {
    return Container(
      width: 260,
      margin: EdgeInsets.only(left: 24, right: isLast ? 24 : 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildCardImage(imageUrl),
          const SizedBox(height: 8),
          _buildCardTitle(title),
          const SizedBox(height: 4),
          _buildCardDescription(description),
        ],
      ),
    );
  }

  Widget _buildCardImage(String? imageUrl) {
    return Stack(
      children: [
        _buildImageContainer(imageUrl),
        _buildImageOverlay(),
      ],
    );
  }

  Widget _buildImageContainer(String? imageUrl) {
    return Container(
      height: 165,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: const Color(0xFFE0E0E0),
        image: imageUrl != null ? _buildNetworkImage(imageUrl) : null,
      ),
      child: imageUrl == null ? _buildPlaceholderIcon() : null,
    );
  }

  DecorationImage _buildNetworkImage(String imageUrl) {
    return DecorationImage(
      image: NetworkImage(imageUrl),
      fit: BoxFit.cover,
    );
  }

  Widget _buildPlaceholderIcon() {
    return const Center(
      child: Icon(Icons.image, size: 50, color: Color(0xFF878787)),
    );
  }

  Widget _buildImageOverlay() {
    return Container(
      height: 165,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: LinearGradient(
          begin: Alignment.bottomCenter,
          end: Alignment.center,
          colors: [Colors.black.withAlpha(51), Colors.transparent],
        ),
      ),
    );
  }

  Widget _buildCardTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
    );
  }

  Widget _buildCardDescription(String description) {
    return Text(
      description,
      style: const TextStyle(fontSize: 13),
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
    );
  }
}
