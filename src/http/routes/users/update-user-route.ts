import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateUserService } from '@/domain/services/users/update-user-service'
import { auth } from '@/http/middleware/auth'

export async function updateUserRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post('/users/update/:id', {
      schema: {
        tags: ['users'],
        summary: 'Update user by ID',
        body: z.object({
          name: z.string().optional(),
          email: z.string().optional(),
          password: z.string().optional(),
          avatarUrl: z.string().optional(),
        }),
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
        const updateData = req.body

        const result = await updateUserService({ id, data: updateData })

        if (result.status === 'error')
          return res.status(result.code).send({
            message: result.message,
          })
      },
    })
}
