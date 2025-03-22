import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { findUserById } from '@/db/repositories/users'
import { updateCategoryService } from '@/domain/services/categories/update-category-service'
import { auth } from '@/http/middleware/auth'
import { serverSchema } from '@/perms/models/server'
import { getUserPermissions } from '@/utils/get-user-permissions'

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
        const { sub: userId } = await req.getCurrentUserId()
        const { id, serverId } = req.params
        const { role } = await req.getMembership({
          userId,
          serverId,
        })

        const user = await findUserById({ id: userId })

        const { cannot } = getUserPermissions({
          ...user,
          role: role as 'ADMIN' | 'MEMBER',
        })

        const authServer = serverSchema.parse({
          id: serverId,
          ownerId: user.id,
        })

        if (cannot('update', authServer))
          return res.status(403).send({
            message: 'Unauthorized' as const,
          })

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
