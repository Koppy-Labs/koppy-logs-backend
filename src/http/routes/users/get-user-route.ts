import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getUserService } from '@/domain/services/users/get-user-service'
import { auth } from '@/http/middleware/auth'

export async function getUserRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/users/:id', {
      schema: {
        tags: ['users'],
        summary: 'Get user by ID',
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              avatarUrl: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
          404: z.object({
            message: z.literal('User not found'),
          }),
        },
      },
      handler: async (req, res) => {
        await req.getCurrentUserId()

        const { id } = req.params

        const result = await getUserService({ id })

        if (result.status === 'error')
          return res.status(result.code).send({
            message: result.message,
          })

        return res.status(result.code).send({
          user: result.data,
        })
      },
    })
}
