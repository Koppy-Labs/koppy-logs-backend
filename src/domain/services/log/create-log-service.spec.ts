import { makeCategory } from '@/test/factories/make-category'
import { makeServer } from '@/test/factories/make-server'
import { makeUser } from '@/test/factories/make-user'
import { logPubSub } from '@/utils/log-pub-sub'

import { createLogService } from './create-log-service'

let sut: typeof createLogService

describe('CreateLogService', () => {
  beforeAll(async () => {
    sut = createLogService
  })

  it('should be able to create a valid log', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })
    const category = await makeCategory({
      serverId: server.id,
    })

    const result = await sut({
      message: 'test',
      serverId: server.id,
      categoryId: category.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(201)
    if (result.status !== 'ok') throw new Error('Log not created')

    expect(result.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        message: 'test',
        serverId: server.id,
        categoryId: category.id,
        createdAt: expect.any(Date),
      }),
    )
  })

  it('should not be able to create a log with an invalid category', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })

    const result = await sut({
      message: 'test',
      serverId: server.id,
      categoryId: 'invalid-category-id',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('error')
    expect(result.code).toBe(404)
  })

  it('should publish log to pub/sub when created', async () => {
    const user = await makeUser()
    const server = await makeServer({
      ownerId: user.id,
    })
    const category = await makeCategory({
      serverId: server.id,
    })

    const publishSpy = vi.spyOn(logPubSub, 'publish')

    const result = await sut({
      message: 'test pub/sub',
      serverId: server.id,
      categoryId: category.id,
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('ok')
    expect(result.code).toBe(201)
    if (result.status !== 'ok') throw new Error('Log not created')

    expect(publishSpy).toHaveBeenCalledTimes(1)
    expect(publishSpy).toHaveBeenCalledWith({
      serverId: server.id,
      message: expect.objectContaining({
        message: 'test pub/sub',
        serverId: server.id,
        categoryId: category.id,
      }),
    })

    publishSpy.mockRestore()
  })
})
