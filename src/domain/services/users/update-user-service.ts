import { findUserById, updateUser } from '@/db/repositories/users'
import { UpdateUserModel } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'

export async function updateUserService({
  id,
  data,
}: {
  id: string
  data: UpdateUserModel
}) {
  const user = await findUserById({ id })

  if (!user) {
    return error({
      message: 'User not found',
      code: 404,
    })
  }

  await updateUser({
    id,
    data: {
      ...user,
      ...data,
    },
  })

  return success({
    data: null,
    code: 204,
  })
}
