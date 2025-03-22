import { InsertServerModel } from '@/domain/entities/server'

import { db } from '..'
import { servers } from '../schemas'

export async function createServer({
  name,
  ownerId,
  imageUrl,
  plan,
}: InsertServerModel) {
  await db.insert(servers).values({ name, ownerId, imageUrl, plan })
}
