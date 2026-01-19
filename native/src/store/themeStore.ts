import { create } from 'zustand'
import { useColorScheme } from 'react-native'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeStore {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  getEffectiveTheme: () => 'light' | 'dark'
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
  getEffectiveTheme: () => {
    const { mode } = get()
    if (mode === 'system') {
      const systemScheme = useColorScheme()
      return systemScheme === 'dark' ? 'dark' : 'light'
    }
    return mode
  },
}))
