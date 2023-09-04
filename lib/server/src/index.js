const express = require('express')
const path = require('path')
const chalk = require('chalk')

const app = express()

const PORT = process.env.PORT || 4242

app.use(express.static(path.resolve('lib/ui/dist')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve('lib/ui/dist/index.html'))
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    '🚀 cypress-image-diff-html-report server running on',
    chalk.cyan.underline(`http://localhost:${PORT}`)
  )
})
