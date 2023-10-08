export enum TabValue {
  Dashboard = 'Dashboard',
  Details = 'Details',
  Settings = 'Settings'
}

export type AppTheme = 'light' | 'dark' | 'system'

export type StorageKey = 'theme'

export interface RadioWithThumbnailOption<T> {
  thumbnail: string
  label: string
  value: T
}
