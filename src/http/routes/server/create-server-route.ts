import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { InsertServerModel } from '@/domain/entities/server'
import { createServerService } from '@/domain/services/server/create-server-service'
export async function createServerRoute(app: FastifyInstance) {
  app.post(
    '/servers',
    {
      schema: {
        tags: ['servers'],
        body: z.object({
          name: z.string(),
          ownerId: z.string(),
          imageUrl: z.string(),
          plan: z.enum(['free', 'pro']),
        }),
      },
    },
    async (req) => {
      await req.getCurrentUserId()

      const { name, ownerId, imageUrl, plan } = req.body as InsertServerModel

      await createServerService({ name, ownerId, imageUrl, plan })
    },
  )
}
