<template>
  <div class="wrapper">
    <h2 class="title">Settings</h2>
    <p>
      Here you will find your local settings which are saved in your browser.
    </p>

    <h3 class="title">Theme</h3>
    <p>Choose how Cypress Image Diff Html Report looks to you.</p>

    <RadioWithThumbnail
      :options="themeOptions"
      :model-value="theme"
      @update:model-value="(v) => setTheme(v)"
    />
  </div>
</template>

<script lang="ts" setup>
import { RadioWithThumbnailOption, AppTheme } from '@/types'
import { useAppTheme } from '@/hooks'

const { theme, setTheme } = useAppTheme()

const themeOptions: RadioWithThumbnailOption<AppTheme>[] = [
  {
    label: 'System Default',
    value: 'system',
    thumbnail: new URL(
      '@/assets/images/settings/theme-system.png',
      import.meta.url
    ).href
  },
  {
    label: 'Light',
    value: 'light',
    thumbnail: new URL(
      '@/assets/images/settings/theme-light.png',
      import.meta.url
    ).href
  },
  {
    label: 'Dark',
    value: 'dark',
    thumbnail: new URL(
      '@/assets/images/settings/theme-dark.png',
      import.meta.url
    ).href
  }
]
</script>

<style scoped>
.wrapper {
  display: grid;
  gap: 1rem;
  margin: 0 16.66%;
  padding: 0 3rem 3rem 3rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.wrapper > .title {
  margin-top: 2rem;
  font-weight: bold;
}
</style>
