import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UpdateUserModel } from '@/domain/entities/user'
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
      },
      handler: async (req, res) => {
        await req.getCurrentUserId()

        const { id } = req.params as { id: string }
        const updateData = req.body as UpdateUserModel

        try {
          await updateUserService({ id, data: updateData })
          return res.status(200).send({ message: 'User updated successfully' })
        } catch (error) {
          return res.status(500).send({ error: 'Failed to update user' })
        }
      },
    })
}
