import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { authenticateUserService } from '@/domain/services/auth/authenticate-user-service'
import { passwordSchema } from '@/utils/password'
import {
  ACCESS_TOKEN_EXPIRY_MS,
  REFRESH_TOKEN_EXPIRY_MS,
} from '@/utils/sessions'

export async function authenticateUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/login/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate a user with password',
        body: z.object({
          email: z.string().email(),
          password: passwordSchema,
        }),
        response: {
          204: z.null(),
          400: z.object({
            message: z.literal('IP address and user agent are required'),
          }),
          401: z.object({
            message: z.literal('Invalid credentials'),
          }),
          409: z.object({
            message: z.literal(
              'User already has a session active with this device',
            ),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body

      const ipAddress = req.headers['CF-Connecting-IP'] as string | null
      const userAgent = req.headers['X-Forwarded-For'] as string | null

      if (!ipAddress || !userAgent)
        return res.status(400).send({
          message: 'IP address and user agent are required',
        })

      const result = await authenticateUserService({
        email,
        password,
        ipAddress,
        userAgent,
      })

      if (result.status === 'error')
        return res.status(result.code).send({
          message: result.message,
        })

      return res
        .status(result.code)
        .setCookie('refreshToken', result.data.refreshToken, {
          httpOnly: true,
          secure: true,
          path: '/',
          maxAge: REFRESH_TOKEN_EXPIRY_MS / 1000, // Convert to seconds
          sameSite: 'strict',
        })
        .setCookie('accessToken', result.data.accessToken, {
          httpOnly: true,
          secure: true,
          path: '/',
          maxAge: ACCESS_TOKEN_EXPIRY_MS / 1000, // Convert to seconds
          sameSite: 'strict',
        })
        .send()
    },
  )
}
