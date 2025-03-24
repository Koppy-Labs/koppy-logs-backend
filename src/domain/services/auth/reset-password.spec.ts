import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'

import { makePasswordRecoveryRequest } from '@/test/factories/make-password-recovery-request'
import { makeUser } from '@/test/factories/make-user'

import { authenticateUserService } from './authenticate-user-service'
import { resetPasswordService } from './reset-password'

let sut: typeof resetPasswordService

describe('ResetPassword', () => {
  beforeAll(async () => {
    sut = resetPasswordService
  })

  it('should be able to reset a password', async () => {
    const user = await makeUser()

    const recoveryRequest = await makePasswordRecoveryRequest({
      userId: user.id,
    })

    const result = await sut({
      code: recoveryRequest.id,
      password: '123',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(204)
    if (result.status !== 'ok') throw new Error('Token was not revalidated')

    expect(result.data).toBeNull()
  })

  it('should not be able to reset a password with an invalid recovery code', async () => {
    const invalidCode = createId()

    const result = await sut({
      code: invalidCode,
      password: 'new-password123',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
    if (result.status !== 'error') throw new Error('Invalid code was accepted')

    expect(result.message).toBe('Request not found')
  })

  it('should not be able to reset a password with an expired recovery request', async () => {
    const user = await makeUser()

    const recoveryRequest = await makePasswordRecoveryRequest({
      userId: user.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours (2 days) in the past
    })

    const result = await sut({
      code: recoveryRequest.id,
      password: 'new-password123',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(401)
    if (result.status !== 'error')
      throw new Error('Expired request was accepted')

    expect(result.message).toBe('Recovery request expired')
  })

  it('should allow user to authenticate with the new password after reset', async () => {
    const user = await makeUser({
      email: faker.internet.email(),
      password: 'old-password123',
    })

    const recoveryRequest = await makePasswordRecoveryRequest({
      userId: user.id,
    })

    const newPassword = 'new-password123'

    // Reset the password
    const resetResult = await sut({
      code: recoveryRequest.id,
      password: newPassword,
    })

    expect(resetResult.status).toBe('ok')

    // Try to authenticate with the new password
    const authResult = await authenticateUserService({
      email: user.email,
      password: newPassword,
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    })

    expect(authResult).toBeDefined()
    expect(authResult.status).toBe('ok')
    expect(authResult.code).toBe(204)
    if (authResult.status !== 'ok')
      throw new Error('Authentication with new password failed')

    expect(authResult.data.accessToken).toBeDefined()
    expect(authResult.data.refreshToken).toBeDefined()
  })
})
