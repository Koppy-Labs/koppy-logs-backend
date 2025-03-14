import { findUserByEmail, insertUser } from '@/db/repositories/users'
import type { InsertUserModel } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'

export async function createUserService({
  name,
  email,
  password,
  avatarUrl,
}: InsertUserModel) {
  const userWithSameEmail = await findUserByEmail({ email })

  if (userWithSameEmail)
    return error({
      message: 'Email already in use',
      code: 400,
    })

  await insertUser({ name, email, password, avatarUrl })

  return success({
    data: null,
    code: 204,
  })
}
