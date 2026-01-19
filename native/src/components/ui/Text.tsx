import { Text as TamaguiText, TextProps as TamaguiTextProps } from 'tamagui';
import { colors, fontSizes, fontWeights } from '../../theme/tokens';

interface TextProps extends TamaguiTextProps {
  variant?: 'heading' | 'body' | 'caption';
  weight?: keyof typeof fontWeights;
}

const getVariantStyles = (variant: TextProps['variant'] = 'body') => {
  const variants = {
    heading: { fontSize: fontSizes.xxl, fontWeight: fontWeights.bold },
    body: { fontSize: fontSizes.md, fontWeight: fontWeights.normal },
    caption: { fontSize: fontSizes.sm, fontWeight: fontWeights.normal },
  };
  return variants[variant];
};

export const Text = ({ variant = 'body', weight, color = colors.lightText, ...props }: TextProps) => {
  const variantStyles = getVariantStyles(variant);
  const fontWeight = weight ? fontWeights[weight] : variantStyles.fontWeight;

  return <TamaguiText {...props} fontSize={variantStyles.fontSize} fontWeight={fontWeight} color={color} />;
};
