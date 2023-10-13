<template>
  <div class="wrapper">
    <div class="title-wrapper">
      <h3 style="text-align: right">Baseline</h3>
      <h3>Comparison</h3>
    </div>

    <div
      class="wrapper"
      style="align-self: stretch"
    >
      <div class="screenshot-slider">
        <img
          class="baseline"
          draggable="false"
          :src="screenshots.baseline"
        />

        <img
          class="comparison"
          draggable="false"
          :src="screenshots.comparison"
        />

        <input
          type="range"
          class="slider-range"
          min="0"
          max="100"
          v-model="currentSlide"
        />

        <div class="slider-divider"></div>

        <div class="slider-button">
          <BaseIcon name="resize" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResolvedTest } from '@commonTypes'

const props = defineProps<{
  test: ResolvedTest
}>()

const screenshots = computed(() => ({
  baseline: props.test.baselinePath,
  comparison: props.test.comparisonPath
}))

const currentSlide = ref('50')
const currentSlidePercentage = computed(() => currentSlide.value + '%')
</script>

<style scoped>
.wrapper {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  padding-bottom: 0 !important;
}

.title-wrapper {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.title-wrapper > h3 {
  padding: 0 1rem;
}
.title-wrapper > h3:first-child {
  border-right: 1px solid var(--color-text);
}
.title-wrapper > h3:last-child {
  border-left: 1px solid var(--color-text);
}
.screenshot-slider {
  position: absolute;
  height: calc(100% - 2 * 1.4rem);
  margin: 1.4rem;
}

.baseline,
.comparison {
  height: 100%;
  width: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;

  user-select: none;
}
.baseline {
  position: relative;
}
.comparison {
  clip-path: polygon(
    100% 0%,
    v-bind(currentSlidePercentage) 0%,
    v-bind(currentSlidePercentage) 100%,
    100% 100%
  );
}
.slider-range {
  opacity: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
.slider-range::-moz-range-thumb {
  cursor: ew-resize;
}
.slider-range::-webkit-slider-thumb {
  cursor: ew-resize;
}

.slider-divider {
  height: 100%;
  width: 2px;
  background-color: var(--color-background-danger-soft);
  position: absolute;
  top: 0;
  left: calc((v-bind('currentSlide') / 100) * 100%);
  transform: translateX(-50%);
  pointer-events: none;
}

.slider-button {
  position: absolute;
  background-color: var(--color-background-danger-soft);
  color: var(--r-white-mute);
  padding: 1rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  top: 50%;
  left: calc((v-bind('currentSlide') / 100) * 100%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
