import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createUserService } from '@/domain/services/users/create-user-service'
import { passwordSchema } from '@/utils/password'

export async function createUserAccountRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['users'],
        summary: 'Create a new user account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: passwordSchema,
          avatarUrl: z.string().url(),
        }),
        response: {
          204: z.null(),
          409: z.object({
            message: z.literal('Email already in use'),
          }),
        },
      },
    },
    async (req, res) => {
      const { name, email, password, avatarUrl } = req.body

      const result = await createUserService({
        name,
        email,
        password,
        avatarUrl,
      })

      if (result.status === 'error')
        return res.status(result.code).send({
          message: result.message,
        })

      return res.status(result.code).send()
    },
  )
}
