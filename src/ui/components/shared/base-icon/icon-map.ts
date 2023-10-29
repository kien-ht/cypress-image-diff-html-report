import type { SvgIcon } from './types'

export const svgMap = resolvedSvgModule()

function resolvedSvgModule(): Map<SvgIcon, string> {
  const modules = import.meta.glob('./icons/*.svg', {
    as: 'raw',
    eager: true
  })
  return Object.entries(modules).reduce((map, [path, data]) => {
    const name = path.replace('./icons/', '').replace('.svg', '')
    map.set(name, data)
    return map
  }, new Map())
}
