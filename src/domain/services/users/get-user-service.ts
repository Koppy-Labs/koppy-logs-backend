import { findUserById } from '@/db/repositories/users'
import type { User } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_DAY_IN_SECONDS, setCache } from '@/utils/cache'

export async function getUserService({ id }: { id: string }) {
  const cacheKey = `users:${id}`
  const cachedUser = await getCache<User>(cacheKey)

  if (cachedUser)
    return success({
      data: cachedUser,
      code: 200,
    })

  const user = await findUserById({ id })

  if (!user) return error({ message: 'User not found' as const, code: 404 })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = user

  await setCache(
    cacheKey,
    JSON.stringify(userWithoutPassword),
    ONE_DAY_IN_SECONDS,
  )

  return success({
    data: userWithoutPassword,
    code: 200,
  })
}
