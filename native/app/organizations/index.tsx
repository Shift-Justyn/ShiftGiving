import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrganizations } from '@/src/hooks/useOrganizations';
import { OrganizationCard } from '@/src/components/organizations/OrganizationCard';
import { SearchBar } from '@/src/components/ui/SearchBar';
import { colors, spacing } from '@/src/theme/tokens';
import { Organization } from '@/src/api/types';

export default function OrganizationsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: organizations = [], isLoading, refetch } = useOrganizations();

  const filtered = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOrganizationPress = (org: Organization) => {
    router.push(`/organization/${org.id}`);
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text fontSize={16} color={colors.lightTextSecondary}>
        No organizations found
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
          All Organizations
        </Text>
      </View>

      <View style={styles.content}>
        <SearchBar
          placeholder="Search organizations"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {isLoading && !organizations.length ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <OrganizationCard organization={item} onPress={handleOrganizationPress} />
            )}
            numColumns={2}
            columnWrapperStyle={styles.grid}
            scrollEnabled={true}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={filtered.length === 0 ? styles.emptyContent : undefined}
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
  grid: { justifyContent: 'space-between', gap: spacing.lg, marginBottom: spacing.lg },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
});
