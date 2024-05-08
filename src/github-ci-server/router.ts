import { Router } from 'express'
import { CiTestIdentity, CheckRunInstance } from '../common/types.js'
import { CiController } from './controller.js'

export default () => {
  const router = Router()
  const controller = new CiController()

  router.get('/reports', async (req, res) => {
    try {
      const json = await controller.getReports(
        req.query as unknown as CheckRunInstance
      )
      res.json(json)
    } catch (err) {
      res.status(400).end(err)
    }
  })

  router.put('/reports', async (req, res) => {
    try {
      await controller.updateTest(req.body as CiTestIdentity)
      res.status(200).end()
    } catch {
      res.status(400).end()
    }
  })

  router.use('/api', router)

  return router
}
