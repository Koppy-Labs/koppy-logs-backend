import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import * as jose from 'jose'

import { revalidateToken } from '@/domain/services/auth/revalidate-token'
import { acquireLock, releaseLock } from '@/utils/lock'
import { REFRESH_TOKEN_EXPIRY_MS, secretKey } from '@/utils/sessions'

type Payload = {
  sub: string
  jti: string
}

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req, res) => {
    req.getCurrentUserId = async () => {
      const ipAddress = req.headers['CF-Connecting-IP'] as string | null
      const userAgent = req.headers['X-Forwarded-For'] as string | null

      if (!ipAddress || !userAgent)
        return res.status(401).send({ message: 'Unauthorized.' })

      if (!req.headers.authorization)
        return res.status(401).send({ message: 'Unauthorized.' })

      const refreshToken = req.cookies.refreshToken

      if (!refreshToken)
        return res.status(401).send({ message: 'Unauthorized.' })

      const accessToken = req.headers.authorization
        .replace('Bearer ', '')
        .trim()
        .replace(/^,\s*/, '')

      if (!accessToken)
        return res.status(401).send({ message: 'Unauthorized.' })

      try {
        const { payload: accessTokenPayload }: { payload: Payload } =
          await jose.jwtVerify(accessToken, secretKey, {
            algorithms: ['HS256'],
            typ: 'JWT',
          })

        const { payload: refreshTokenPayload }: { payload: Payload } =
          await jose.jwtVerify(refreshToken, secretKey, {
            algorithms: ['HS256'],
            typ: 'JWT',
          })

        if (
          !refreshTokenPayload.sub ||
          !refreshTokenPayload.jti ||
          !accessTokenPayload.sub ||
          !accessTokenPayload.jti
        )
          return res.status(401).send({ message: 'Unauthorized.' })

        // Create a lock key based on session identifiers
        const lockKey = `session-lock:${accessTokenPayload.jti}:${refreshTokenPayload.sub}`

        // Try to acquire a lock with timeout
        const lockAcquired = await acquireLock(lockKey, 5000) // 5 second timeout

        if (!lockAcquired) {
          return res.status(429).send({
            message: 'Too many concurrent requests for this session.',
          })
        }

        try {
          const result = await revalidateToken({
            jti: accessTokenPayload.jti,
            userId: refreshTokenPayload.sub,
            ipAddress,
            userAgent,
          })

          if (result.status === 'error')
            return res.status(result.code).send({ message: result.message })

          res.setCookie('refreshToken', result.data, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: REFRESH_TOKEN_EXPIRY_MS / 1000, // Convert to seconds
            sameSite: 'strict',
          })

          return { sub: accessTokenPayload.sub }
        } finally {
          // Always release the lock when done
          await releaseLock(lockKey, lockAcquired)
        }
      } catch (error) {
        return res.status(401).send({ message: 'Unauthorized.' })
      }
    }
  })
})
