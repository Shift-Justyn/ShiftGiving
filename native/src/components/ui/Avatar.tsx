import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { colors, radii } from '../../theme/tokens';

interface AvatarProps {
  imageUrl?: string | null;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 32, md: 44, lg: 56 };

const getInitials = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return '?';
  const first = firstName?.[0]?.toUpperCase() || '';
  const last = lastName?.[0]?.toUpperCase() || '';
  return `${first}${last}` || '?';
};

export const Avatar = ({ imageUrl, firstName, lastName, size = 'md' }: AvatarProps) => {
  const dimension = sizeMap[size];
  const containerStyle = { ...styles.container, width: dimension, height: dimension, borderRadius: dimension / 2 };

  if (imageUrl) {
    return (
      <View testID="avatar-container" style={containerStyle}>
        <Image testID="avatar-image" source={{ uri: imageUrl }} style={styles.image} />
      </View>
    );
  }

  return (
    <View testID="avatar-container" style={containerStyle}>
      <Text fontSize={dimension * 0.4} fontWeight="600" color="white">
        {getInitials(firstName, lastName)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
