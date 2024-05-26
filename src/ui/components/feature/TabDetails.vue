<template>
  <div style="display: flex; gap: 2rem">
    <TabDetailsGeneral />

    <div
      class="wrapper"
      ref="wrapperRef"
    >
      <TabDetailsSuites @selected="doSelected" />

      <TabDetailsBody :suite-id="currentSuiteId" />
    </div>
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
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: minmax(18rem, 2fr) minmax(0, 9fr);
  column-gap: 2rem;
}
</style>
