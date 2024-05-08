import { Router } from 'express'
import { UpdateBaselines, WorkflowInstance } from '../common/types.js'
import { CiController } from './controller.js'

export default () => {
  const router = Router()
  const controller = new CiController()

  router.get('/reports', async (req, res) => {
    try {
      const json = await controller.getReports(
        req.query as unknown as WorkflowInstance
      )
      res.json(json)
    } catch (err) {
      console.log(err)
      res.status(400).end()
    }
  })

  router.patch('/reports', async (req, res) => {
    try {
      await controller.updateBaselines(req.body as UpdateBaselines)
      res.status(200).end()
    } catch (err) {
      console.log(err)
      res.status(400).end()
    }
  })

  router.use('/api', router)

  return router
}
