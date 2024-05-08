<template>
  <div class="wrapper">
    <h3 style="text-transform: capitalize">
      {{ currentScreenshot?.type ?? screenshots[0]?.type }}
    </h3>

    <el-carousel
      :autoplay="false"
      arrow="always"
      trigger="click"
      height="100%"
      @change="onChange"
    >
      <el-carousel-item
        v-for="(screenshot, key) in screenshots"
        :key="key"
      >
        <img :src="screenshot.url" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { ResolvedTest } from '@commonTypes'
import type { Screenshot } from '@/types'

const props = defineProps<{
  test: ResolvedTest
}>()

const screenshots = computed(() => {
  const images: Screenshot[] = []
  props.test.baselineDataUrl &&
    images.push({ type: 'baseline', url: props.test.baselineDataUrl })
  props.test.diffDataUrl &&
    images.push({ type: 'diff', url: props.test.diffDataUrl })
  props.test.comparisonDataUrl &&
    images.push({ type: 'comparison', url: props.test.comparisonDataUrl })
  return images
})

const currentScreenshot = ref<Screenshot>()

function onChange(index: number) {
  currentScreenshot.value = screenshots.value[index]
}
</script>

<style scoped>
.wrapper {
  flex: 1 1 auto;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.el-carousel {
  overflow-y: visible;
  width: 100%;
  height: 100%;
}
.el-carousel > :deep(.el-carousel__container) {
  overflow-y: visible !important;
}
.el-carousel :deep(.el-carousel__item) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: visible;
}
.el-carousel :deep(.el-carousel__item > img) {
  height: 100%;
  width: 100%;
  object-fit: contain;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.075);
}
</style>
