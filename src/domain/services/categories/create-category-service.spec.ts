import { makeCategory } from '@/test/factories/make-category'
import { makeServer } from '@/test/factories/make-server'
import { makeUser } from '@/test/factories/make-user'

import { createCategoryService } from './create-category-service'

let sut: typeof createCategoryService

describe('CreateCategoryService', () => {
  beforeAll(async () => {
    sut = createCategoryService
  })

  it('should be able to create a valid category', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })

    const result = await sut({
      name: 'test',
      serverId: server.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(201)
    if (result.status !== 'ok') throw new Error('Category not created')

    expect(result.data).toEqual(
      expect.objectContaining({
        name: 'test',
        id: expect.any(String),
        serverId: server.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    )
  })

  it('should not be able to create a category with an already registered name', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })

    await makeCategory({
      name: 'test',
      serverId: server.id,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await sut({
      name: 'test',
      serverId: server.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(409)
  })
})
