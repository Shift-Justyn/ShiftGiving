import { colors } from './tokens'

export const lightTheme = {
  background: colors.lightBackground,
  surface: colors.lightSurface,
  text: colors.lightText,
  textSecondary: colors.lightTextSecondary,
  border: colors.lightBorder,
  primary: colors.primary,
  primaryDark: colors.primaryDark,
  primaryLight: colors.primaryLight,
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
}

export const darkTheme = {
  background: colors.darkBackground,
  surface: colors.darkSurface,
  text: colors.darkText,
  textSecondary: colors.darkTextSecondary,
  border: colors.darkBorder,
  primary: colors.primary,
  primaryDark: colors.primaryDark,
  primaryLight: colors.primaryLight,
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
}

export type Theme = typeof lightTheme
