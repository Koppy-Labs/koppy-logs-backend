import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { InsertCategoryModel } from '@/domain/entities/categories'
import { createCategoryService } from '@/domain/services/categories/create-categorie-service'
export async function createCategoryRoute(app: FastifyInstance) {
  app.post(
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

      const { serverId, name } = req.body as InsertCategoryModel

      await createCategoryService({ serverId, name })
    },
  )
}
