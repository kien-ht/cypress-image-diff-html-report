<template>
  <div
    v-html="iconMap[props.name]"
    v-inline
  />
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue'

const props = defineProps<{
  name: string
}>()

const attrs = useAttrs() as Record<string, string>

const vInline = {
  mounted: (el: HTMLElement) => {
    if (el.children.length > 1) {
      throw new Error(
        `[vInline]: ${props.name}.svg should contain only one root node.`
      )
    }

    const [svg] = [...el.children]
    Object.entries<string>(attrs).forEach(([key, value]) => {
      svg.setAttribute(key, value)
    })

    el.replaceWith(svg)
  }
}

const iconMap = normalizeGlob(
  import.meta.glob('../../assets/icons/*.svg', {
    as: 'raw',
    eager: true
  })
)

function normalizeGlob(
  modules: Record<string, string>
): Record<string, string> {
  return Object.entries(modules).reduce(
    (result, [path, data]) => ({
      ...result,
      [path.replace('../../assets/icons/', '').replace('.svg', '')]: data
    }),
    {}
  )
}
</script>
