<template>
  <el-table
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
        <div class="row">
          <h3 class="label">{{ row.name }}</h3>

          <div class="tag passed">
            <BaseIcon name="checkmark" />
            <span>{{ row.passed }}</span>
          </div>

          <div class="tag failed">
            <BaseIcon name="close" />
            <span>{{ row.failed }}</span>
          </div>
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
  mainStore.report &&
    suiteTableRef.value!.setCurrentRow(mainStore.report.suites[0])

  mainStore.$subscribe(async () => {
    await nextTick()
    suiteTableRef.value!.setCurrentRow(mainStore.report?.suites[0])
  })
})

function onCurrentChange(suite: ResolvedSuite) {
  emit('selected', suite.id)
}
</script>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}

.row > .label {
  flex-basis: 100%;
}

.row > .tag {
  display: flex;
  align-items: center;
}
.row > .tag.passed {
  color: var(--color-success);
}
.row > .tag.failed {
  color: var(--color-danger);
}

/* :deep(:not(.el-table-column--selection)) > .cell {
  padding-left: 0;
} */
</style>
