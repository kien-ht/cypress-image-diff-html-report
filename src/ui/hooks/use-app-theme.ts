import { AppTheme } from '@/types'
import { useStorage } from './use-storage'

const mediaColorScheme = window.matchMedia('(prefers-color-scheme: dark)')

export function useAppTheme() {
  const [savedTheme, setSavedTheme] = useStorage<AppTheme>('theme', 'system')

  function setTheme(type?: AppTheme) {
    const theme = type ?? savedTheme.value
    setSavedTheme(theme)

    if (theme === 'light') {
      mediaColorScheme.removeEventListener('change', toggleTheme)
      return document.documentElement.classList.remove('dark')
    }

    if (theme === 'dark') {
      mediaColorScheme.removeEventListener('change', toggleTheme)
      return document.documentElement.classList.add('dark')
    }

    if (theme === 'system' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      mediaColorScheme.addEventListener('change', toggleTheme)
    }
  }

  return {
    theme: savedTheme,
    setTheme
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark')
}
