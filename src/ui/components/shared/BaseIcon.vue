<template>
  <div
    v-html="iconMap[props.name]"
    v-inline
  />
</template>

<script lang="ts" setup>
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
      // in case of style, convert object to css string
      const attributeValue =
        key === 'style'
          ? Object.entries(value)
              .map(([k, v]) => `${k}:${v}`)
              .join(';')
          : value

      svg.setAttribute(key, attributeValue)
    })

    el.replaceWith(svg)
  }
}

const iconMap = normalizeGlob()

function normalizeGlob(): Record<string, string> {
  const modules = import.meta.glob('../../assets/icons/*.svg', {
    as: 'raw',
    eager: true
  })
  return Object.entries(modules).reduce(
    (result, [path, data]) => ({
      ...result,
      [path.replace('../../assets/icons/', '').replace('.svg', '')]: data
    }),
    {}
  )
}
</script>
