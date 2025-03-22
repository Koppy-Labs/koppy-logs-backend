import { InsertServerModel } from '@/domain/entities/server'

import { db } from '..'
import { servers } from '../schemas'

export async function createServer({
  name,
  ownerId,
  imageUrl,
  plan,
}: InsertServerModel) {
  const server = await db
    .insert(servers)
    .values({ name, ownerId, imageUrl, plan })
    .returning()

  return server[0]
}
