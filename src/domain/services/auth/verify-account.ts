import { findUserByEmail, updateUserVerified } from '@/db/repositories/users'
import type { User } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_WEEK_IN_SECONDS, setCache } from '@/utils/cache'

export async function verifyAccount({ email }: { email: string }) {
  let user = await getCache<User>(`user:${email}`)

  if (!user) user = await findUserByEmail({ email })

  if (!user) {
    return error({
      message: 'User not found' as const,
      code: 404,
    })
  }

  if (user.verified) {
    await setCache(`user:${email}`, JSON.stringify(user), ONE_WEEK_IN_SECONDS)

    return error({
      message: 'User is already verified' as const,
      code: 400,
    })
  }

  const updatedUser = await updateUserVerified({
    id: user.id,
    verified: true,
  })

  await setCache(
    `user:${email}`,
    JSON.stringify(updatedUser),
    ONE_WEEK_IN_SECONDS,
  )

  return success({
    data: updatedUser,
    code: 200,
  })
}
