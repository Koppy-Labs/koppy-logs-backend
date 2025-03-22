import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'

import { createServer } from '@/db/repositories/server'
import type { InsertServerModel } from '@/domain/entities/server'
import type { RemoveNull } from '@/types/remove-null'

export async function makeServer(
  server: RemoveNull<Partial<InsertServerModel>> = {},
) {
  const rawServer = makeRawServer(server)

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
