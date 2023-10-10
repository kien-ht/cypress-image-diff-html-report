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
        <ViewSideBySide
          class="screenshots-bg"
          :row="row"
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

    <el-table-column width="100">
      <template #default="{ row }">
        <el-button
          v-if="row.failed"
          size="small"
          type="success"
          @click="onClickUpdate(row.name)"
        >
          Update
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ElTable } from 'element-plus'
import { useMainStore } from '@/store'

const props = defineProps<{
  suiteId?: string
}>()

const mainStore = useMainStore()

const suite = computed(() => {
  return mainStore.report.suites.find((s) => s.id === props.suiteId)
})

async function onClickUpdate(testName: string) {
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
    /* empty */
  }
}
</script>

<style scoped>
.screenshots-bg {
  background-color: #fff;
  opacity: 0.8;
  background-image: repeating-linear-gradient(
      45deg,
      #f0f0f0 25%,
      transparent 25%,
      transparent 75%,
      #f0f0f0 75%,
      #f0f0f0
    ),
    repeating-linear-gradient(
      45deg,
      #f0f0f0 25%,
      #fff 25%,
      #fff 75%,
      #f0f0f0 75%,
      #f0f0f0
    );
  background-position:
    0 0,
    10px 10px;
  background-size: 20px 20px;
}

:root.dark .screenshots-bg {
  background-color: #181818;
  opacity: 0.8;
  background-image: repeating-linear-gradient(
      45deg,
      #222222 25%,
      transparent 25%,
      transparent 75%,
      #222222 75%,
      #222222
    ),
    repeating-linear-gradient(
      45deg,
      #222222 25%,
      #181818 25%,
      #181818 75%,
      #222222 75%,
      #222222
    );
  background-position:
    0 0,
    10px 10px;
  background-size: 20px 20px;
}
</style>
