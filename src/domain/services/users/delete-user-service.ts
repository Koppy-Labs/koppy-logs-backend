import { deleteUser, findUserById } from '@/db/repositories/users'
import { error, success } from '@/utils/api-response'

export async function deleteUserService({ id }: { id: string }) {
  const user = await findUserById({ id })

  if (!user)
    return error({
      message: 'User not found' as const,
      code: 404,
    })

  await deleteUser({ id })

  return success({
    data: null,
    code: 204,
  })
}
