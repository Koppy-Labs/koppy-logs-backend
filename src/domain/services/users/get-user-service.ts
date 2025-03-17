import { findUserById } from '@/db/repositories/users'
import { error, success } from '@/utils/api-response'

export async function getUserService({ id }: { id: string }) {
  const user = await findUserById({ id })

  if (!user) return error({ message: 'User not found', code: 404 })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user

  return success({
    data: userWithoutPassword,
    code: 200,
  })
}
