import { Router } from 'express'
import { ResolvedUserConfig, TestIdentity } from '../common/types.js'
import { Controller } from './controller.js'

export default (config: ResolvedUserConfig) => {
  const router = Router()
  const controller = new Controller(config)

  router.get('/reports', async (req, res) => {
    try {
      const json = await controller.getReports()
      res.json(json)
    } catch {
      res.status(404).end()
    }
  })

  router.patch('/reports', async (req, res) => {
    try {
      await controller.updateTests(req.body as TestIdentity[])
      res.status(200).end()
    } catch {
      res.status(400).end()
    }
  })

  router.use('/api', router)

  return router
}
