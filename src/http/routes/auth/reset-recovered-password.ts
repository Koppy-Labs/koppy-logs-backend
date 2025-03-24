import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { resetPasswordService } from '@/domain/services/auth/reset-password'
import { passwordSchema } from '@/utils/password'

export async function resetRecoveredPasswordRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/password/recovery',
    {
      schema: {
        tags: ['auth'],
        summary: 'Reset recovered password',
        body: z.object({
          code: z.string(),
          password: passwordSchema,
        }),
        response: {
          204: z.null(),
          401: z.object({
            message: z.literal('Recovery request expired'),
          }),
          404: z.object({
            message: z.enum(['Request not found', 'User not found']),
          }),
        },
      },
    },
    async (req, res) => {
      const { code, password } = req.body

      const result = await resetPasswordService({ code, password })

      if (result.status === 'error')
        return res.status(result.code).send({
          message: result.message,
        })

      return res.status(result.code).send()
    },
  )
}
