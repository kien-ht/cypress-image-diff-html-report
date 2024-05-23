<template>
  <el-table
    v-loading="mainStore.isLoadingReport"
    style="scroll-behavior: auto; height: auto"
    ref="suiteTableRef"
    :data="mainStore.report?.suites"
    highlight-current-row
    :row-key="(row) => row.id"
    @current-change="onCurrentChange"
  >
    <!-- <el-table-column type="selection" /> -->

    <el-table-column label="Suites">
      <template #default="{ row }">
        <div
          class="row"
          :class="{ 'row--selected': hasSelected(row) }"
        >
          <h3 class="label">{{ row.name }}</h3>

          <el-tag type="success">
            <BaseIcon name="checkmark" />
            <span>{{ row.passed }}</span>
          </el-tag>
          <el-tag type="danger">
            <BaseIcon name="close" />
            <span>{{ row.failed }}</span>
          </el-tag>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import type { ElTable } from 'element-plus'
import { ResolvedSuite } from '@commonTypes'
import { useMainStore } from '@/store'

const emit = defineEmits<{
  selected: [id: string]
}>()

const mainStore = useMainStore()
const suiteTableRef = ref<InstanceType<typeof ElTable>>()

onMounted(() => {
  if (mainStore.report) {
    suiteTableRef.value!.setCurrentRow(mainStore.report.suites[0])
  } else {
    const teardownWatcher = watch(
      () => mainStore.report,
      async () => {
        await nextTick()
        suiteTableRef.value!.setCurrentRow(mainStore.report?.suites[0])
        teardownWatcher()
      }
    )
  }
})

function onCurrentChange(suite: ResolvedSuite) {
  emit('selected', suite.id)
}

function hasSelected(row: ResolvedSuite) {
  return mainStore.selectedTestsFlatten.find((s) => s.specPath === row.path)
}
</script>

<style scoped>
.el-table {
  border-radius: 1rem 1rem 0 0;
}

.el-table :deep(td .cell) {
  padding: 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 0.5rem;
  padding: 0 1.5rem;
  border-left: 3px solid transparent;
}

.row--selected {
  border-left-color: var(--color-primary);
}

.row > .label {
  flex-basis: 100%;
}

.row :deep(.el-tag__content) {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
