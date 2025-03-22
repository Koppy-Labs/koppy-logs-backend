import { makeCategory } from '@/test/factories/make-category'
import { makeServer } from '@/test/factories/make-server'
import { makeUser } from '@/test/factories/make-user'

import { getCategoryService } from './get-category-service'

let sut: typeof getCategoryService

describe('GetCategoryService', () => {
  beforeAll(async () => {
    sut = getCategoryService
  })

  it('should be able to get a category by id', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })
    const category = await makeCategory({
      serverId: server.id,
    })

    const result = await sut({ id: category.id, serverId: server.id })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(200)
    if (result.status !== 'ok') throw new Error('Category not found')

    expect(result.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: category.name,
        serverId: server.id,
      }),
    )
  })

  it('should not be able to get a category by id if the category does not exist', async () => {
    const result = await sut({
      id: 'non-existent-category-id',
      serverId: 'non-existent-server-id',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
  })
})
