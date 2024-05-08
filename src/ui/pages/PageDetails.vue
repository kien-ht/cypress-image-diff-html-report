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
      <!-- <el-tab-pane
        label="Dashboard"
        :name="TabValue.Dashboard"
      >
        <TabDashboard />
      </el-tab-pane> -->

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
  </main>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useMainStore } from '@/store'
import { TabValue } from '@/types'
import { useAppTheme } from '@/hooks'
import { CheckRunInstance } from '@commonTypes'

const mainStore = useMainStore()
const { setTheme } = useAppTheme()
const activeTab = ref<keyof typeof TabValue>('Details')

setTheme()

const route = useRoute()
mainStore.fetchReport(route.query as unknown as CheckRunInstance)
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
}

.label-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
