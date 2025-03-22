import {
  findUserByEmail,
  findUserById,
  updateUser,
} from '@/db/repositories/users'
import { UpdateUserModel, type User } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_DAY_IN_SECONDS, setCache } from '@/utils/cache'

export async function updateUserService({
  id,
  data,
}: {
  id: string
  data: UpdateUserModel
}) {
  const cacheKey = `users:${id}`
  const cachedUser = await getCache<User>(cacheKey)

  if (!cachedUser) {
    const user = await findUserById({ id })

    if (!user)
      return error({
        message: 'User not found' as const,
        code: 404,
      })
  }

  if (data.email) {
    const emailAlreadyInUse = await findUserByEmail({ email: data.email })

    if (emailAlreadyInUse)
      return error({
        message: 'Email already in use' as const,
        code: 409,
      })
  }

  const updatedUser = await updateUser({
    id,
    data,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = updatedUser

  await setCache(
    cacheKey,
    JSON.stringify(userWithoutPassword),
    ONE_DAY_IN_SECONDS,
  )

  return success({
    data: userWithoutPassword,
    code: 204,
  })
}
