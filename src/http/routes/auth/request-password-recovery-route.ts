import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { requestPasswordRecoveryService } from '@/domain/services/users/request-password-recovery-service'
import { env } from '@/env'

export async function requestPasswordRecoveryRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recovery',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password recovery',
        body: z.object({
          email: z.string().email(),
          redirect: z.string().url().optional(),
        }),
        response: {
          204: z.null(),
          404: z.object({
            message: z.enum([
              'User not found',
              'Error creating recovery token',
            ]),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, redirect } = req.body

      const result = await requestPasswordRecoveryService({ email })

      if (result.status === 'error') {
        if (result.code === 404) return res.status(204).send() // we don't wanna expose if the user exists or not

        return res.status(result.code).send({
          message: result.message,
        })
      }

      const url = new URL(env.app.BASE_URL)
      url.pathname = '/password/recovery'
      url.searchParams.set('token', result.data)

      if (redirect) url.searchParams.set('redirect', redirect)

      return res.status(result.code).send()
    },
  )
}
