import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { validateJwtToken } from '@/utils/jwt'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req, res) => {
    req.getCurrentUserId = async () => {
      if (!req.headers.authorization)
        return res.status(401).send({ message: 'Unauthorized.' })

      try {
        const payload = await validateJwtToken(req.headers.authorization)

        if (!payload.sub)
          return res.status(401).send({ message: 'Unauthorized.' })

        return { sub: payload.sub }
      } catch (error) {
        return res.status(401).send({ message: 'Unauthorized.' })
      }
    }
  })
})
