import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

export function __filename(importMetaUrl: string): string {
  return fileURLToPath(importMetaUrl)
}

export function __dirname(importMetaUrl: string): string {
  return dirname(__filename(importMetaUrl))
}

export function require(url: string, importMetaUrl: string) {
  return createRequire(importMetaUrl)(url)
}
