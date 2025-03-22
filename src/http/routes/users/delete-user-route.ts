import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteUserService } from '@/domain/services/users/delete-user-service'
import { auth } from '@/http/middleware/auth'

export async function deleteUserRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete('/users/delete/:id', {
      schema: {
        tags: ['users'],
        summary: 'Delete user by ID',
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null(),
          404: z.object({
            message: z.literal('User not found'),
          }),
        },
      },
      handler: async (req, res) => {
        await req.getCurrentUserId()

        const { id } = req.params

        const result = await deleteUserService({ id })

        if (result.status === 'error')
          return res.status(result.code).send({
            message: result.message,
          })

        return res.status(result.code).send()
      },
    })
}
