<template>
  <el-dialog
    v-model="isVisible"
    fullscreen
    append-to-body
    :destroy-on-close="true"
    class="dialog-custom"
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
          :value="tab.value"
          :disabled="tab.disabled"
          border
        >
          <BaseIcon :name="tab.icon" />
          <span>{{ tab.label }}</span>
        </el-radio-button>
      </el-radio-group>

      <template v-if="mainStore.mode !== 'static' && currentTest?.diffDataUrl">
        <el-button
          v-if="hasAddedToApprovalList"
          type="danger"
          @click="onClickUpdate(false)"
        >
          <BaseIcon name="minus" />
          <span style="margin-left: 4px">Remove From Approval List</span>
        </el-button>

        <el-button
          v-else
          type="success"
          @click="onClickUpdate(true)"
        >
          <BaseIcon name="plus" />
          <span style="margin-left: 4px">Add To Approval List</span>
        </el-button>
      </template>
    </div>

    <ViewComparison
      class="screenshot-wrapper-bg"
      :mode="currentMode"
      :test="currentTest!"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store'
import { ViewComparisonMode } from '@/types'
import { ResolvedTest } from '@commonTypes'
import { SvgIcon } from '../shared/base-icon/types'

interface TabItem {
  label: string
  value: ViewComparisonMode
  icon: SvgIcon
  disabled: boolean
}

const emit = defineEmits<{
  selected: [testName: string, toAdd: boolean]
}>()

const mainStore = useMainStore()
const isVisible = ref(false)
const currentTest = ref<ResolvedTest | undefined>()
const currentMode = ref<ViewComparisonMode>('carousel')
const tabItems: ComputedRef<TabItem[]> = computed(() => [
  {
    label: 'Carousel',
    value: 'carousel',
    icon: 'carousel',
    disabled: false
  },
  {
    label: 'Slider',
    value: 'slider',
    icon: 'slider',
    disabled:
      !currentTest.value?.baselineDataUrl ||
      !currentTest.value?.comparisonDataUrl
  },
  {
    label: 'Mirror',
    value: 'mirror',
    icon: 'mirror',
    disabled:
      !currentTest.value?.baselineDataUrl ||
      !currentTest.value?.comparisonDataUrl
  }
])

const hasAddedToApprovalList = computed(() =>
  mainStore.selectedTestsFlatten.find((s) => s === currentTest.value)
)

function open(test: ResolvedTest) {
  isVisible.value = true
  currentTest.value = test
  currentMode.value = 'carousel'
}

function onClickUpdate(toAdd: boolean) {
  emit('selected', currentTest.value!.name, toAdd)
  isVisible.value = false
}

defineExpose({
  open
})
</script>

<style scoped>
.action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-radio-button__inner) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
</style>
