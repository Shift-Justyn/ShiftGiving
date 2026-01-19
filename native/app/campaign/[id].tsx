import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Share,
} from 'react-native';
import { Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOneCampaign } from '@/src/hooks/useOneCampaign';
import { CampaignProgress } from '@/src/components/campaigns/CampaignProgress';
import { Button } from '@/src/components/ui/Button';
import { colors, spacing, radii } from '@/src/theme/tokens';
import { CampaignDetail } from '@/src/api/types';

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

const isClosingSoon = (endDate: string): boolean => {
  const daysUntilEnd = (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return daysUntilEnd <= 7 && daysUntilEnd > 0;
};

export default function CampaignDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: campaign, isLoading } = useOneCampaign(id as string);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.error}>
          <Text fontSize={16} color={colors.error}>
            Campaign not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header onBack={() => router.back()} />
        <HeroImage imageUrl={campaign.featuredImageUrl} videoUrl={campaign.videoUrl} />
        <CampaignContent campaign={campaign} />
      </ScrollView>
      <DonateFooter campaignId={campaign.id} />
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

const HeroImage = ({
  imageUrl,
  videoUrl,
}: {
  imageUrl: string | null;
  videoUrl: string | null;
}) => (
  <View style={styles.heroContainer}>
    <Image source={{ uri: imageUrl || undefined }} style={styles.heroImage} />
    {videoUrl && (
      <View style={styles.playButtonOverlay}>
        <View style={styles.playButton}>
          <Ionicons name="play" size={32} color="white" />
        </View>
      </View>
    )}
  </View>
);

const CampaignContent = ({ campaign }: { campaign: CampaignDetail }) => {
  const showClosingSoon = isClosingSoon(campaign.endDate);

  return (
    <View style={styles.content}>
      <Text fontSize={24} fontWeight="700" color={colors.lightText}>
        {campaign.title}
      </Text>

      <ProgressSection
        raised={campaign.raisedAmount}
        goal={campaign.goalAmount}
        showClosingSoon={showClosingSoon}
      />

      {campaign.description && (
        <Text fontSize={14} color={colors.lightTextSecondary} lineHeight={22}>
          {campaign.description}
        </Text>
      )}

      <SocialShareSection campaign={campaign} />
    </View>
  );
};

const ProgressSection = ({
  raised,
  goal,
  showClosingSoon,
}: {
  raised: number;
  goal: number;
  showClosingSoon: boolean;
}) => (
  <View style={styles.progressSection}>
    <View style={styles.progressHeader}>
      {showClosingSoon && (
        <View style={styles.closingSoonBadge}>
          <Text fontSize={12} fontWeight="600" color="white">
            Closing Soon!
          </Text>
        </View>
      )}
    </View>
    <CampaignProgress raised={raised} goal={goal} />
    <View style={styles.goalBadge}>
      <Text fontSize={16} fontWeight="600" color={colors.primary}>
        {formatCurrency(goal)}
      </Text>
    </View>
  </View>
);

const SocialShareSection = ({ campaign }: { campaign: CampaignDetail }) => {
  const shareUrl = `https://shiftgiving.justyn.app/campaigns/${campaign.id}`;

  const handleShare = async (platform: string) => {
    const message = `Check out this campaign: ${campaign.title}`;
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    if (platform === 'native') {
      await Share.share({ message: `${message} ${shareUrl}` });
      return;
    }

    const url = urls[platform];
    if (url && (await Linking.canOpenURL(url))) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.socialSection}>
      <Text fontSize={14} fontWeight="600" color={colors.lightText} marginBottom={spacing.sm}>
        Share this campaign
      </Text>
      <View style={styles.socialIcons}>
        <SocialButton icon="logo-facebook" onPress={() => handleShare('facebook')} />
        <SocialButton icon="logo-twitter" onPress={() => handleShare('twitter')} />
        <SocialButton icon="logo-instagram" onPress={() => handleShare('native')} />
        <SocialButton icon="logo-linkedin" onPress={() => handleShare('linkedin')} />
      </View>
    </View>
  );
};

const SocialButton = ({
  icon,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.socialButton} onPress={onPress} testID={`share-${icon}`}>
    <Ionicons name={icon} size={24} color={colors.primary} />
  </TouchableOpacity>
);

const DonateFooter = ({ campaignId }: { campaignId: string }) => {
  const router = useRouter();

  return (
    <View style={styles.buttonContainer}>
      <Button
        variant="primary"
        size="lg"
        onPress={() => router.push(`/donation/${campaignId}`)}
        testID="donate-button">
        Donate
      </Button>
    </View>
  );
};

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
  heroContainer: { position: 'relative' },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: colors.lightBorder,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  progressSection: { gap: spacing.sm },
  progressHeader: { flexDirection: 'row', justifyContent: 'flex-end' },
  closingSoonBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  goalBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  socialSection: { marginTop: spacing.md },
  socialIcons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.lightBorder,
  },
});
