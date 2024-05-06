<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { useMainStore } from './store'

const mainStore = useMainStore()
mainStore.mode === 'static' &&
  ElNotification({
    type: 'info',
    message: 'You are viewing the report in the static mode.',
    duration: 3000
  })
</script>

<style scoped></style>
