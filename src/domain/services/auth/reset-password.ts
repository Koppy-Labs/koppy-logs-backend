import {
  deleteRecoveryRequestById,
  findRecoveryRequestById,
} from '@/db/repositories/password-recovery-request'
import { findUserById, updatePassword } from '@/db/repositories/users'
import type { User } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import {
  deleteCache,
  getCache,
  ONE_WEEK_IN_SECONDS,
  setCache,
} from '@/utils/cache'
import { hashPassword } from '@/utils/password'

export async function resetPasswordService({
  code,
  password,
}: {
  code: string
  password: string
}) {
  const recoveryRequest = await findRecoveryRequestById({ id: code })

  if (!recoveryRequest)
    return error({
      message: 'Request not found' as const,
      code: 404,
    })

  const cachedUser = await getCache<User>(`user:${recoveryRequest.userId}`)
  let user = cachedUser

  if (!user) {
    user = await findUserById({ id: recoveryRequest.userId })

    if (user)
      await setCache(
        `user:${recoveryRequest.userId}`,
        JSON.stringify(user),
        ONE_WEEK_IN_SECONDS,
      )
  }

  if (!user)
    return error({
      message: 'User not found' as const,
      code: 404,
    })

  const hashedPassword = await hashPassword(password)

  await updatePassword({ id: user.id, password: hashedPassword })
  await deleteRecoveryRequestById({ id: code })
  await deleteCache(`user:${user.id}:*`)
  await deleteCache(`user:${user.email}:*`)

  return success({
    data: null,
    code: 204,
  })
}
