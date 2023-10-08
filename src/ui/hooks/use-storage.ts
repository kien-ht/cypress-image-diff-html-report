import { StorageKey } from '@/types'
import type { ShallowRef } from 'vue'

const storageMap = new Map<StorageKey, ShallowRef>()

export function useStorage<T>(
  key: StorageKey,
  fallbackValue: T
): [ShallowRef<T>, (value: T) => void] {
  if (storageMap.has(key) === false) {
    storageMap.set(key, shallowRef(fallbackValue))
  }
  const storage = storageMap.get(key) as ShallowRef<T>
  const savedValue = getItem(key)

  if (savedValue) {
    storage.value = savedValue
  } else {
    setStorage(fallbackValue)
  }

  function getItem(key: string): T | null {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '')
    } catch {
      return null
    }
  }

  function setStorage(value: T) {
    storage.value = value
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [storage, setStorage]
}
