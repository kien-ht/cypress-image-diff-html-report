import { Router } from 'express'
import { getResolvedInputJson } from '../common/utils.js'
import { ResolvedUserConfig } from '../common/types.js'

export default (config: ResolvedUserConfig) => {
  const router = Router()

  router.get('/reports', async (req, res) => {
    const json = await getResolvedInputJson(config, 'served')
    res.json(json)
  })

  router.use('/api', router)

  return router
}
