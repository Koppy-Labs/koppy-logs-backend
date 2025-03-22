import { faker } from '@faker-js/faker'

import type { UpdateUserModel } from '@/domain/entities/user'
import { makeUser } from '@/test/factories/make-user'

import { updateUserService } from './update-user-service'

let sut: typeof updateUserService

describe('UpdateUserService', () => {
  beforeAll(async () => {
    sut = updateUserService
  })

  it('should be able to update a valid user', async () => {
    const user = await makeUser()

    const newUser: UpdateUserModel = {
      id: user.id,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      avatarUrl: faker.image.url(),
    }

    const result = await sut({
      id: user.id,
      data: newUser,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(204)
    if (result.status !== 'ok') throw new Error('User not updated')

    expect(result.data).toEqual(
      expect.objectContaining({
        id: user.id,
        name: newUser.name,
        email: newUser.email,
      }),
    )
  })

  it('should not be able to update a user with an already registered email', async () => {
    const user = await makeUser()
    const user2 = await makeUser()

    const newUser: UpdateUserModel = {
      id: user.id,
      name: faker.person.fullName(),
      email: user2.email,
      avatarUrl: faker.image.url(),
    }

    const result = await sut({
      id: user.id,
      data: newUser,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(409)
    if (result.status !== 'error') throw new Error('User updated')

    expect(result.message).toBe('Email already in use')
  })

  it('should not be able to update an user that does not exist', async () => {
    const result = await sut({
      id: 'non-existent-user-id',
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.url(),
      },
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
    if (result.status !== 'error') throw new Error('User updated')

    expect(result.message).toBe('User not found')
  })
})
