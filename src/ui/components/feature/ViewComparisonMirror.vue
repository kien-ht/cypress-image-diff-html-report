<template>
  <div class="wrapper">
    <h3 class="title">Baseline</h3>

    <h3 class="title">Comparison</h3>

    <div
      class="screenshot"
      @mousemove="onMouseover"
    >
      <img
        :src="props.test.baselinePath"
        :class="{ 'cell-shadow': Boolean(props.test.baselinePath) }"
      />
    </div>

    <div
      class="screenshot"
      @mousemove="onMouseover"
    >
      <img
        :src="props.test.comparisonPath"
        :class="{ 'cell-shadow': Boolean(props.test.comparisonPath) }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResolvedTest } from '@commonTypes'

interface Position {
  x: string
  y: string
}

const props = defineProps<{
  test: ResolvedTest
}>()

const cursorPosition = reactive<Position>({ x: '0px', y: '0px' })

function onMouseover(e: MouseEvent) {
  cursorPosition.x = e.offsetX - 1 + 'px'
  cursorPosition.y = e.offsetY - 1 + 'px'
}
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.4rem;
}

.wrapper > .title {
  text-align: center;
}
.wrapper > .screenshot {
  position: relative;

  cursor:
    url(../../assets/icons/focus-square.svg) 15 15,
    pointer;
}

.wrapper > .screenshot > img {
  width: 100%;
  height: 100%;

  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.075);
}

.wrapper > .screenshot:after,
.wrapper > .screenshot:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.wrapper > .screenshot:after {
  top: v-bind('cursorPosition.y');
  width: 100%;
  border-top: 1px dashed var(--r-red);
}

.wrapper > .screenshot:before {
  left: v-bind('cursorPosition.x');
  height: 100%;
  border-left: 1px dashed var(--r-red);
}
</style>
