import { createId } from '@paralleldrive/cuid2'

import { makeSession } from '@/test/factories/make-session'
import { makeUser } from '@/test/factories/make-user'
import { wait } from '@/test/wait'
import { createRefreshToken } from '@/utils/sessions'

import { revalidateToken } from './revalidate-token'

let sut: typeof revalidateToken

describe('RevalidateToken', () => {
  beforeAll(async () => {
    sut = revalidateToken
  })

  it('should be able to revalidate a valid token', async () => {
    const user = await makeUser()
    const session = await makeSession({
      userId: user.id,
    })

    const { refreshToken } = await createRefreshToken({
      userId: user.id,
      sessionId: session.id,
    })

    await wait(1000) // wait for the tokens to have different expirations

    const result = await sut({
      userId: user.id,
      jti: session.id,
      ipAddress: session.ipAddress ?? '',
      userAgent: session.userAgent ?? '',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(200)
    if (result.status !== 'ok') throw new Error('Token was not revalidated')

    expect(result.data).toBeDefined()
    expect(result.data).not.toEqual(refreshToken)
    expect(result.data).toEqual(expect.any(String))
  })

  it('should not be able to revalidate an expired token', async () => {
    const user = await makeUser()
    const session = await makeSession({
      userId: user.id,
      expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour in the past
    })

    const result = await sut({
      userId: user.id,
      jti: session.id,
      ipAddress: session.ipAddress ?? '',
      userAgent: session.userAgent ?? '',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(401)
    if (result.status !== 'error') throw new Error('Token was not expired')

    expect(result.message).toBe('Session expired')
  })

  it('should not be able to revalidate a revoked token', async () => {
    const user = await makeUser()
    const session = await makeSession({
      userId: user.id,
      status: 'revoked',
    })

    const result = await sut({
      userId: user.id,
      jti: session.id,
      ipAddress: session.ipAddress ?? '',
      userAgent: session.userAgent ?? '',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(401)
    if (result.status !== 'error') throw new Error('Token was not revoked')

    expect(result.message).toBe('Session revoked')
  })

  it('should not be able to revalidate with an invalid session ID', async () => {
    const user = await makeUser()
    const invalidSessionId = createId()

    const result = await sut({
      userId: user.id,
      jti: invalidSessionId,
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
    if (result.status !== 'error') throw new Error('Token was not invalid')

    expect(result.message).toBe('Session not found')
  })
})
