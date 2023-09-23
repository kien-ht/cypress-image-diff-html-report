import { Router } from 'express'
import { getInputJson } from '../common/utils.js'

const router = Router()

router.get('/reports', async (req, res) => {
  const json = await getInputJson()
  res.json(json)
})

router.use('/api', router)

export default router
