import { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOneOrganization } from '@/src/hooks/useOneOrganization';
import { Button } from '@/src/components/ui/Button';
import { TabToggle } from '@/src/components/ui/TabToggle';
import { colors, spacing, radii } from '@/src/theme/tokens';

export default function OrganizationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const { data: organization, isLoading } = useOneOrganization(id as string);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!organization) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.error}>
          <Text fontSize={16} color={colors.error}>
            Organization not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header onBack={() => router.back()} />

        <Image
          source={{ uri: organization.logoUrl || undefined }}
          style={styles.heroImage}
        />

        <View style={styles.content}>
          <Text fontSize={24} fontWeight="700" color={colors.lightText} marginBottom={spacing.md}>
            {organization.name}
          </Text>

          <TabToggle
            tabs={['Overview', 'Posts']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <View style={styles.tabContent}>
            {activeTab === 'Overview' ? (
              <OverviewTab organization={organization} />
            ) : (
              <PostsTab />
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button testID="donate-button" variant="primary" size="lg" onPress={() => router.push('/donate')}>
          Donate
        </Button>
      </View>
    </SafeAreaView>
  );
}

const Header = ({ onBack }: { onBack: () => void }) => (
  <View style={styles.header}>
    <TouchableOpacity testID="back-button" onPress={onBack}>
      <Ionicons name="chevron-back" size={24} color={colors.lightText} />
    </TouchableOpacity>
  </View>
);

const OverviewTab = ({
  organization,
}: {
  organization: ReturnType<typeof useOneOrganization>['data'];
}) => {
  if (!organization) return null;

  return (
    <View style={styles.tabSection}>
      {organization.description && (
        <View style={styles.section}>
          <Text fontSize={14} fontWeight="600" color={colors.lightText} marginBottom={spacing.sm}>
            Mission
          </Text>
          <Text fontSize={14} color={colors.lightTextSecondary} lineHeight={22}>
            {organization.description}
          </Text>
        </View>
      )}

      {organization.activeCampaigns.length > 0 && (
        <View style={styles.section}>
          <Text fontSize={14} fontWeight="600" color={colors.lightText} marginBottom={spacing.sm}>
            Active Campaigns
          </Text>
          {organization.activeCampaigns.map((campaign) => (
            <View key={campaign.id} style={styles.campaignItem}>
              <Text fontSize={14} color={colors.lightText}>
                {campaign.title}
              </Text>
            </View>
          ))}
        </View>
      )}

      {organization.contactEmail && (
        <View style={styles.section}>
          <Text fontSize={12} color={colors.lightTextSecondary}>
            Contact: {organization.contactEmail}
          </Text>
        </View>
      )}
    </View>
  );
};

const PostsTab = () => (
  <View style={styles.tabSection}>
    <View style={styles.placeholder}>
      <Text fontSize={14} color={colors.lightTextSecondary}>
        Updates from this organization will appear here
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightBackground },
  loader: { marginTop: spacing.xxl },
  error: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: colors.lightBorder,
  },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.lg },
  tabContent: { marginTop: spacing.md },
  tabSection: { gap: spacing.lg },
  section: { gap: spacing.sm },
  campaignItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'white',
    borderRadius: radii.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  placeholder: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: 'white',
    borderRadius: radii.md,
    alignItems: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.lightBorder,
  },
});
