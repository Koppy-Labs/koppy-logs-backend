import { createServer } from '@/db/repositories/server'
import { findUserById } from '@/db/repositories/users'
import { InsertServerModel } from '@/domain/entities/server'
import type { User } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import { getCache } from '@/utils/cache'

export async function createServerService({
  name,
  ownerId,
  imageUrl,
  plan,
}: InsertServerModel) {
  const cachedUser = await getCache<User>(`users:${ownerId}`)

  if (!cachedUser) {
    const user = await findUserById({ id: ownerId })

    if (!user)
      return error({
        message: 'User not found',
        code: 404,
      })
  }

  const server = await createServer({ name, ownerId, imageUrl, plan })

  return success({
    data: server,
    code: 204,
  })
}
