// when this file is loaded, mock-fs will mirror this file under cwd
import { defineConfig } from './dist/index.js'

export default defineConfig({
  inputJsonPath: './test.json',
  outputDir: 'my-html-report',
  autoOpen: true,
  serverPort: 6001
})
