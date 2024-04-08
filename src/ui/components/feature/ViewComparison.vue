<template>
  <component
    :is="currentComponent"
    :test="resolvedTest"
  />
</template>

<script setup lang="ts">
import { ResolvedTest } from '@commonTypes'
import type { ViewComparisonMode } from '@/types'
import { default as ViewComparisonCarousel } from './ViewComparisonCarousel.vue'
import { default as ViewComparisonSlider } from './ViewComparisonSlider.vue'
import { default as ViewComparisonMirror } from './ViewComparisonMirror.vue'

const props = defineProps<{
  test: ResolvedTest
  mode: ViewComparisonMode
}>()

const resolvedTest = computed<ResolvedTest>(() => {
  return {
    ...props.test,
    baselinePath: versionizePath(props.test.baselinePath),
    diffPath: versionizePath(props.test.diffPath),
    comparisonPath: versionizePath(props.test.comparisonPath)
  }
})

function versionizePath(path: string): string {
  if (path && path.startsWith('data:image/png;base64,')) return path

  if (path) {
    const random = Date.now()
    return `${path}?v=${random}`
  }

  return ''
}

const componentMap: Partial<Record<ViewComparisonMode, Component>> = {
  carousel: ViewComparisonCarousel,
  slider: ViewComparisonSlider,
  mirror: ViewComparisonMirror
}

const currentComponent = computed(() => componentMap[props.mode])
</script>

<style scoped></style>
