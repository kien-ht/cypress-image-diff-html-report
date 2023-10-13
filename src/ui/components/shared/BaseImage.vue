<template>
  <div>
    <img
      class="image"
      :draggable="false"
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
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
