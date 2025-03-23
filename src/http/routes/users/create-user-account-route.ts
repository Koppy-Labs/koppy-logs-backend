import { render } from '@react-email/components'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { ResendAdapter } from '@/adapters/resend'
import { createUserService } from '@/domain/services/users/create-user-service'
import { AccountCreationEmail } from '@/emails/account-created-email'
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

      const emailMessage = await render(
        AccountCreationEmail({
          email,
          name: result.data.user.name,
          verificationCode: result.data.otpCode,
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
