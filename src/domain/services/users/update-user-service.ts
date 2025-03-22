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

  if (!user)
    return error({
      message: 'User not found' as const,
      code: 404,
    })

  await updateUser({
    id,
    data,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = user

  return success({
    data: userWithoutPassword,
    code: 204,
  })
}
