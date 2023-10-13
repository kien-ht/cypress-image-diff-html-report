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
  const random = Date.now()
  return {
    ...props.test,
    baselinePath: props.test.baselinePath
      ? `${props.test.baselinePath}?v=${random}`
      : '',
    diffPath: props.test.diffPath ? `${props.test.diffPath}?v=${random}` : '',
    comparisonPath: props.test.comparisonPath
      ? `${props.test.comparisonPath}?v=${random}`
      : ''
  }
})

const componentMap: Partial<Record<ViewComparisonMode, Component>> = {
  carousel: ViewComparisonCarousel,
  slider: ViewComparisonSlider,
  mirror: ViewComparisonMirror
}

const currentComponent = computed(() => componentMap[props.mode])
</script>

<style scoped></style>
