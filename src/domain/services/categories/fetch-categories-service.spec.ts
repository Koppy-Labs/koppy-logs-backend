import { makeCategory } from '@/test/factories/make-category'
import { makeServer } from '@/test/factories/make-server'
import { makeUser } from '@/test/factories/make-user'

import { fetchCategoriesService } from './fetch-categories-service'

let sut: typeof fetchCategoriesService

describe('FetchCategoriesService', () => {
  beforeAll(async () => {
    sut = fetchCategoriesService
  })

  it('should be able to get all categories by server id', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })

    for (let i = 0; i < 10; i++) {
      await makeCategory({
        serverId: server.id,
      })
    }

    const result = await sut({ serverId: server.id })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(200)
    if (result.status !== 'ok') throw new Error('User not created')

    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          serverId: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ]),
    )
  })

  it('should not be able to get all categories by server id if the server does not exist', async () => {
    const result = await sut({ serverId: 'non-existent-server-id' })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(200)
    expect(result.data).toEqual([])
  })
})
