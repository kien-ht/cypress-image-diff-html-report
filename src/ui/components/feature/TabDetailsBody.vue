<template>
  <el-table
    style="scroll-behavior: auto; height: auto"
    :data="suite?.tests ?? []"
    default-expand-all
    :row-key="(row) => row.name"
  >
    <!-- <el-table-column type="selection" /> -->

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
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ElTable } from 'element-plus'
import { useMainStore } from '@/store'
import type { default as DialogViewComparison } from './DialogViewComparison.vue'

const props = defineProps<{
  suiteId?: string
}>()

const mainStore = useMainStore()
const dialogViewComparisonRef = ref<InstanceType<
  typeof DialogViewComparison
> | null>()

const suite = computed(() => {
  return mainStore.report.suites.find((s) => s.id === props.suiteId)
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
</script>

<style scoped>
.el-table :deep(td.min-content > .cell) {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
