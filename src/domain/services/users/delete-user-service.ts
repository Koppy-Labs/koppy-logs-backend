import { deleteUser, findUserById } from '@/db/repositories/users'
import { error, success } from '@/utils/api-response'

export async function deleteUserService({ id }: { id: string }) {
  const user = await findUserById({ id })

  if (!user) {
    return error({
      message: 'User not found',
      code: 404,
    })
  }

  try {
    await deleteUser({ id })
    return success({
      data: 'User deleted successfully',
      code: 204,
    })
  } catch (error) {
    return error({
      message: 'Failed to delete user',
      code: 500,
    })
  }
}
