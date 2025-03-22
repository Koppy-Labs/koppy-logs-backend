import { createServer } from '@/db/repositories/server'
import { InsertServerModel, type Server } from '@/domain/entities/server'
import { success } from '@/utils/api-response'
import { getCache } from '@/utils/cache'

export async function createServerService({
  name,
  ownerId,
  imageUrl,
  plan,
}: InsertServerModel) {
  const cacheKey = `servers:${ownerId}`
  const cachedServers = await getCache<Server[]>(cacheKey)

  if (cachedServers)
    return success({
      data: cachedServers,
      code: 200,
    })

  const server = await createServer({ name, ownerId, imageUrl, plan })
  return success({
    data: server,
    code: 204,
  })
}
