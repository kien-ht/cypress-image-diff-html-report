import { dirname } from 'path'
import { fileURLToPath } from 'url'

export function __filename(importMetaUrl: string): string {
  return fileURLToPath(importMetaUrl)
}

export function __dirname(importMetaUrl: string): string {
  return dirname(__filename(importMetaUrl))
}
