import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createServerService } from '@/domain/services/server/create-server-service'
import { auth } from '@/http/middleware/auth'

export async function createServerRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
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

        const { name, ownerId, imageUrl, plan } = req.body

        await createServerService({ name, ownerId, imageUrl, plan })
      },
    )
}
