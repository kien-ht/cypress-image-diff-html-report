<template>
  <div class="screenshots">
    <BaseImage
      class="screenshots-cell"
      :class="{ 'cell-shadow': Boolean(props.row.baselinePath) }"
      :src="props.row.baselinePath"
    >
      <template #placeholder>
        <img
          style="width: 30%"
          src="@/assets/images/empty.png"
        />
        <span>Not found</span>
      </template>
    </BaseImage>

    <BaseImage
      class="screenshots-cell"
      :class="{ 'cell-shadow': Boolean(props.row.diffPath) }"
      :src="props.row.diffPath"
    >
      <template #placeholder>
        <img
          style="width: 30%"
          src="@/assets/images/no-visual-changes.png"
        />
        <span>No visual changes</span>
      </template>
    </BaseImage>

    <BaseImage
      class="screenshots-cell"
      :class="{ 'cell-shadow': Boolean(props.row.comparisonPath) }"
      :src="props.row.comparisonPath"
    >
      <template #placeholder>
        <img
          style="width: 30%"
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
  row: ResolvedTest
}>()
</script>

<style scoped>
.screenshots {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.4rem;
  padding: 1.4rem;
}

.screenshots > .screenshots-cell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.cell-shadow > :deep(.image) {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.075);
}
</style>
