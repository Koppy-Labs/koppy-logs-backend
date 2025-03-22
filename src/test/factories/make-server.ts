import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'

import { createServer } from '@/db/repositories/server'
import type { InsertServerModel } from '@/domain/entities/server'
import type { RemoveNull } from '@/types/remove-null'

import { makeUser } from './make-user'

export async function makeServer(
  server: RemoveNull<Partial<InsertServerModel>> = {},
) {
  const rawServer = makeRawServer(server)

  // If no ownerId is provided, create a user first
  if (!rawServer.ownerId) {
    const user = await makeUser()
    rawServer.ownerId = user.id
  }

  return await createServer({
    ...rawServer,
  })
}

export function makeRawServer(
  server: RemoveNull<Partial<InsertServerModel>> = {},
) {
  const rawServer: InsertServerModel = {
    id: createId(),
    name: faker.person.fullName(),
    imageUrl: faker.image.url(),
    ownerId: createId(),
    createdAt: new Date(),
    updatedAt: new Date(),

    ...server,
  }

  return rawServer
}
