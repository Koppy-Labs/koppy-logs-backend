import * as jose from 'jose'

import { env } from '@/env'

export const ACCESS_TOKEN_EXPIRY = '7d' // 7 days in jwt format
export const ACCESS_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 days in millisecond
export const REFRESH_TOKEN_EXPIRY = '2h' // 2 hours in jwt format
export const REFRESH_TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

export const secretKey = new TextEncoder().encode(env.app.JWT_SECRET)

export async function createAccessToken({
  userId,
  sessionId,
}: {
  userId: string
  sessionId: string
}) {
  const accessToken = await new jose.SignJWT({
    sub: userId,
    jti: sessionId,
  })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(secretKey)

  return { accessToken }
}

export async function createRefreshToken({
  userId,
  sessionId,
}: {
  userId: string
  sessionId: string
}) {
  const refreshToken = await new jose.SignJWT({
    sub: userId,
    jti: sessionId,
  })
    .setIssuedAt()
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(secretKey)

  return { refreshToken }
}

export async function decodeJWT(token: string) {
  const decoded = jose.decodeJwt(token)

  if (
    !decoded ||
    typeof decoded.sub !== 'string' ||
    typeof decoded.jti !== 'string'
  ) {
    throw new Error('Invalid token')
  }

  return {
    decodedToken: decoded as jose.JWTPayload & { jti: string; sub: string },
  }
}
