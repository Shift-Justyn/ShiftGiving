import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { colors, radii } from '../../theme/tokens';

interface TabToggleProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabToggle = ({ tabs, activeTab, onTabChange }: TabToggleProps) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && styles.activeTab,
          ]}
          onPress={() => onTabChange(tab)}
        >
          <Text
            fontSize={14}
            fontWeight="600"
            color={activeTab === tab ? 'white' : colors.lightTextSecondary}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.lightBorder,
    padding: 4,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
});
