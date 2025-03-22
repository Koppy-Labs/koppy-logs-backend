import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getCategoryService } from '@/domain/services/categories/get-category-service'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { categorySchema } from './fetch-categories-route'

export async function getCategoryRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/servers/:serverId/categories/:id',
      {
        schema: {
          tags: ['categories'],
          params: z.object({
            serverId: z.string(),
            id: z.string(),
          }),
          response: {
            200: z.object({
              data: categorySchema,
            }),
            401: z.object({
              message: z.literal('Unauthorized'),
            }),
            403: z.object({
              message: z.literal('Forbidden'),
            }),
            404: z.object({
              message: z.literal('Category not found'),
            }),
          },
        },
      },
      async (req, res) => {
        const { id, serverId } = req.params
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

        const result = await getCategoryService({ id })

        if (result.status === 'error')
          return res.status(result.code).send({
            message: result.message,
          })

        return res.status(result.code).send({
          data: result.data,
        })
      },
    )
}
