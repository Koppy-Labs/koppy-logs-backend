import { makePasswordRecoveryRequest } from '@/test/factories/make-password-recovery-request'
import { makeUser } from '@/test/factories/make-user'

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
})
