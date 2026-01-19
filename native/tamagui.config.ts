import { createTamagui } from 'tamagui'
import { config } from '@tamagui/config/v4'
import { colors, spacing, radii, fontSizes } from './src/theme/tokens'

const appConfig = createTamagui({
  ...config,
  themes: {
    light: {
      background: colors.lightBackground,
      backgroundFocus: colors.lightSurface,
      backgroundHover: colors.lightSurface,
      backgroundPress: colors.lightBorder,
      color: colors.lightText,
      colorFocus: colors.lightText,
      colorHover: colors.lightText,
      colorPress: colors.lightText,
      borderColor: colors.lightBorder,
      borderColorFocus: colors.primary,
      borderColorHover: colors.primary,
      placeholderColor: colors.lightTextSecondary,
      primary: colors.primary,
      primaryDark: colors.primaryDark,
      primaryLight: colors.primaryLight,
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
    },
    dark: {
      background: colors.darkBackground,
      backgroundFocus: colors.darkSurface,
      backgroundHover: colors.darkSurface,
      backgroundPress: colors.darkBorder,
      color: colors.darkText,
      colorFocus: colors.darkText,
      colorHover: colors.darkText,
      colorPress: colors.darkText,
      borderColor: colors.darkBorder,
      borderColorFocus: colors.primary,
      borderColorHover: colors.primary,
      placeholderColor: colors.darkTextSecondary,
      primary: colors.primary,
      primaryDark: colors.primaryDark,
      primaryLight: colors.primaryLight,
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
    },
  },
  tokens: {
    ...config.tokens,
    space: {
      ...config.tokens.space,
      xs: spacing.xs,
      sm: spacing.sm,
      md: spacing.md,
      lg: spacing.lg,
      xl: spacing.xl,
      xxl: spacing.xxl,
    },
    radius: {
      ...config.tokens.radius,
      sm: radii.sm,
      md: radii.md,
      lg: radii.lg,
      xl: radii.xl,
      full: radii.full,
    },
    size: {
      ...config.tokens.size,
      xs: fontSizes.xs,
      sm: fontSizes.sm,
      md: fontSizes.md,
      lg: fontSizes.lg,
      xl: fontSizes.xl,
      xxl: fontSizes.xxl,
      xxxl: fontSizes.xxxl,
    },
  },
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
