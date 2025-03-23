import { makeSession } from '@/test/factories/make-session'
import { makeRawUser, makeUser } from '@/test/factories/make-user'

import { authenticateUserService } from './authenticate-user-service'

let sut: typeof authenticateUserService

describe('AuthenticateUserService', () => {
  beforeAll(async () => {
    sut = authenticateUserService
  })

  it('should be able to create a valid user', async () => {
    const rawUser = await makeUser({
      password: 'password',
    })

    const result = await sut({
      email: rawUser.email,
      password: 'password',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(204)
    if (result.status !== 'ok') throw new Error('User not created')

    expect(result.data).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    )
  })

  it('should not be able to create a valid user if the session is already active', async () => {
    const user = await makeUser({
      password: 'password',
    })

    const session = await makeSession({
      userId: user.id,
      status: 'active',
    })

    const result = await sut({
      email: user.email,
      password: 'password',
      ipAddress: session.ipAddress ?? '127.0.0.1',
      userAgent: session.userAgent ?? 'test',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(409)
    if (result.status !== 'error') throw new Error('Succeded')

    expect(result.message).toEqual(
      'User already has a session active with this device',
    )
  })

  it('should not be able to create a valid user if the user does not exist', async () => {
    const rawUser = makeRawUser({
      password: 'password',
    })

    const result = await sut({
      email: rawUser.email,
      password: 'password',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(401)
    if (result.status !== 'error') throw new Error('Succeded')

    expect(result.message).toEqual('Invalid credentials')
  })

  it('should not be able to create a valid user if the user password is invalid', async () => {
    const rawUser = await makeUser()

    const result = await sut({
      email: rawUser.email,
      password: 'invalid-password',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(401)
    if (result.status !== 'error') throw new Error('Succeded')

    expect(result.message).toEqual('Invalid credentials')
  })
})
