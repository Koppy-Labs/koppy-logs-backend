import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getUserService } from '@/domain/services/users/get-user-service'
import { auth } from '@/http/middleware/auth'

export async function getUserRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/users/:id', {
      schema: {
        tags: ['users'],
        summary: 'Get user by ID',
      },
      handler: async (req, res) => {
        const { id } = req.params as { id: string }
        const result = await getUserService({ id })

        if (result.status === 'error')
          return res.status(result.code).send(result)

        return res.status(result.code).send(result.data)
      },
    })
}
