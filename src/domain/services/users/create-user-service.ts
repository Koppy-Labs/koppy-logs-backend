import { findUserByEmail, insertUser } from '@/db/repositories/users'
import { generateOTPCode } from '@/db/repositories/verify-account'
import type { InsertUserModel, User } from '@/domain/entities/user'
import { error, success } from '@/utils/api-response'
import { getCache, ONE_DAY_IN_SECONDS, setCache } from '@/utils/cache'
import { hashPassword } from '@/utils/password'

export async function createUserService({
  name,
  email,
  password,
  avatarUrl,
}: InsertUserModel) {
  const normalizedEmail = email.toLowerCase()
  const cacheKey = `users:${normalizedEmail}`
  const cachedUser = await getCache<User>(cacheKey)

  if (cachedUser)
    return error({
      message: 'Email already in use' as const,
      code: 409,
    })

  const userWithSameEmail = await findUserByEmail({ email: normalizedEmail })

  if (userWithSameEmail) {
    await setCache(
      cacheKey,
      JSON.stringify(userWithSameEmail),
      ONE_DAY_IN_SECONDS,
    )

    return error({
      message: 'Email already in use' as const,
      code: 409,
    })
  }

  const hashedPassword = await hashPassword(password)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...createdUser } = await insertUser({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    avatarUrl,
  })

  const otpCode = await generateOTPCode({ email: normalizedEmail })

  await setCache(cacheKey, JSON.stringify(createdUser), ONE_DAY_IN_SECONDS)

  return success({
    data: {
      user: createdUser,
      otpCode,
    },
    code: 201,
  })
}
