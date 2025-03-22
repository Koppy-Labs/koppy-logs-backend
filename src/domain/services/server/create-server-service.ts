import { createServer } from '@/db/repositories/server'
import { InsertServerModel } from '@/domain/entities/server'
import { success } from '@/utils/api-response'

export async function createServerService({
  name,
  ownerId,
  imageUrl,
  plan,
}: InsertServerModel) {
  const server = await createServer({ name, ownerId, imageUrl, plan })

  return success({
    data: server,
    code: 204,
  })
}
