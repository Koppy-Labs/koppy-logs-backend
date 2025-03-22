import { faker } from '@faker-js/faker'

import type { UpdateCategoryModel } from '@/domain/entities/categories'
import { makeCategory } from '@/test/factories/make-category'
import { makeServer } from '@/test/factories/make-server'
import { makeUser } from '@/test/factories/make-user'

import { updateCategoryService } from './update-category-service'

let sut: typeof updateCategoryService

describe('UpdateCategoryService', () => {
  beforeAll(async () => {
    sut = updateCategoryService
  })

  it('should be able to update a valid category', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })
    const category = await makeCategory({
      serverId: server.id,
    })

    const newCategory: UpdateCategoryModel = {
      id: category.id,
      data: {
        name: faker.person.fullName(),
        serverId: server.id,
      },
    }

    const result = await sut(newCategory)

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(204)
    if (result.status !== 'ok') throw new Error('User not updated')

    expect(result.data).toEqual(
      expect.objectContaining({
        id: category.id,
        name: newCategory.data.name,
        serverId: server.id,
      }),
    )
  })

  it('should not be able to update a user with an already registered email', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })
    const category = await makeCategory({
      serverId: server.id,
    })
    const category2 = await makeCategory({
      serverId: server.id,
    })

    const newCategory: UpdateCategoryModel = {
      id: category.id,
      data: {
        name: category2.name,
        serverId: server.id,
      },
    }

    const result = await sut(newCategory)

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(409)
    if (result.status !== 'error') throw new Error('Category updated')

    expect(result.message).toBe('Category already exists')
  })

  it('should not be able to update an user that does not exist', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })

    const result = await sut({
      id: 'non-existent-user-id',
      data: {
        name: faker.person.fullName(),
        serverId: server.id,
      },
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
    if (result.status !== 'error') throw new Error('Category updated')

    expect(result.message).toBe('Category not found')
  })
})
