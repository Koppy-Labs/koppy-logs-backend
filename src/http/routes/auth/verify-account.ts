import { render } from '@react-email/components'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { ResendAdapter } from '@/adapters/resend'
import { verifyAccount } from '@/domain/services/auth/verify-account'
import { RiseWelcomeEmail } from '@/emails/welcome-email'

export async function verifyAccountRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/verify',
    {
      schema: {
        tags: ['auth'],
        summary: 'Verify account',
        querystring: z.object({
          email: z.string(),
        }),
        response: {
          204: z.null(),
          404: z.object({
            message: z.enum(['User is already verified', 'User not found']),
          }),
        },
      },
    },
    async (req, res) => {
      const { email } = req.query

      const result = await verifyAccount({ email })

      if (result.status === 'error')
        return res.status(result.code).send({
          message: result.message,
        })

      const emailMessage = await render(
        RiseWelcomeEmail({
          firstName: result.data.firstName,
        }),
        {
          pretty: true,
        },
      )

      await ResendAdapter.sendEmail(
        {
          to: [email],
          html: emailMessage,
          subject: 'Welcome to Rise',
        },
        'welcome',
      )

      return res.status(result.code).send()
    },
  )
}
