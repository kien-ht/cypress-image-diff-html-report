<template>
  <header>
    <h1>Cypress Image Diff HTML Report</h1>
  </header>

  <main>
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="Dashboard"
        :name="TabValue.DASHBOARD"
      >
        <TabDashboard />
      </el-tab-pane>

      <el-tab-pane
        label="Details"
        :name="TabValue.DETAILS"
      >
        <!-- <TabDetails /> -->
      </el-tab-pane>

      <el-tab-pane
        label="Settings"
        :name="TabValue.SETTINGS"
      >
        <TabSettings />
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script lang="ts" setup>
import { getReports } from '@/service'

getReports()

enum TabValue {
  DASHBOARD = 'DASHBOARD',
  DETAILS = 'DETAILS',
  SETTINGS = 'SETTINGS'
}

const activeTab = ref<keyof typeof TabValue>('DETAILS')
</script>

<style scoped>
header {
  padding: 1rem 2rem 0.5rem 2rem;
}

header > h1 {
  font-weight: bold;
}

main {
  padding: 0 2rem 2rem 2rem;
  flex: 1 1 0%;
}
</style>
@/service
