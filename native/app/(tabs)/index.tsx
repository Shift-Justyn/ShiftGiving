import { useState } from 'react';
import { View, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useAuthStore } from '@/src/store/authStore';
import { useCampaigns } from '@/src/hooks/useCampaigns';
import { useOrganizations } from '@/src/hooks/useOrganizations';
import { CampaignCard } from '@/src/components/campaigns/CampaignCard';
import { OrganizationCard } from '@/src/components/organizations/OrganizationCard';
import { Avatar } from '@/src/components/ui/Avatar';
import { SearchBar } from '@/src/components/ui/SearchBar';
import { SkeletonCard } from '@/src/components/ui/Skeleton';
import { colors, spacing } from '@/src/theme/tokens';
import { Campaign, Organization } from '@/src/api/types';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: organizations, isLoading: orgsLoading } = useOrganizations();

  const handleCampaignPress = (campaign: Campaign) => router.push(`/campaign/${campaign.id}`);
  const handleOrganizationPress = (org: Organization) => router.push(`/organization/${org.id}`);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header user={user} />
        <View style={styles.content}>
          <Greeting name={user?.firstName} updateCount={campaigns?.length || 0} />
          <SearchBar
            placeholder="Search for a charity or nonprofit"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Section title="Campaigns" onSeeAll={() => router.push('/campaigns')}>
            {campaignsLoading ? (
              <View style={styles.skeletonScroll}>
                {[0, 1, 2].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </View>
            ) : (
              <FlatList
                data={campaigns}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <CampaignCard campaign={item} onPress={handleCampaignPress} index={index} />
                )}
                scrollEnabled={false}
              />
            )}
          </Section>
          <Section title="Organizations" onSeeAll={() => router.push('/organizations')}>
            {orgsLoading ? (
              <View style={styles.skeletonScroll}>
                {[0, 1, 2].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </View>
            ) : (
              <FlatList
                data={organizations}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <OrganizationCard organization={item} onPress={handleOrganizationPress} index={index} />
                )}
                scrollEnabled={false}
              />
            )}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Header = ({ user }: { user: ReturnType<typeof useAuthStore>['user'] }) => (
  <View style={styles.header}>
    <Avatar imageUrl={user?.avatarUrl} firstName={user?.firstName} lastName={user?.lastName} size="md" />
    <TouchableOpacity>
      <Ionicons name="search" size={24} color={colors.lightText} />
    </TouchableOpacity>
  </View>
);

const Greeting = ({ name, updateCount }: { name?: string; updateCount: number }) => (
  <View style={styles.greeting}>
    <Text fontSize={24} fontWeight="700" color={colors.lightText}>
      Hello, {name || 'Friend'}
    </Text>
    <Text fontSize={14} color={colors.lightTextSecondary}>
      There are {updateCount} updates in your community
    </Text>
  </View>
);

const Section = ({
  title,
  onSeeAll,
  children,
}: {
  title: string;
  onSeeAll: () => void;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text fontSize={18} fontWeight="600" color={colors.lightText}>
        {title}
      </Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text fontSize={14} color={colors.primary}>
          See All
        </Text>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightBackground },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  greeting: { gap: spacing.xs },
  section: { gap: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skeletonScroll: { flexDirection: 'row', gap: 16 },
});
