import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { deleteUser } from '@/db/repositories/users'
import { auth } from '@/http/middleware/auth'

export async function deleteUserRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete('/users/delete/:id', {
      schema: {
        tags: ['users'],
        summary: 'Delete user by ID',
      },
      handler: async (req, res) => {
        await req.getCurrentUserId()

        const { id } = req.params as { id: string }

        try {
          await deleteUser({ id })

          return res.status(200).send({ message: 'User deleted successfully' })
        } catch (error) {
          return res.status(500).send({ message: 'Failed to delete user' })
        }
      },
    })
}
