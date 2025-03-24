import { generateOTPCode } from '@/db/repositories/verify-account'
import { makeUser } from '@/test/factories/make-user'

import { verifyAccount } from './verify-account'

let sut: typeof verifyAccount

describe('VerifyAccount', () => {
  beforeAll(async () => {
    sut = verifyAccount
  })

  it('should be able to verify an account', async () => {
    const user = await makeUser({
      verified: false,
    })

    const otpCode = await generateOTPCode({ email: user.email })

    const result = await sut({
      email: user.email,
      code: otpCode.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(200)
    if (result.status !== 'ok') throw new Error('Token was not revalidated')

    expect(result.data).toBeDefined()
    expect(result.data).toEqual(
      expect.objectContaining({
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        password: user.password,
        verified: true,
        createdAt: user.createdAt,
        updatedAt: expect.any(Date),
      }),
    )
  })
})
