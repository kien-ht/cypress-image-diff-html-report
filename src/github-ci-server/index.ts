import { Server, Probot } from 'probot'
import { config as setDotenvConfig } from 'dotenv'
import express from 'express'
import path from 'path'
import { __dirname } from '../common/utils-cjs.js'
import ciRouter from './router.js'
import webhooks from './webhook.js'
import { getProbotConfig } from '../common/utils.js'
import { DEFAULT_PORT } from '../common/constants.js'

process.env.NODE_ENV = process.env.NODE_ENV ?? 'dev'
setDotenvConfig({ path: `./.env.${process.env.NODE_ENV}` })

startServer()

async function startServer() {
  const server = new Server({
    Probot: Probot.defaults(getProbotConfig()),
    webhookProxy: process.env.WEBHOOK_PROXY_URL,
    port: DEFAULT_PORT
  })

  server.expressApp.use(
    express.static(path.join(__dirname(import.meta.url), '../ui'))
  )
  server.expressApp.use(express.static(process.cwd()))
  server.expressApp.use(express.json())
  server.expressApp.use(ciRouter())

  await server.load(webhooks)

  await server.start()
  return server
}
