import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { fetchCategoriesService } from '@/domain/services/categories/fetch-gategories-service'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const categorySchema = z.object({
  id: z.string(),
  serverId: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export async function fetchCategoriesRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/servers/:serverId/categories',
      {
        schema: {
          tags: ['categories'],
          params: z.object({
            serverId: z.string(),
          }),
          response: {
            200: z.object({
              categories: categorySchema.array(),
            }),
            401: z.object({
              message: z.literal('Unauthorized'),
            }),
            403: z.object({
              message: z.literal('Forbidden'),
            }),
          },
        },
      },
      async (req, res) => {
        const { serverId } = req.params
        const { sub: userId } = await req.getCurrentUserId()
        const { role } = await req.getMembership({
          userId,
          serverId,
        })

        const { cannot } = getUserPermissions({
          id: userId,
          role: role as 'ADMIN' | 'MEMBER',
        })

        if (cannot('get', 'category'))
          return res.status(403).send({
            message: 'Forbidden',
          })

        const result = await fetchCategoriesService({ serverId })

        return res.status(result.code).send({
          categories: result.data,
        })
      },
    )
}
