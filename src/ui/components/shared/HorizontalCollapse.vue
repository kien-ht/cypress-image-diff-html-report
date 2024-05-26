<template>
  <Transition
    @before-enter="handleBeforeEnter"
    @enter="handleEnter"
    @before-leave="handleBeforeLeave"
    @leave="handleLeave"
  >
    <slot v-if="show"></slot>
  </Transition>
</template>

<script lang="ts">
export interface VerticalCollapseProps {
  expanded: boolean
}
export interface VerticalCollapseEmits {
  (e: 'update:expanded', data: boolean): void
}
</script>

<script setup lang="ts">
import { RendererElement } from 'vue'

const props = defineProps<VerticalCollapseProps>()
const emit = defineEmits<VerticalCollapseEmits>()

const collapsing = ref(false)
const show = computed({
  get: () => props.expanded,
  set: (newValue) => emit('update:expanded', newValue)
})

const handleBeforeEnter = () => {
  collapsing.value = true
}

const handleEnter = (el: RendererElement, done: () => void) => {
  setTimeout(() => {
    show.value = true
    collapsing.value = false
    el.style.removeProperty('width')
    done()
    el.style.width = `${el.scrollWidth}px`
  }, 1)
}

const handleBeforeLeave = (el: RendererElement) => {
  collapsing.value = true
  el.style.width = `${el.scrollWidth}px`
}

const handleLeave = (el: RendererElement, done: () => void) => {
  show.value = false
  collapsing.value = false
  el.style.width = '0px'
  done()
}
</script>
