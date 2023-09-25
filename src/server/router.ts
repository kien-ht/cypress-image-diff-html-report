import { Router } from 'express'
import { getInputJson } from '../common/utils.js'
import { ResolvedUserConfig } from '../common/types.js'

export default (config: ResolvedUserConfig) => {
  const router = Router()

  router.get('/reports', async (req, res) => {
    const json = await getInputJson(config.inputJsonPath)
    res.json(json)
  })

  router.use('/api', router)

  return router
}
