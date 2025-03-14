import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { authenticateUserService } from '@/domain/services/users/authenticate-user-service'
import { passwordSchema } from '@/utils/password'

export async function authenticateUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/login/password',
    {
      schema: {
        tags: ['users'],
        summary: 'Authenticate a user account',
        body: z.object({
          email: z.string().email(),
          password: passwordSchema,
        }),
      },
    },
    async (req, res) => {
      const { email, password } = req.body

      const result = await authenticateUserService({
        email,
        password,
      })

      if (result.status === 'error') return res.status(result.code).send(result)

      return res
        .status(result.code)
        .setCookie('@koppy-logs:0.0.0', result.data, {
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60,
          sameSite: 'strict',
        })
        .send()
    },
  )
}
