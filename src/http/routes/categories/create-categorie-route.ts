import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createCategoryService } from '@/domain/services/categories/create-categorie-service'

export async function createCategoryRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/categories',
    {
      schema: {
        tags: ['categories'],
        body: z.object({
          serverId: z.string(),
          name: z.string(),
        }),
      },
    },
    async (req) => {
      await req.getCurrentUserId()

      const { serverId, name } = req.body

      await createCategoryService({ serverId, name })
    },
  )
}
