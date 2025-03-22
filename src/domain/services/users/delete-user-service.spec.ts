import { makeRawUser, makeUser } from '@/test/factories/make-user'

import { deleteUserService } from './delete-user-service'

let sut: typeof deleteUserService

describe('DeleteUserService', () => {
  beforeAll(async () => {
    sut = deleteUserService
  })

  it('should be able to create a valid user', async () => {
    const rawUser = await makeUser()

    const result = await sut({
      id: rawUser.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(204)
    if (result.status !== 'ok') throw new Error('Delete user failed')

    expect(result.data).toBeNull()
  })

  it('should not be able to delete a non-existent user', async () => {
    const user = makeRawUser()

    if (!user.id) throw new Error('User not created')

    const result = await sut({
      id: user.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
  })
})
