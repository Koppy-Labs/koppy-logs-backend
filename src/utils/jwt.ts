import * as jose from 'jose'

import { env } from '@/env'

export const secret = new TextEncoder().encode(env.JWT_SECRET)

interface IPayload {
  sub: string
}

export async function validateJwtToken(token: string) {
  const { payload } = await jose.jwtVerify(token, secret, {
    algorithms: ['HS256'],
    maxTokenAge: '7d',
  })

  return payload
}

export async function signJwtToken({ sub }: IPayload) {
  const signedToken = await new jose.SignJWT({ sub })
    .setExpirationTime('7d')
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(secret)

  return signedToken
}
