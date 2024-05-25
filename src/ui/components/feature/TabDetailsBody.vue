<template>
  <el-table
    ref="testTableRef"
    v-loading="mainStore.isLoadingReport"
    style="scroll-behavior: auto; height: auto"
    :data="suite?.tests ?? []"
    default-expand-all
    :row-key="(row) => row.name"
    @selection-change="onSelectionChange"
  >
    <el-table-column
      v-if="mainStore.mode !== 'static'"
      type="selection"
      width="40"
      :selectable="(row) => Boolean(row.diffDataUrl)"
    />

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
    >
      <template #default="{ row }">
        <span>{{ (row.percentage * 100).toFixed(2) }}%</span>
      </template>
    </el-table-column>

    <el-table-column
      label="Failure Threshold"
      width="140"
    >
      <template #default="{ row }">
        <span>{{ (row.failureThreshold * 100).toFixed(2) }}%</span>
      </template>
    </el-table-column>

    <el-table-column class-name="min-content">
      <template
        v-if="mainStore.mode !== 'static'"
        #header
      >
        <div
          v-if="mainStore.selectedTestsFlatten.length"
          class="actions"
        >
          <i v-if="mainStore.selectedTestsFlatten.length === 1"
            >{{ mainStore.selectedTestsFlatten.length }} test selected
          </i>
          <i v-else
            >{{ mainStore.selectedTestsFlatten.length }} tests selected
          </i>
          <el-button
            size="small"
            type="success"
            @click="isDialogApprovalListVisible = true"
          >
            <span>See Approval List</span>
          </el-button>
        </div>

        <div
          v-else
          class="actions"
        >
          <i>No tests selected</i>
          <el-button
            size="small"
            type="success"
            disabled
          >
            <span>See Approval List</span>
          </el-button>
        </div>
      </template>
      <template #default="{ row }">
        <el-button
          size="small"
          type="primary"
          @click="dialogViewComparisonRef!.open(row)"
        >
          <BaseIcon name="inspect" />
          <span style="margin-left: 0.5rem">Inspect</span>
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <DialogViewComparison
    ref="dialogViewComparisonRef"
    @selected="doSelectedToggle"
  />

  <DialogApprovalList
    v-model:show="isDialogApprovalListVisible"
    @deselected="doDeselected"
    @submitted="testTableRef?.clearSelection"
  />
</template>

<script lang="ts" setup>
import type { ElTable } from 'element-plus'
import { useMainStore } from '@/store'
import type { default as DialogViewComparison } from './DialogViewComparison.vue'
import { TestStatus, ResolvedTest } from '@commonTypes'

const props = defineProps<{
  suiteId?: string
}>()

const fitlerStatuses: { text: string; value: TestStatus }[] = [
  { text: 'Fail', value: 'fail' },
  { text: 'Pass', value: 'pass' }
]

const mainStore = useMainStore()
const dialogViewComparisonRef = ref<InstanceType<
  typeof DialogViewComparison
> | null>()
const isDialogApprovalListVisible = ref(false)

const suite = computed(() => {
  return mainStore.displayReport.suites.find((s) => s.id === props.suiteId)
})

const testTableRef = ref<InstanceType<typeof ElTable>>()
watch(() => props.suiteId, restoreSelection)

function onSelectionChange(selections: ResolvedTest[]) {
  if (selections.length) {
    mainStore.selectedTests.set(props.suiteId!, selections)
  } else {
    mainStore.selectedTests.delete(props.suiteId!)
  }
}

async function restoreSelection() {
  const selections = mainStore.selectedTests.get(props.suiteId!)
  if (selections) {
    await nextTick()
    selections.forEach((row) =>
      testTableRef.value!.toggleRowSelection(row, true)
    )
  }
}

function doSelectedToggle(testName: string, toAdd: boolean) {
  const foundTest = suite.value!.tests.find((t) => t.name === testName)!
  testTableRef.value!.toggleRowSelection(foundTest, toAdd)
}

function doDeselected(row: ResolvedTest) {
  let foundTest = suite.value!.tests.find((t) => t.name === row.name)
  if (foundTest) return doSelectedToggle(row.name, false)

  const tests = mainStore.selectedTests
    .get(row.specPath)!
    .filter((t) => t.name !== row.name)
  tests.length === 0
    ? mainStore.selectedTests.delete(row.specPath)
    : mainStore.selectedTests.set(row.specPath, tests)
}
</script>

<style scoped>
.el-table {
  border-radius: 1rem 1rem 0 0;
}

.el-table :deep(.min-content > .cell) {
  padding-right: 14px;
  display: flex;
  justify-content: right;
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
.actions {
  display: flex;
  gap: 1rem;
}
.actions > i {
  text-decoration: underline;
  text-underline-offset: 2px;
  font-size: 12px;
}
</style>
