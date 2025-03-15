import { findUserById } from '@/db/repositories/users'
import { error, success } from '@/utils/api-response'

export async function getUserService({ id }: { id: string }) {
  const user = await findUserById({ id })

  if (!user) return error({ message: 'User not found', code: 404 })

  return success({
    data: user,
    code: 200,
  })
}
