import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shift_giving/presentation/providers/campaign_provider.dart';
import 'package:shift_giving/domain/entities/campaign.dart';

class CampaignDetailScreen extends StatefulWidget {
  final String campaignId;

  const CampaignDetailScreen({super.key, required this.campaignId});

  @override
  State<CampaignDetailScreen> createState() => _CampaignDetailScreenState();
}

class _CampaignDetailScreenState extends State<CampaignDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadCampaign());
  }

  Future<void> _loadCampaign() async {
    final provider = context.read<CampaignProvider>();
    await provider.loadCampaignById(widget.campaignId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(),
      body: _buildBody(),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      leading: _buildBackButton(),
    );
  }

  Widget _buildBackButton() {
    return IconButton(
      icon: const Icon(Icons.arrow_back, color: Colors.black),
      onPressed: () => Navigator.of(context).pop(),
    );
  }

  Widget _buildBody() {
    return Consumer<CampaignProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) return _buildLoadingIndicator();
        if (provider.error != null) return _buildErrorMessage(provider.error!);
        if (provider.selectedCampaign == null) return _buildNotFoundMessage();
        return _buildContent(provider.selectedCampaign!);
      },
    );
  }

  Widget _buildLoadingIndicator() {
    return const Center(child: CircularProgressIndicator());
  }

  Widget _buildErrorMessage(String error) {
    return Center(
      child: Text('Error: $error', style: const TextStyle(color: Colors.red)),
    );
  }

  Widget _buildNotFoundMessage() {
    return const Center(child: Text('Campaign not found'));
  }

  Widget _buildContent(Campaign campaign) {
    return Column(
      children: [
        Expanded(child: _buildScrollableContent(campaign)),
        _buildDonateButton(),
      ],
    );
  }

  Widget _buildScrollableContent(Campaign campaign) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildFeaturedImage(campaign.featuredImageUrl),
          _buildDetails(campaign),
        ],
      ),
    );
  }

  Widget _buildFeaturedImage(String? imageUrl) {
    return Container(
      width: double.infinity,
      height: 250,
      decoration: _buildImageDecoration(imageUrl),
      child: imageUrl == null ? _buildPlaceholderIcon() : null,
    );
  }

  BoxDecoration _buildImageDecoration(String? imageUrl) {
    return BoxDecoration(
      color: const Color(0xFFE0E0E0),
      image: imageUrl != null ? _buildNetworkImage(imageUrl) : null,
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
      child: Icon(Icons.image, size: 80, color: Color(0xFF878787)),
    );
  }

  Widget _buildDetails(Campaign campaign) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTitle(campaign.title),
          const SizedBox(height: 8),
          _buildOrganizationName(campaign.organization?.name ?? 'Unknown'),
          const SizedBox(height: 24),
          _buildProgressBar(campaign.raisedAmount, campaign.goalAmount),
          const SizedBox(height: 8),
          _buildAmountRaisedText(campaign.raisedAmount, campaign.goalAmount),
          const SizedBox(height: 24),
          _buildDescription(campaign.description ?? ''),
        ],
      ),
    );
  }

  Widget _buildTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
    );
  }

  Widget _buildOrganizationName(String name) {
    return Text(
      name,
      style: const TextStyle(fontSize: 16, color: Color(0xFF878787)),
    );
  }

  Widget _buildProgressBar(double raised, double goal) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: LinearProgressIndicator(
        value: _calculateProgress(raised, goal),
        minHeight: 12,
        backgroundColor: const Color(0xFFE0E0E0),
        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF00A0C4)),
      ),
    );
  }

  double _calculateProgress(double raised, double goal) {
    if (goal == 0) return 0;
    return (raised / goal).clamp(0.0, 1.0);
  }

  Widget _buildAmountRaisedText(double raised, double goal) {
    return Text(
      '\$${_formatAmount(raised)} raised of \$${_formatAmount(goal)} goal',
      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
    );
  }

  String _formatAmount(double amount) {
    return amount.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]},',
        );
  }

  Widget _buildDescription(String description) {
    return Text(
      description,
      style: const TextStyle(fontSize: 16, height: 1.5),
    );
  }

  Widget _buildDonateButton() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24.0),
      child: ElevatedButton(
        onPressed: () {},
        style: _buildButtonStyle(),
        child: const Padding(
          padding: EdgeInsets.symmetric(vertical: 16.0),
          child: Text(
            'Donate Now',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  ButtonStyle _buildButtonStyle() {
    return ElevatedButton.styleFrom(
      backgroundColor: const Color(0xFF00A0C4),
      foregroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    );
  }
}
