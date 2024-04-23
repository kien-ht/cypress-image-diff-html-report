import { StorageKey } from '@/types'
import { TestStatus } from '@commonTypes'

export const ALL_STORAGE_KEY: Record<StorageKey, string> = {
  theme: 'theme'
}

export const DEFAULT_FITLER_STATUS: TestStatus[] = ['pass', 'fail']
