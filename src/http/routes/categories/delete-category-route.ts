import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteCategoryService } from '@/domain/services/categories/delete-category-service'
import { auth } from '@/http/middleware/auth'
import { serverSchema } from '@/perms/models/server'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteCategoryRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/servers/:serverId/categories/:categoryId',
      {
        schema: {
          tags: ['categories'],
          params: z.object({
            serverId: z.string(),
            categoryId: z.string(),
          }),
          response: {
            204: z.object({}),
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
        const { sub: userId } = await req.getCurrentUserId()
        const { serverId, categoryId } = req.params
        const { role } = await req.getMembership({
          userId,
          serverId,
        })

        const authServer = serverSchema.parse({
          id: serverId,
          ownerId: userId,
        })

        const { cannot } = getUserPermissions({
          id: userId,
          role: role as 'ADMIN' | 'MEMBER',
        })

        if (cannot('delete', authServer))
          return res.status(403).send({
            message: 'Forbidden',
          })

        const result = await deleteCategoryService({
          id: categoryId,
        })

        if (result.status === 'error')
          return res.status(400).send({
            message: result.message,
          })

        return res.status(204).send()
      },
    )
}
