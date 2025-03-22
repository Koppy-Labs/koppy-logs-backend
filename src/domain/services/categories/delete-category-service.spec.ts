import { makeCategory, makeRawCategory } from '@/test/factories/make-category'
import { makeServer } from '@/test/factories/make-server'
import { makeUser } from '@/test/factories/make-user'

import { deleteCategoryService } from './delete-category-service'

let sut: typeof deleteCategoryService

describe('DeleteCategoryService', () => {
  beforeAll(async () => {
    sut = deleteCategoryService
  })

  it('should be able to delete a valid category', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })
    const category = await makeCategory({
      serverId: server.id,
    })

    const result = await sut({
      id: category.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(204)
    if (result.status !== 'ok') throw new Error('Delete user failed')

    expect(result.data).toBeNull()
  })

  it('should not be able to delete a non-existent category', async () => {
    const category = makeRawCategory()

    if (!category.id) throw new Error('Category not created')

    const result = await sut({
      id: category.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
  })
})
