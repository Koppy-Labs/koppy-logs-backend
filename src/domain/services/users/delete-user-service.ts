import { deleteUser, findUserById } from '@/db/repositories/users'
import type { User } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import {
  deleteCache,
  getCache,
  ONE_DAY_IN_SECONDS,
  setCache,
} from '@/utils/cache'

export async function deleteUserService({ id }: { id: string }) {
  const cacheKey = `users:${id}`
  const cachedUser = await getCache<User>(cacheKey)

  if (!cachedUser) {
    const user = await findUserById({ id })

    if (!user)
      return error({
        message: 'User not found' as const,
        code: 404,
      })

    await setCache(cacheKey, JSON.stringify(user), ONE_DAY_IN_SECONDS)
  }

  await deleteUser({ id })
  await deleteCache(cacheKey)

  return success({
    data: null,
    code: 204,
  })
}
