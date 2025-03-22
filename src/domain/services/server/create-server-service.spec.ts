import { makeRawServer } from '@/test/factories/make-server'
import { makeUser } from '@/test/factories/make-user'

import { createServerService } from './create-server-service'

let sut: typeof createServerService

describe('UpdateUserService', () => {
  beforeAll(async () => {
    sut = createServerService
  })

  it('should be able to create a valid server', async () => {
    const user = await makeUser()
    const rawServer = makeRawServer({
      ownerId: user.id,
    })

    const result = await sut(rawServer)

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(204)
    if (result.status !== 'ok') throw new Error('Server not created')

    expect(result.data).toEqual(
      expect.objectContaining({
        id: result.data.id,
        name: rawServer.name,
        imageUrl: rawServer.imageUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    )
  })

  it('should not be able to create a server with an invalid user id', async () => {
    const rawServer = makeRawServer({
      ownerId: 'invalid-user-id',
    })

    const result = await sut(rawServer)

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
    if (result.status !== 'error') throw new Error('Server created')

    expect(result.message).toBe('User not found')
  })
})
