import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii } from '../../theme/tokens';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar = ({ placeholder, value, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Ionicons testID="search-icon" name="search" size={20} color={colors.lightTextSecondary} />
      <TextInput
        testID="search-input"
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.lightTextSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.lightBorder,
  },
  input: { flex: 1, fontSize: 16, color: colors.lightText },
});
