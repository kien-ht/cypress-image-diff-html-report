import { dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

export function __filename(importMetaUrl: string): string {
  return fileURLToPath(importMetaUrl)
}

export function __dirname(importMetaUrl: string): string {
  return dirname(__filename(importMetaUrl))
}

// a workaround to import(), as it fails to load absolute paths in Window
// https://github.com/nodejs/node/issues/31710
export async function dynamicImport(targetPath: string) {
  const fileUrl = pathToFileURL(targetPath).href
  return import(fileUrl)
}
