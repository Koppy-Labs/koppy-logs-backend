import { findUserByEmail, insertUser } from '@/db/repositories/users'
import type { InsertUserModel } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import { hashPassword } from '@/utils/password'

export async function createUserService({
  name,
  email,
  password,
  avatarUrl,
}: InsertUserModel) {
  const userWithSameEmail = await findUserByEmail({ email })

  if (userWithSameEmail)
    return error({
      message: 'Email already in use' as const,
      code: 409,
    })

  const hashedPassword = await hashPassword(password)

  const createdUser = await insertUser({
    name,
    email,
    password: hashedPassword,
    avatarUrl,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...user } = createdUser

  return success({
    data: user,
    code: 204,
  })
}
