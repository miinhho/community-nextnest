export type ThemeType = 'light' | 'dark' | 'system'

type ThemeInfo = {
  name: string
}

export const THEMES: Record<ThemeType, ThemeInfo> = {
  light: {
    name: 'Light',
  },
  dark: {
    name: 'Dark',
  },
  system: {
    name: 'system',
  },
}
