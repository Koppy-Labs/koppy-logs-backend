import { makeUser } from '@/test/factories/make-user'

import { getUserService } from './get-user-service'

let sut: typeof getUserService

describe('GetUserService', () => {
  beforeAll(async () => {
    sut = getUserService
  })

  it('should be able to get a user by id', async () => {
    const user = await makeUser()

    const result = await sut({ id: user.id })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(200)
    if (result.status !== 'ok') throw new Error('User not created')

    expect(result.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: user.name,
        email: user.email.toLocaleLowerCase(),
        avatarUrl: user.avatarUrl,
      }),
    )
  })

  it('should not be able to get a user by id if the user does not exist', async () => {
    const result = await sut({ id: 'non-existent-user-id' })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
  })
})
