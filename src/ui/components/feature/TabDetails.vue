<template>
  <div
    class="wrapper"
    ref="wrapperRef"
  >
    <TabDetailsSideNavigator @selected="doSelected" />

    <TabDetailsBody :suite-id="currentSuiteId" />
  </div>
</template>

<script lang="ts" setup>
const currentSuiteId = ref<string>()

function doSelected(id: string) {
  currentSuiteId.value = id
}
const wrapperRef = ref<HTMLElement>()

onMounted(async () => {
  await nextTick()
  wrapperRef.value!.style.height =
    window.innerHeight - wrapperRef.value!.getBoundingClientRect().top + 'px'
})
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: minmax(15rem, 1fr) minmax(0, 5fr);
  column-gap: 2rem;
}
</style>
