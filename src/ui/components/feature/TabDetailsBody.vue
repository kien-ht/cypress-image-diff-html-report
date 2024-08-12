<template>
  <el-table
    ref="tableRef"
    style="scroll-behavior: auto; height: auto"
    :data="suite?.tests ?? []"
    default-expand-all
    :row-key="(row) => row.name"
    @header-click="onHeaderClick"
  >
    <el-table-column type="expand">
      <template #default="{ row }">
        <TabDetailsBodyExpand
          class="screenshot-wrapper-bg"
          :test="row"
        />
      </template>
    </el-table-column>

    <el-table-column
      label="Test"
      property="name"
    />

    <el-table-column
      label="Status"
      width="100"
      :filters="fitlerStatuses"
      :filter-method="
        (value: TestStatus, row: ResolvedTest) => row.status === value
      "
    >
      <template #default="{ row }">
        <el-tag
          v-if="row.failed"
          type="danger"
        >
          Fail
        </el-tag>
        <el-tag
          v-else
          type="success"
        >
          Pass
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column
      label="Actual"
      width="100"
      sortable
      property="percentage"
      :sort-orders="['descending', 'ascending', null]"
    >
      <template #default="{ row }">
        <span>{{ (row.percentage * 100).toFixed(2) }}%</span>
      </template>
    </el-table-column>

    <el-table-column
      label="Failure Threshold"
      width="164"
      sortable
      property="failureThreshold"
      :sort-orders="['descending', 'ascending', null]"
    >
      <template #default="{ row }">
        <span>{{ (row.failureThreshold * 100).toFixed(2) }}%</span>
      </template>
    </el-table-column>

    <el-table-column
      width="70"
      class-name="min-content"
    >
      <template #default="{ row }">
        <el-button
          size="small"
          type="primary"
          plain
          @click="dialogViewComparisonRef!.open(row)"
        >
          <BaseIcon name="eye" />
          <span style="margin-left: 0.5rem">View</span>
        </el-button>
      </template>
    </el-table-column>

    <el-table-column
      width="112"
      class-name="min-content"
    >
      <template #default="{ row }">
        <el-button
          v-if="row.failed"
          size="small"
          type="success"
          @click="onClickUpdate(row.name)"
        >
          <BaseIcon name="checkmark" />
          <span>Update</span>
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <DialogViewComparison
    ref="dialogViewComparisonRef"
    @updated="doUpdated"
  />
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, type ElTable } from 'element-plus'
import { useMainStore } from '@/store'
import type { default as DialogViewComparison } from './DialogViewComparison.vue'
import { TestStatus, ResolvedTest } from '@commonTypes'

const props = defineProps<{
  suiteId?: string
}>()

const mainStore = useMainStore()
const dialogViewComparisonRef = ref<InstanceType<
  typeof DialogViewComparison
> | null>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const fitlerStatuses: { text: string; value: TestStatus }[] = [
  { text: 'Fail', value: 'fail' },
  { text: 'Pass', value: 'pass' }
]

const suite = computed(() => {
  return mainStore.displayReport.suites.find((s) => s.id === props.suiteId)
})

async function onClickUpdate(testName: string, throwError = false) {
  try {
    await ElMessageBox.confirm(
      'Update this baseline screenshot. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    await mainStore.updateTest({ suiteId: props.suiteId!, name: testName })

    ElMessage({
      type: 'success',
      message: 'Updated'
    })
  } catch {
    if (throwError) {
      throw Error()
    }
  }
}

async function doUpdated(testName: string, close: () => void) {
  try {
    await onClickUpdate(testName, true)
    close()
  } catch {
    /* empty */
  }
}

function onHeaderClick(column: any) {
  if (!column.sortable) return

  if (column.order === null) return tableRef.value?.clearSort()
  tableRef.value?.sort(column.property, column.order)
}
</script>

<style scoped>
.el-table :deep(td.min-content > .cell) {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-header {
  display: flex;
  align-items: center;
  padding: 4px 0;
}
.filter-header > .active {
  color: var(--color-primary);
}
.el-dropdown {
  color: unset;
  cursor: pointer;
}
:deep(.el-dropdown-menu__item) {
  display: flex;
  justify-content: space-between;
  min-width: 96px;
}
:deep(.el-dropdown-menu__item.el-dropdown-item--active) {
  color: var(--color-primary);
}
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  color: unset;
}
</style>
