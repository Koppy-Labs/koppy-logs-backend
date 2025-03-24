import { createId } from '@paralleldrive/cuid2'

import {
  createSession,
  deleteSessionByToken,
  findSessionByUserIdIpAddressAndUserAgent,
} from '@/db/repositories/sessions'
import { findUserByEmail } from '@/db/repositories/users'
import type { User } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_WEEK_IN_SECONDS, setCache } from '@/utils/cache'
import { comparePassword } from '@/utils/password'
import {
  ACCESS_TOKEN_EXPIRY_MS,
  createAccessToken,
  createRefreshToken,
} from '@/utils/sessions'

export type AuthenticateUserInterface = {
  email: string
  password: string
  ipAddress: string
  userAgent: string
}

export async function authenticateUserService({
  email,
  password,
  ipAddress,
  userAgent,
}: AuthenticateUserInterface) {
  const cachedUser = await getCache<User>(`user:${email}`)

  let user = cachedUser

  if (!user) {
    user = await findUserByEmail({ email })

    if (user) {
      await setCache(`user:${email}`, JSON.stringify(user), ONE_WEEK_IN_SECONDS)
    }
  }

  if (!user)
    return error({
      message: 'Invalid credentials' as const,
      code: 401,
    })

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid)
    return error({
      message: 'Invalid credentials' as const,
      code: 401,
    })

  const existingSession = await findSessionByUserIdIpAddressAndUserAgent({
    userId: user.id,
    ipAddress,
    userAgent,
  })

  if (existingSession) {
    const isSessionActive = existingSession.status === 'active'

    if (isSessionActive)
      return error({
        message: 'User already has a session active with this device' as const,
        code: 409,
      })

    await deleteSessionByToken({
      token: existingSession.token,
      userId: user.id,
    })
  }

  const sessionId = createId()

  const { accessToken } = await createAccessToken({
    userId: user.id,
    sessionId,
  })

  await createSession({
    id: sessionId,
    token: accessToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRY_MS),
    ipAddress,
    userAgent,
  })

  const { refreshToken } = await createRefreshToken({
    userId: user.id,
    sessionId,
  })

  return success({
    data: {
      accessToken,
      refreshToken,
    },
    code: 204,
  })
}
