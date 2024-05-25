<template>
  <header class="header">
    <img
      style="height: 4rem"
      src="@/assets/images/cypress-image-diff-logo.png"
    />

    <h1 style="font-weight: bold">Cypress Image Diff HTML Report</h1>

    <el-tooltip
      v-if="mainStore.mode === 'static'"
      placement="bottom"
    >
      <template #content>
        <p style="max-width: 20rem">
          Static mode supports report viewing only. Switch to serve mode from
          your local server if you want to use all the features.
        </p>
      </template>

      <el-tag type="warning">Static</el-tag>
    </el-tooltip>
  </header>

  <main class="main">
    <el-tabs v-model="activeTab">
      <el-tab-pane :name="TabValue.Details">
        <template #label>
          <span class="label-wrapper">
            <BaseIcon
              name="task"
              style="margin: 0 -0.5rem"
            />
            <span>Details</span>
          </span>
        </template>

        <TabDetails />
      </el-tab-pane>

      <el-tab-pane :name="TabValue.Settings">
        <template #label>
          <span class="label-wrapper">
            <BaseIcon name="settings" />
            <span>Settings</span>
          </span>
        </template>

        <TabSettings />
      </el-tab-pane>
    </el-tabs>

    <el-skeleton
      :loading="mainStore.isLoadingReport"
      animated
      style="width: 40rem"
    >
      <template #template>
        <el-skeleton-item
          variant="text"
          style="width: 70%"
        />
        <el-skeleton-item
          variant="text"
          style="width: 60%"
        />
        <el-skeleton-item variant="text" />
      </template>

      <div class="information-box">
        <div class="progress">
          <div class="progress__statistics">
            <div
              class="progress__statistics-cell"
              style="color: var(--color-success)"
            >
              <el-progress
                class="custom-el-progress-reverse"
                :percentage="passPercentage"
                :show-text="false"
                color="var(--color-success)"
              />
              <span style="width: 80px; font-weight: bold">
                {{ mainStore.report?.totalPassed }}
                <template v-if="mainStore.report?.totalPassed === 1">
                  Pass
                </template>
                <template v-else>Passes</template>
              </span>
            </div>
            <div
              class="progress__statistics-cell"
              style="color: var(--color-danger)"
            >
              <el-progress
                class="custom-el-progress-reverse"
                :percentage="failPercentage"
                :show-text="false"
                color="var(--color-danger)"
              />
              <span style="width: 80px; font-weight: bold">
                {{ mainStore.report?.totalFailed }}
                <template v-if="mainStore.report?.totalFailed === 1">
                  Fail
                </template>
                <template v-else>Fails</template>
              </span>
            </div>
          </div>

          <span style="line-height: 50px; color: var(--color-primary)">
            {{ mainStore.report?.total }}
            <template v-if="mainStore.report?.total === 1">Test</template>
            <template v-else>Tests</template>
          </span>

          <el-progress
            type="dashboard"
            :percentage="passPercentage"
            :color="[
              { color: 'var(--color-danger)', percentage: 50 },
              { color: 'var(--color-warning)', percentage: 90 },
              { color: 'var(--color-success)', percentage: 100 }
            ]"
            :width="50"
          >
            <span>{{ passPercentage.toFixed() }}%</span>
          </el-progress>
        </div>

        <div class="general-info">
          <BaseIcon name="timer" />
          <span>{{ dayjs(mainStore.report?.endedAt).fromNow() }}</span>

          <template v-if="browser">
            <img
              :src="browserIconMap[browser]"
              height="20"
              style="margin-left: 2rem"
            />
            <span>{{ mainStore.report?.browserVersion }}</span>
          </template>

          <img
            src="@/assets/images/cypress.png"
            height="20"
            style="margin-left: 2rem"
          />
          <span>{{ mainStore.report?.cypressVersion }}</span>
        </div>
      </div>
    </el-skeleton>
  </main>
</template>

<script lang="ts">
export type Browser = 'chrome' | 'edge' | 'firefox' | 'safari' | 'electron'
</script>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useMainStore } from '@/store'
import { TabValue } from '@/types'
import { useAppTheme } from '@/hooks'
import { WorkflowInstance } from '@commonTypes'
import chrome from '@/assets/images/chrome.png'
import edge from '@/assets/images/edge.png'
import firefox from '@/assets/images/firefox.png'
import safari from '@/assets/images/safari.png'
import electron from '@/assets/images/electron.png'

dayjs.extend(relativeTime)

const mainStore = useMainStore()
const { setTheme } = useAppTheme()
const activeTab = ref<keyof typeof TabValue>('Details')

setTheme()

const route = useRoute()
mainStore.fetchReport(route.query as unknown as WorkflowInstance)

const browserIconMap: Record<Browser, string> = {
  chrome,
  edge,
  firefox,
  safari,
  electron
}
const browser = computed(() => {
  return (Object.keys(browserIconMap) as Browser[]).find((key) =>
    mainStore.report?.browserName.toLowerCase().includes(key)
  )
})

const passPercentage = computed(() => {
  return mainStore.report
    ? (100 * mainStore.report.totalPassed) / mainStore.report.total
    : 0
})
const failPercentage = computed(() => {
  return mainStore.report
    ? (100 * mainStore.report.totalFailed) / mainStore.report.total
    : 0
})
</script>

<style scoped>
.header {
  padding: 2rem 2rem 0.5rem 2rem;

  display: flex;
  gap: 1rem;
  align-items: center;
}

.main {
  padding: 0 2rem;
  flex: 1 1 0%;
  position: relative;
}

.label-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.information-box,
.el-skeleton {
  position: absolute;
  top: -5rem;
  right: 0;
  padding: 0 2rem;
  min-width: 40rem;
}
.el-skeleton {
  text-align: right;
}
.information-box > .progress {
  display: flex;
  gap: 1rem;
}
.general-info {
  padding-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.el-progress :deep(.el-progress__text) {
  font-size: 1.2rem !important;
}
.el-progress :deep(.el-progress-circle__track) {
  stroke: var(--color-background-danger-soft);
  opacity: 0.3;
}
.progress__statistics {
  flex: 1 1 auto;
  border-right: 3px solid var(--color-primary);
}
.progress__statistics-cell {
  display: flex;
  gap: 1rem;
}
.progress__statistics-cell .el-progress {
  flex: 1 1 auto;
}
.custom-el-progress-reverse :deep(.el-progress-bar__inner) {
  left: unset;
  right: 0;
}
.custom-el-progress-reverse :deep(.el-progress-bar__outer) {
  background-color: transparent;
}
</style>
