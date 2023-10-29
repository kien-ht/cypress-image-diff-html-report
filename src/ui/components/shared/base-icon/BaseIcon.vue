<!-- eslint-disable vue/html-self-closing -->
<template>
  <svg v-replace></svg>
</template>

<script setup lang="ts">
import { svgMap } from './icon-map'

import type { SvgIcon } from './types'

const props = defineProps<{
  name: SvgIcon
}>()

const vReplace = {
  mounted: replaceOriginalSvg,
  updated: replaceOriginalSvg
}

async function replaceOriginalSvg(el: HTMLElement) {
  if (!svgMap.has(props.name as SvgIcon))
    throw Error(`BaseIcon: Cannot find ${props.name}.svg`)

  if (el.children.length > 1) {
    throw Error(
      `BaseIcon: svg can only have one root element! Found ${el.children.length} elements in ${props.name}.svg.`
    )
  }

  el.innerHTML = svgMap.get(props.name as SvgIcon)!

  // copy all attributes from original svg to the wrapper svg
  Array.from(el.firstElementChild!.attributes).forEach((attribute) => {
    if (!el.hasAttribute(attribute.nodeName)) {
      el.setAttribute(attribute.nodeName, attribute.nodeValue!)
    }
  })
  el.replaceChildren(...el.firstElementChild!.children)
}
</script>
