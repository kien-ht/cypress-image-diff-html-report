<template>
  <el-dialog
    v-model="isVisible"
    fullscreen
    append-to-body
    :destroy-on-close="true"
    class="dialog-screenshot-view"
  >
    <el-descriptions
      title="Details View"
      :column="5"
      border
    >
      <el-descriptions-item label="Suite">
        {{ currentTest?.specFilename }}
      </el-descriptions-item>

      <el-descriptions-item label="Test">
        {{ currentTest?.name }}
      </el-descriptions-item>

      <el-descriptions-item label="Status">
        <el-tag
          v-if="currentTest?.failed"
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
      </el-descriptions-item>

      <el-descriptions-item label="Actual">
        {{ ((currentTest?.percentage ?? 0) * 100).toFixed(2) }}%
      </el-descriptions-item>

      <el-descriptions-item label="Failure Threshold">
        {{ ((currentTest?.failureThreshold ?? 0) * 100).toFixed(2) }}%
      </el-descriptions-item>
    </el-descriptions>

    <div class="action">
      <el-radio-group v-model="currentMode">
        <el-radio-button
          v-for="tab in tabItems"
          :key="tab.value"
          :label="tab.value"
          :disabled="tab.disabled"
          border
        >
          {{ tab.label }}
        </el-radio-button>
      </el-radio-group>

      <el-button
        v-if="currentTest?.failed"
        type="success"
        @click="onClickUpdate"
      >
        <BaseIcon name="checkmark" />
        <span>Update</span>
      </el-button>
    </div>

    <ViewComparison
      class="screenshot-wrapper-bg"
      :mode="currentMode"
      :test="currentTest!"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ViewComparisonMode } from '@/types'
import { ResolvedTest } from '@commonTypes'

interface TabItem {
  label: string
  value: ViewComparisonMode
  icon: string
  disabled: boolean
}

const emit = defineEmits<{
  updated: [testName: string, close: () => void]
}>()

const isVisible = ref(false)
const currentTest = ref<ResolvedTest | undefined>()
const currentMode = ref<ViewComparisonMode>('carousel')
const tabItems: ComputedRef<TabItem[]> = computed(() => [
  {
    label: 'Carousel',
    value: 'carousel',
    icon: 'settings',
    disabled: false
  },
  {
    label: 'Slider',
    value: 'slider',
    icon: 'settings',
    disabled:
      !currentTest.value?.baselinePath || !currentTest.value?.comparisonPath
  },
  {
    label: 'Mirror',
    value: 'mirror',
    icon: 'settings',
    disabled:
      !currentTest.value?.baselinePath || !currentTest.value?.comparisonPath
  }
])

function open(test: ResolvedTest) {
  isVisible.value = true
  currentTest.value = test
  currentMode.value = 'carousel'
}

function onClickUpdate() {
  emit('updated', currentTest.value!.name, () => {
    isVisible.value = false
  })
}

defineExpose({
  open
})
</script>

<style scoped>
:global(.dialog-screenshot-view) {
  display: flex;
  flex-direction: column;
}

:global(.dialog-screenshot-view > .el-dialog__body) {
  flex: 1 1 auto;
  padding: 0 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
