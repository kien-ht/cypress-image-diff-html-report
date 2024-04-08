<template>
  <div class="screenshots">
    <BaseImage
      class="screenshots-cell"
      :class="{ 'cell-shadow': Boolean(resolvedTest.baselinePath) }"
      :src="resolvedTest.baselinePath"
    >
      <template #placeholder>
        <img
          style="width: 30%"
          :draggable="false"
          src="@/assets/images/empty.png"
        />
        <span>Not found</span>
      </template>
    </BaseImage>

    <BaseImage
      class="screenshots-cell"
      :class="{ 'cell-shadow': Boolean(resolvedTest.diffPath) }"
      :src="resolvedTest.diffPath"
    >
      <template #placeholder>
        <img
          style="width: 30%"
          :draggable="false"
          src="@/assets/images/no-visual-changes.png"
        />
        <span>No visual changes</span>
      </template>
    </BaseImage>

    <BaseImage
      class="screenshots-cell"
      :class="{ 'cell-shadow': Boolean(resolvedTest.comparisonPath) }"
      :src="resolvedTest.comparisonPath"
    >
      <template #placeholder>
        <img
          style="width: 30%"
          :draggable="false"
          src="@/assets/images/empty.png"
        />
        <span>Not found</span>
      </template>
    </BaseImage>
  </div>
</template>

<script setup lang="ts">
import { ResolvedTest } from '@commonTypes'

const props = defineProps<{
  test: ResolvedTest
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
</script>

<style scoped>
.screenshots {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.4rem;
}

.screenshots > .screenshots-cell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);

  max-height: 20rem;
}

.cell-shadow > :deep(.image) {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.075);
}
</style>
