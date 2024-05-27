<template>
  <div class="wrapper">
    <h3 class="title">Baseline</h3>

    <h3 class="title">Comparison</h3>

    <div
      class="screenshot"
      @mousemove="onMouseover"
    >
      <img
        :src="props.test.baselineDataUrl"
        :class="{ 'cell-shadow': Boolean(props.test.baselineDataUrl) }"
      />
    </div>

    <div
      class="screenshot"
      @mousemove="onMouseover"
    >
      <img
        :src="props.test.comparisonDataUrl"
        :class="{ 'cell-shadow': Boolean(props.test.comparisonDataUrl) }"
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
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDkwLjI1NCA0OTAuMjU0IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IiNmNTZjNmMiPjxwYXRoIGQ9Ik0wIDEwLjM3MmguOTM2Vi45NDRoOS40MjlWLjAwOEgwWm0uOTM2IDkuMjU2SDB2MTAuMzY0aDEwLjM2NXYtLjkzNkguOTM2Wk0xOS42MzUuMDA4di45MzZoOS40Mjl2OS40MjhIMzBWLjAwOFptOS40MjkgMjkuMDQ4aC05LjQyOXYuOTM2SDMwVjE5LjYyOGgtLjkzNloiLz48L3N2Zz4K)
      15 15,
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
