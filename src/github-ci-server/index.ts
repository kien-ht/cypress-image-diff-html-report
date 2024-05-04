import { Server, Probot } from 'probot'
import { config as setDotenvConfig } from 'dotenv'
import express from 'express'
import path from 'path'
import { __dirname } from '../common/utils-cjs.js'
import ciRouter from './router.js'
import webhooks from './webhook.js'
import { getProbotConfig } from '../common/utils.js'

setDotenvConfig()

startServer()

async function startServer() {
  const server = new Server({
    Probot: Probot.defaults(getProbotConfig()),
    webhookProxy: process.env.WEBHOOK_PROXY_URL
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
