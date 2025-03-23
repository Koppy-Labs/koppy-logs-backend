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
})
