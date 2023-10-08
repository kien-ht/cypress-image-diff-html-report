<template>
  <div>
    <img
      class="image"
      v-if="props.src"
      :src="props.src"
    />

    <slot
      v-else
      name="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
}>()
</script>

<style scoped>
.image {
  width: 100%;
}
</style>
