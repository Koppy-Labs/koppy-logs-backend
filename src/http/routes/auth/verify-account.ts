import { render } from '@react-email/components'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { ResendAdapter } from '@/adapters/resend'
import { verifyAccount } from '@/domain/services/auth/verify-account'
import { WelcomeEmail } from '@/emails/welcome-email'

export async function verifyAccountRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/verify',
    {
      schema: {
        tags: ['auth'],
        summary: 'Verify account',
        body: z.object({
          email: z.string().email('Invalid email format'),
          code: z
            .string()
            .length(6, 'Verification code must be 6 characters')
            .regex(/^\d+$/, 'Verification code must contain only digits')
            .describe('The unique verification code sent via email'),
        }),
        response: {
          204: z.null(),
          400: z.object({
            message: z.enum([
              'Invalid OTP code',
              'User is already verified',
              'OTP code expired',
            ]),
          }),
          404: z.object({
            message: z.enum(['User not found']),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, code } = req.body

      const result = await verifyAccount({ email, code })

      if (result.status === 'error')
        return res.status(result.code).send({
          message: result.message,
        })

      const emailMessage = await render(
        WelcomeEmail({
          name: result.data.name,
        }),
        {
          pretty: true,
        },
      )

      await ResendAdapter.sendEmail(
        {
          to: [email],
          html: emailMessage,
          subject: 'Welcome to Koppy Logs',
        },
        'welcome',
      )

      return res.status(result.code).send()
    },
  )
}
