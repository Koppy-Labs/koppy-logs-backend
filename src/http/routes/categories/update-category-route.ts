import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateCategoryService } from '@/domain/services/categories/update-category-service'
import { auth } from '@/http/middleware/auth'

export async function updateCategoryRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/serverS/:serverId/categories/:id',
      {
        schema: {
          tags: ['categories'],
          params: z.object({
            serverId: z.string(),
            id: z.string(),
          }),
          body: z.object({
            name: z.string(),
          }),
        },
      },
      async (req, res) => {
        await req.getCurrentUserId()

        const { id, serverId } = req.params
        const { name } = req.body

        const result = await updateCategoryService({
          id,
          data: { name, serverId },
        })

        if (result.status === 'error')
          return res.status(400).send({
            message: result.message,
          })

        return res.status(204).send()
      },
    )
}
