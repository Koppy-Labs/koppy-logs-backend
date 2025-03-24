import { makeRawUser, makeUser } from '@/test/factories/make-user'

import { createUserService } from './create-user-service'

let sut: typeof createUserService

describe('CreateUserService', () => {
  beforeAll(async () => {
    sut = createUserService
  })

  it('should be able to create a valid user', async () => {
    const rawUser = makeRawUser({
      password: 'password',
    })

    const result = await sut({
      name: rawUser.name,
      email: rawUser.email,
      password: rawUser.password,
      avatarUrl: rawUser.avatarUrl ?? undefined,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(201)
    if (result.status !== 'ok') throw new Error('User not created')

    expect(result.data).toEqual({
      otpCode: expect.any(String),
      user: {
        name: rawUser.name,
        id: expect.any(String),
        email: rawUser.email.toLocaleLowerCase(),
        avatarUrl: rawUser.avatarUrl ?? undefined,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        verified: false,
      },
    })
  })

  it('should not be able to create a user with an already registered email', async () => {
    const user = await makeUser()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await sut({
      name: user.name,
      email: user.email,
      password: user.password,
      avatarUrl: user.avatarUrl,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(409)
  })
})
