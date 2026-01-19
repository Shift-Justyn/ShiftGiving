import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCampaigns } from '@/src/hooks/useCampaigns';
import { CampaignCard } from '@/src/components/campaigns/CampaignCard';
import { SearchBar } from '@/src/components/ui/SearchBar';
import { colors, spacing } from '@/src/theme/tokens';
import { Campaign } from '@/src/api/types';

export default function CampaignsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: campaigns = [], isLoading, refetch } = useCampaigns();

  const filtered = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCampaignPress = (campaign: Campaign) => {
    router.push(`/campaign/${campaign.id}`);
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text fontSize={16} color={colors.lightTextSecondary}>
        No campaigns found
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity testID="back-button" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.lightText} />
        </TouchableOpacity>
        <Text fontSize={20} fontWeight="700" color={colors.lightText} flex={1} marginLeft={spacing.md}>
          All Campaigns
        </Text>
      </View>

      <View style={styles.content}>
        <SearchBar
          placeholder="Search campaigns"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {isLoading && !campaigns.length ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <CampaignCard campaign={item} onPress={handleCampaignPress} fullWidth />
              </View>
            )}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={filtered.length === 0 ? styles.emptyContent : styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightBackground },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: { flex: 1, paddingHorizontal: spacing.lg, gap: spacing.lg },
  loader: { marginTop: spacing.xl },
  cardWrapper: { marginBottom: spacing.lg },
  listContent: { paddingBottom: spacing.lg },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
});
