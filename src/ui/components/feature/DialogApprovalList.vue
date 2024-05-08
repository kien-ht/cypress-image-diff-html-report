<template>
  <el-dialog
    v-model="isVisible"
    append-to-body
    class="dialog-custom"
    lock-scroll
  >
    <h3 class="dialog-title">Approval List</h3>

    <el-table
      style="min-width: 50vw"
      :data="mainStore.selectedTestsFlatten"
      :row-key="(row) => row.name"
    >
      <el-table-column
        label="New Snapshot"
        width="160"
      >
        <template #default="{ row }">
          <BaseImage
            class="preivew-snapshot"
            :src="row.comparisonDataUrl"
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
    </el-table>

    <el-button
      v-if="mainStore.mode === 'local'"
      type="success"
      style="margin-top: 2rem"
      @click="onClickUpdateLocal"
    >
      <span>Update All</span>
    </el-button>

    <template v-else-if="mainStore.mode === 'ci'">
      <p style="max-width: 760px">
        <span style="color: red">*</span> You are about to commit and push all
        of these new snapshots to the
        <span class="highlight">{{ route.query.ref }}</span> branch of the
        GitHub repository <span class="highlight">{{ route.query.repo }}</span
        >. Make sure you double-check before proceeding.
      </p>

      <el-button
        type="success"
        style="margin-top: 2rem"
        @click="onClickUpdateCi"
      >
        <span>Commit And Push All</span>
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export interface DialogApprovalListProps {
  show: boolean
}

export interface DialogApprovalListEmits {
  (e: 'update:show', show: boolean): void
  (e: 'submitted'): void
}
</script>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useMainStore } from '@/store'
import { ElMessage } from 'element-plus'
import { updateBaselines, updateTests } from '@/service'
import { WorkflowInstance } from '@commonTypes'

const props = defineProps<DialogApprovalListProps>()
const emit = defineEmits<DialogApprovalListEmits>()

const route = useRoute()
const mainStore = useMainStore()
const isVisible = computed({
  get: () => props.show,
  set: (newValue) => emit('update:show', newValue)
})

async function onClickUpdateLocal() {
  try {
    const testIds = mainStore.selectedTestsFlatten.map((s) => ({
      specPath: s.specPath,
      name: s.name
    }))
    await updateTests(testIds)

    mainStore.selectedTests = new Map()
    emit('submitted')
    ElMessage({
      type: 'success',
      message: 'Updated'
    })
  } catch (err) {
    ElMessage({
      type: 'error',
      message: (err as Error).message
    })
  }
  isVisible.value = false
}

async function onClickUpdateCi() {
  try {
    await updateBaselines({
      instance: route.query as unknown as WorkflowInstance,
      snapshots: mainStore.selectedTestsFlatten.map((s) => ({
        baselinePath: s.baselinePath,
        comparisonDataUrl: s.comparisonDataUrl!
      }))
    })

    mainStore.selectedTests = new Map()
    emit('submitted')
    ElMessage({
      type: 'success',
      message: 'Updated'
    })
  } catch (err) {
    ElMessage({
      type: 'error',
      message: (err as Error).message
    })
  }
  isVisible.value = false
}
</script>

<style scoped>
.dialog-title {
  font-size: 16px;
  text-align: center;
  margin-bottom: 1rem;
}
.preivew-snapshot {
  height: 80px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.highlight {
  background-color: var(--color-background-mute);
  padding: 2px;
  border-radius: 4px;
  font-weight: bold;
  font-style: italic;
}
</style>
