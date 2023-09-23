<template>
  <div class="wrapper">
    <TabDetailsSideNavigator />
    <TabDetailsBody />
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: minmax(15rem, 1fr) minmax(0, 5fr);
  gap: 2rem;
}
</style>
